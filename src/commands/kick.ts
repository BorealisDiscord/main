import { SlashCommandBuilder } from '@discordjs/builders';
import Embed from 'classes/Embed';
import { CommandInteraction, GuildMember, MessageEmbed } from 'discord.js';

export const data = new SlashCommandBuilder()
    .setName('kick')
    .setDescription('Kick the user of your guild out.')
    .addUserOption(option =>
        option
            .setName('user')
            .setDescription('Who should be kicked out of your guild? Pass a mention or user ID here.')
            .setRequired(true)
    )
    .addStringOption(option =>
        option.setName('reason').setDescription('Optionally, attach the reason.').setRequired(false)
    )
    .addBooleanOption(option =>
        option
            .setName('without-dm')
            .setDescription('Should bot avoid sending the direct message to kicked user?')
            .setRequired(false)
    );
export async function execute(interaction: CommandInteraction) {
    if (!interaction.memberPermissions.has('KICK_MEMBERS'))
        return interaction.reply({ content: 'Insufficient permissions to run this command!', ephemeral: true });

    const member = interaction.options.getMember('user') as GuildMember;

    if (!member)
        return interaction.reply({
            content:
                "I am sorry, but I couldn't find any details related to given member. Double check the user ID or mention of desired user you want to kick out.",
            ephemeral: true
        });

    const reason = interaction.options.getString('reason');
    if (!member.kickable)
        return interaction.reply({
            content:
                "I am sorry, but I can't kick this user. Perhaps he isn't on the server / has an administrator permission / is an owner?",
            ephemeral: true
        });

    if (member.user.id === '955496551768277043')
        return interaction.reply({
            content: 'Why would you want to kick out the holy Borealis? Too bad, my pal. Not in this server.',
            ephemeral: true
        });

    // @ts-ignore
    if (interaction.member.roles.highest?.position <= member.roles.highest.position)
        return interaction.reply({
            content: "Such member has higher rank or equal to yours. That means, I can't kick out this member.",
            ephemeral: true
        });

    const embed = new Embed()
        .setTitle(':hammer: Successfully kicked out the member!')
        .setDescription(
            `**User:** ${member.user.tag}\n**Reason:** ${reason ? reason : 'Unspecified'}\n**Moderator:** <@${
                interaction.user.id
            }>`
        )
        .setColor('RED');

    member.kick(reason + ` | Invoked by ${interaction.user.tag}`);

    return interaction.reply({ embeds: [embed] });
}
