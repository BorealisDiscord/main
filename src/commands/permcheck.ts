import { SlashCommandBuilder } from '@discordjs/builders';
import { MessageEmbed } from "discord.js";

export default {
    data: new SlashCommandBuilder()
        .setName("permcheck")
        .setDescription("Check if Borealis has enough permissions to run correctly."),
    async execute(interaction, client) {
        const embed = new MessageEmbed()
        .setTitle(":white_check_mark: Permission checker")
        .addField(":police_officer: Administrator", (
            interaction.guild.me.permissions.has("ADMINISTRATOR") ? ":white_check_mark: Permission granted - however it is **unrecommended!**" : ":x: Not detected"
        ), true)
        .addField(":pencil: Manage messages", (
            interaction.guild.me.permissions.has("MANAGE_MESSAGES") ? ":white_check_mark: Permission granted" : ":x: Not detected"
        ), true)
        .addField(":hammer: Ban members", (
            interaction.guild.me.permissions.has("BAN_MEMBERS") ? ":white_check_mark: Permission granted" : ":x: Not detected"
        ), true)
        .addField(":hammer: Kick members", (
            interaction.guild.me.permissions.has("BAN_MEMBERS") ? ":white_check_mark: Permission granted" : ":x: Not detected"
        ), true)
        .addField(":arrow_up: Sending messages", (
            interaction.guild.me.permissions.has("SEND_MESSAGES") ? ":white_check_mark: Permission granted" : ":x: Not detected"
        ), true)
        .addField(":paperclip: Attaching embeds", (
            interaction.guild.me.permissions.has("EMBED_LINKS") ? ":white_check_mark: Permission granted" : ":x: Not detected"
        ), true)

        await interaction.reply({embeds: [embed]});
    }
}