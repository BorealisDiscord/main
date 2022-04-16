import { SlashCommandBuilder } from '@discordjs/builders';
import { MessageEmbed } from "discord.js";

export default {
    data: new SlashCommandBuilder()
        .setName("kick")
        .setDescription("Kick the user of your guild out.")
        .addUserOption((option) => option.setName('user').setDescription("Who should be kicked out of your guild? Pass a mention or user ID here.").setRequired(true))
        .addStringOption((option) => option.setName('reason').setDescription("Optionally, attach the reason.").setRequired(false))
        .addBooleanOption((option) => option.setName('without-dm').setDescription("Should bot avoid sending the direct message to kicked user?").setRequired(false)),
    async execute(interaction, client) {
        if (!interaction.memberPermissions.has("KICK_MEMBERS"))
        return interaction.reply({content: "Insufficient permissions to run this command!", ephemeral: true})

        const user = interaction.options.getUser('user')
        const member = interaction.guild.members.cache.get(user.id) || await interaction.guild.members.fetch(user.id).catch(err => {})

        if (!member) return interaction.reply({
            content: "I am sorry, but I couldn't find any details related to given member. Double check the user ID or mention of desired user you want to kick out.",
            ephemeral: true
        })

        const reason = interaction.options.getString('reason')
        if (!member.bannable) return interaction.reply({
            content: "I am sorry, but I can't kick this user. Perhaps he isn't on the server / has an administrator permission / is an owner?",
            ephemeral: true
        })

        if (member.user.id === '955496551768277043') return interaction.reply({
            content: "Why would you want to kick out the holy Borealis? Too bad, my pal. Not in this server.",
            ephemeral: true
        })

        if (interaction.member.roles.highest.position <= member.roles.highest.position) return interaction.reply({
            content: "Such member has higher rank or equal to yours. That means, I can't kick out this member.",
            ephemeral: true
        })

        const embed = new MessageEmbed()
        .setTitle(":hammer: Successfully kicked out the member!")
        .setDescription(`**User:** ${member.user.tag}\n**Reason:** ${reason ? reason : "Unspecified"}\n**Moderator:** <@${interaction.user.id}>`)
        .setColor("RED")
        .setFooter("Powered by Borealis")
        .setTimestamp()

        member.kick({reason: (reason + ` | Invoked by ${interaction.user.tag}`)})

        return interaction.reply({embeds: [embed]})
    }
}