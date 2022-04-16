import { SlashCommandBuilder } from '@discordjs/builders';
import Embed from '../classes/Embed';
import { CommandInteraction, MessageEmbed, TextChannel } from 'discord.js';

export const data = new SlashCommandBuilder()
    .setName('embed')
    .setDescription('Send the embed of your dreams.')
    .addStringOption(option => option.setName('title').setDescription('Title of the embed').setRequired(true))
    .addStringOption(option =>
        option.setName('description').setDescription('Description of the embed').setRequired(true)
    )
    .addStringOption(option => option.setName('color').setDescription('Color of the embed').setRequired(true))
    .addChannelOption(option =>
        option.setName('channel').setDescription('Optionally, choose the channel you want to appear embed to.')
    )
    .addStringOption(option => option.setName('footer').setDescription('Optionally, apply a footer to your embed.'));
export async function execute(interaction: CommandInteraction) {
    if (interaction.options.getString('title').length > 256)
        return interaction.reply({
            content: 'Title of the embed cannot exceed 256 characters!',
            ephemeral: true
        });

    if (interaction.options.getString('description').length > 4096)
        return interaction.reply({
            content: 'Description of the embed cannot exceed 4096 characters!',
            ephemeral: true
        });

    const embed = new Embed()
        .setTitle(interaction.options.getString('title'))
        .setDescription(interaction.options.getString('description'))
        // @ts-ignore
        .setColor(interaction.options.getString('color'))
        .setFooter({ text: interaction.options.getString('footer') });

    if (!interaction.options.getChannel('channel'))
        return interaction
            .reply({
                content: 'Embed has been successfully sent!',
                ephemeral: true
            })
            .then(() => {
                interaction.followUp({ embeds: [embed] });
            });
    else {
        if (interaction.options.getChannel('channel')?.type === 'GUILD_TEXT') {
            interaction
                .reply({
                    content: `Embed has been successfully sent to the <#${
                        interaction.options.getChannel('channel').id
                    }> channel!`,
                    ephemeral: true
                })
                .then(() => {
                    const channel = interaction.options.getChannel('channel') as TextChannel;
                    channel.send({ embeds: [embed] });
                });
        } else {
            interaction.reply({
                content: `Channel you want to send an embed to isn't a text channel!`,
                ephemeral: true
            });
        }
    }
}
