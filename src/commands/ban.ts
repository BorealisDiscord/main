import { SlashCommandBuilder } from '@discordjs/builders';
import Borealis from '../classes/borealis';
import { CommandInteraction, MessageEmbed } from 'discord.js';
import Embed from '../classes/Embed';

export const data = new SlashCommandBuilder()
    .setName('ban')
    .setDescription("Ban the user of your guild out, even if they aren't a member of your server.")
    .addUserOption(option =>
        option
            .setName('user')
            .setDescription('Who should be banned out of your guild? Pass a(n) mention or user ID here.')
            .setRequired(true)
    )
    .addStringOption(option =>
        option.setName('reason').setDescription('Optionally, attach the reason.').setRequired(false)
    );

export async function execute(interaction: CommandInteraction, client: Borealis) {
    if (!interaction.memberPermissions.has('BAN_MEMBERS'))
        return interaction.reply({ content: 'Insufficient permissions to run this command!', ephemeral: true });

    const user = interaction.options.getUser('user');
    const member =
        interaction.guild.members.cache.get(user.id) ||
        (await interaction.guild.members.fetch(user.id).catch(err => {}));

    if (!member)
        return interaction.reply({
            content:
                "I am sorry, but I couldn't find any details related to given member. Double check the user ID or mention of desired user you want to ban.",
            ephemeral: true
        });

    const reason = interaction.options.getString('reason');
    if (!member.bannable)
        return interaction.reply({
            content:
                "I am sorry, but I can't ban this user. Perhaps he is already banned / has an administrator permission / is an owner?",
            ephemeral: true
        });

    if (member.user.id === '955496551768277043')
        return interaction.reply({
            content: 'Why would you want to ban the holy Borealis? Too bad, my pal. Not in this server.',
            ephemeral: true
        });

    // @ts-ignore
    if (interaction.member.roles.highest?.position <= member.roles.highest.position)
        return interaction.reply({
            content: "Such member has higher rank or equal to yours. That means, I can't ban this member.",
            ephemeral: true
        });

    const embed = new Embed()
        .setTitle(':hammer: Banhammer landed!')
        .setDescription(
            `**User:** ${member.user.tag}\n**Reason:** ${reason ? reason : 'Unspecified'}\n**Moderator:** <@${
                interaction.user.id
            }>`
        )
        .setColor('RED');

    member.ban({ reason: reason + ` | Invoked by ${interaction.user.tag}` });

    return interaction.reply({ embeds: [embed] });
}
