import { SlashCommandBuilder } from '@discordjs/builders';
import Embed from '../classes/Embed';
import { MessageActionRow, MessageButton, CommandInteraction } from 'discord.js';
import db from 'quick.db';

export const data = new SlashCommandBuilder()
    .setName('config')
    .setDescription('Configure the server to your needs.')
    .addSubcommand(subcommand =>
        subcommand.setName('tags').setDescription('List of available tags supported by Borealis.')
    )
    .addSubcommand(subcommand =>
        subcommand
            .setName('joinlog')
            .setDescription('Configure join messages.')
            .addChannelOption(option =>
                option.setName('channel').setDescription('The channel to send join messages to.').setRequired(true)
            )
            .addStringOption(option =>
                option
                    .setName('message')
                    .setDescription(
                        'The message Borealis will send to the joining member. Tags from /config tags are supported.'
                    )
                    .setRequired(true)
            )
    )
    .addSubcommand(subcommand =>
        subcommand
            .setName('leavelog')
            .setDescription('Configure leave messages.')
            .addChannelOption(option =>
                option.setName('channel').setDescription('The channel to send leave messages to.').setRequired(true)
            )
            .addStringOption(option =>
                option
                    .setName('message')
                    .setDescription(
                        'The message Borealis will send to the leaving member. Tags from /config tags are supported.'
                    )
                    .setRequired(true)
            )
    )
    .addSubcommand(subcommand =>
        subcommand
            .setName('msglog')
            .setDescription('Configure message logs.')
            .addChannelOption(option =>
                option
                    .setName('channel')
                    .setDescription('Borealis will send deleted/edited message logs right here.')
                    .setRequired(true)
            )
    )
    .addSubcommand(subcommand =>
        subcommand.setName('reset').setDescription('Reset all config entries. WARNING: action is irreversible!')
    );
export async function execute(interaction: CommandInteraction) {
    if (!interaction.memberPermissions.has('MANAGE_GUILD'))
        return interaction.reply({ content: 'Insufficient permissions to run this command!', ephemeral: true });
    switch (interaction.options.getSubcommand()) {
        case 'tags':
            const embed = new Embed()
                .setTitle('Supported tags')
                .setDescription('Following tags are supported by Borealis:')
                .addField(
                    'Welcome & goodbye messages',
                    '`{user.id}` - user ID\n`{user.discrim}` - 4-digit user discriminator (e.g. 0752)\n`{user.nickname}` - global nickname of the user'
                )
                .setColor('BLUE');
            interaction.reply({ embeds: [embed] });
            break;
        case 'joinlog':
            const jChannel = interaction.options.getChannel('channel');
            const jMessage = interaction.options.getString('message');

            if (jChannel.type !== 'GUILD_TEXT')
                return interaction.reply({
                    content: 'Specified channel is not a text channel. Try again!',
                    ephemeral: true
                });
            else {
                db.set(`${interaction.guild.id}.config.joinlog.channel`, jChannel.id);
                db.set(`${interaction.guild.id}.config.joinlog.message`, jMessage);
                interaction.reply({ content: 'Join message configuration successfully saved!', ephemeral: true });
            }
            break;
        case 'leavelog':
            const lChannel = interaction.options.getChannel('channel');
            const lMessage = interaction.options.getString('message');

            if (lChannel.type !== 'GUILD_TEXT')
                return interaction.reply({
                    content: 'Specified channel is not a text channel. Try again!',
                    ephemeral: true
                });
            else {
                db.set(`${interaction.guild.id}.config.leavelog.channel`, lChannel.id);
                db.set(`${interaction.guild.id}.config.leavelog.message`, lMessage);
                interaction.reply({ content: 'Leave message configuration successfully saved!', ephemeral: true });
            }
            break;
        case 'msglog':
            const mlChannel = interaction.options.getChannel('channel');

            if (mlChannel.type !== 'GUILD_TEXT')
                return interaction.reply({
                    content: 'Specified channel is not a text channel. Try again!',
                    ephemeral: true
                });
            else {
                db.set(`${interaction.guild.id}.config.msglog.channel`, mlChannel.id);
                interaction.reply({ content: `Message log configuration successfully saved!`, ephemeral: true });
            }
            break;
        case 'reset':
            const row = new MessageActionRow().addComponents(
                new MessageButton().setLabel('Yes').setStyle('DANGER').setCustomId('yes'),
                new MessageButton().setLabel('No').setStyle('SECONDARY').setCustomId('no')
            );
            const confirm = new Embed()
                .setTitle('Are you sure?')
                .setDescription(
                    'This will reset all config entries - this action is irreversible!\nBorealis will await for your confirmation for the next 10 seconds.'
                )
                .setColor('BLUE');
            interaction.reply({ embeds: [confirm], components: [row], fetchReply: true });
            const filter = i => ['yes', 'no'].includes(i.customId) && i.user.id === interaction.user.id;
            interaction.channel
                .awaitMessageComponent({ filter, time: 10000 })
                .then(async btn => {
                    switch (btn.customId) {
                        case 'yes':
                            db.delete(`${interaction.guild.id}.config`);
                            const yEmbed = new Embed()
                                .setTitle('Successfully reset the configuration!')
                                .setDescription(
                                    "All config entries have been reset to its default values. Things like join/leave messages or message logs won't work until you configure them again."
                                )
                                .setColor('GREEN');
                            await interaction.editReply({ embeds: [yEmbed], components: [] });
                            break;
                        case 'no':
                            const nEmbed = new Embed()
                                .setTitle('Action cancelled')
                                .setDescription('Configuration remained as it was. No changes were applied.')
                                .setColor('RED');
                            await interaction.editReply({ embeds: [nEmbed], components: [] });
                            break;
                    }
                })
                .catch(() => {
                    const cEmbed = new Embed()
                        .setTitle('Action cancelled')
                        .setDescription(
                            'No response was received, so no changes were applied to the configuration, too.'
                        )
                        .setColor('RED');
                    interaction.editReply({ embeds: [cEmbed], components: [] });
                });
            break;
    }
}
