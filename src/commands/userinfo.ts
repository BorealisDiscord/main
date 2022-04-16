import {SlashCommandBuilder} from '@discordjs/builders';
import {MessageEmbed} from "discord.js";

export default {
    data: new SlashCommandBuilder()
        .setName("userinfo")
        .setDescription("Check info about the user if provided. Otherwise, check info about yourself.")
        .addUserOption(option => option.setName("user").setDescription("About who you want to retrieve information?")),
    async execute(interaction, client) {
        const member = interaction.options.getMember('user') || interaction.member;
        const embed = new MessageEmbed()
        .setAuthor(member.user.tag, member.user.displayAvatarURL())
        .setColor(member.displayHexColor === "#000000" ? "#ffffff" : member.displayHexColor)
        .setThumbnail(member.user.displayAvatarURL())
        .addField(":arrow_right: Joined here at", `<t:${member.joinedAt / 1000}:R>`, true)
        .addField(":heavy_plus_sign: Joined Discord at", `<t:${member.user.createdAt / 1000}:R>`, true)
        .addField(":1234: User ID", member.user.id, true)
        .addField(":bust_in_silhouette: Nickname(s)", `**Global:** ${member.user.username} ${member.displayName != member.user.username ? "\n**Server:** " + member.displayName : ""}`, true)
        .addField(":gem: Is a booster?", `${member.premiumSince ? 'Boosting since ' + member.premiumSince.toLocaleString() : 'Not a booster'}`, true)
        .addField(":frame_photo: Download user avatar", `[.jpg](${member.user.displayAvatarURL({size: 512, format: "jpg"})}) | [.png](${member.user.displayAvatarURL({size: 512, format: "png"})}) | [.webp](${member.user.displayAvatarURL({size: 512, format: "webp"})})`)
        .setFooter("Powered by Borealis")
        .setTimestamp()

        await interaction.reply({embeds: [embed]});
    }
}