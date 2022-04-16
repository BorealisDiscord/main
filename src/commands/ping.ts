import { SlashCommandBuilder } from "@discordjs/builders";

export default {
    data: new SlashCommandBuilder()
        .setName("ping")
        .setDescription("Pong! Check the ping of the bot."),
    async execute(interaction, client) {
        await interaction.reply(`Pong! Bot successfully responded within **${Date.now() - interaction.createdTimestamp}ms**.`)
    }
}