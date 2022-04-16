import { SlashCommandBuilder } from "@discordjs/builders";
import { MessageEmbed, MessageActionRow, MessageButton, version } from "discord.js";
import os from "os";

export default {
    data: new SlashCommandBuilder()
        .setName("info")
        .setDescription("Information about this bot & invite link"),
    async execute(interaction, client) {
        const embed = new MessageEmbed()
        .setAuthor("Borealis v0.1.2", interaction.client.user.displayAvatarURL())
        .setColor("BLUE")
        .addField(":1234: Versions", `**- of node.js:** ${process.version}\n**- of discord.js:** ${version}\n**- of Typescript:** 4.6.3`, true)
        .addField(":pencil: Memory usage", `**Taken:** ${(process.memoryUsage().rss / 1024 / 1024).toFixed(2)} MB\n**Overall:** ${(os.totalmem() / 1024 / 1024 / 1024).toFixed(2)} GB`, true)
        .addField(":timer: Ping", `${Date.now() - interaction.createdTimestamp} ms`, true)
        .addField(":cityscape: Guilds count", `${interaction.client.guilds.cache.size.toString()}`, true)
        .addField(":busts_in_silhouette: Creator(s)", `**- main developer:** Oliwier (SlaVistaPL)#0752`, true)
        .setFooter("Powered by Borealis")
        .setTimestamp()

        const buttons = new MessageActionRow()
        .addComponents(
            new MessageButton()
            .setLabel('Invite Borealis to your server!')
            .setStyle('LINK')
            .setURL('https://discord.com/api/oauth2/authorize?client_id=955496551768277043&permissions=2147510278&scope=applications.commands%20bot'),
        )
        await interaction.reply({embeds: [embed], components: [buttons]})
    }
}
