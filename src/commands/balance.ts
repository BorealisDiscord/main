import { SlashCommandBuilder } from '@discordjs/builders';
import Borealis from '../classes/borealis';
import { MessageEmbed, CommandInteraction } from 'discord.js';
import db from 'quick.db';
import Embed from '../classes/Embed';

export const data = new SlashCommandBuilder()
    .setName('balance')
    .setDescription("Check balance of your or someone else's wallet.")
    .addUserOption(option => option.setName('user').setDescription('A user whose wallet should be checked'));

export async function execute(interaction: CommandInteraction, client: Borealis) {
    const uWallet = interaction.options.getUser('user');
    const embed = new Embed().setColor('BLUE');

    if (db.get(`${interaction.guild.id}.${interaction.user.id}.wallet`) == null) {
        db.set(`${interaction.guild.id}.${interaction.user.id}.wallet`, 0);
        db.set(`${interaction.guild.id}.${interaction.user.id}.bank`, 0);
    }

    if (uWallet && db.get(`${interaction.guild.id}.${uWallet.id}.wallet`) == null) {
        db.set(`${interaction.guild.id}.${uWallet.id}.wallet`, 0);
        db.set(`${interaction.guild.id}.${uWallet.id}.bank`, 0);
    }

    if (!uWallet) {
        embed
            .setAuthor({ name: 'Your balance', iconURL: interaction.user.displayAvatarURL({ dynamic: true }) })
            .addField(':dollar: In cash', `$${db.get(`${interaction.guild.id}.${interaction.user.id}.wallet`)}`, true)
            .addField(':bank: In bank', `$${db.get(`${interaction.guild.id}.${interaction.user.id}.bank`)}`, true)
            .addField(
                ':1234: Overall net worth',
                `$${
                    db.get(`${interaction.guild.id}.${interaction.user.id}.wallet`) +
                    db.get(`${interaction.guild.id}.${interaction.user.id}.bank`)
                }`,
                true
            );
    } else {
        embed
            .setAuthor({ name: `Balance of user ${uWallet.tag}`, iconURL: uWallet.displayAvatarURL({ dynamic: true }) })
            .addField(':dollar: In cash', `$${db.get(`${interaction.guild.id}.${uWallet.id}.wallet`)}`, true)
            .addField(':bank: In bank', `$${db.get(`${interaction.guild.id}.${uWallet.id}.bank`)}`, true)
            .addField(
                ':1234: Overall net worth',
                `$${
                    db.get(`${interaction.guild.id}.${uWallet.id}.wallet`) +
                    db.get(`${interaction.guild.id}.${uWallet.id}.bank`)
                }`,
                true
            );
    }

    await interaction.reply({ embeds: [embed] });
}
