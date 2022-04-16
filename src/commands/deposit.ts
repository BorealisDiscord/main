import { SlashCommandBuilder } from '@discordjs/builders';
import { CommandInteraction } from 'discord.js';
import db from 'quick.db';

export const data = new SlashCommandBuilder()
    .setName('deposit')
    .setDescription('Deposit your money to the bank.')
    .addIntegerOption(option =>
        option.setName('money').setDescription('How much money you want to deposit?').setRequired(true)
    );
export async function execute(interaction: CommandInteraction) {
    const money = interaction.options.getInteger('money');

    if (money > db.get(`${interaction.guild.id}.${interaction.user.id}.wallet`))
        return interaction.reply({
            content: `You are trying to deposit **$${money}**, although you have only **$${db.get(
                `${interaction.guild.id}.${interaction.user.id}.wallet`
            )}** remaining in your wallet.`,
            ephemeral: true
        });

    if (money <= 0)
        return interaction.reply({
            content: `You cannot deposit amount of money worth zero or below to your bank!`,
            ephemeral: true
        });

    db.subtract(`${interaction.guild.id}.${interaction.user.id}.wallet`, money);
    db.add(`${interaction.guild.id}.${interaction.user.id}.bank`, money);

    await interaction.reply(`Successfully deposited **$${money}** to your bank!`);
}
