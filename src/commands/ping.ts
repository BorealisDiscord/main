import { SlashCommandBuilder } from '@discordjs/builders';
import { CommandInteraction } from 'discord.js';

export const data = new SlashCommandBuilder().setName('ping').setDescription('Pong! Check the ping of the bot.');
export async function execute(interaction: CommandInteraction) {
    await interaction.reply(
        `Pong! Bot successfully responded within **${Date.now() - interaction.createdTimestamp}ms**.`
    );
}
