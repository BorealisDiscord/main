import { SlashCommandBuilder } from '@discordjs/builders';
import Embed from '../classes/Embed';
import { CommandInteraction } from 'discord.js';
import ytsr from 'ytsr';

export const data = new SlashCommandBuilder()
    .setName('youtube')
    .setDescription('Search for the available YouTube videos.')
    .addStringOption(option =>
        option.setName('keywords').setDescription('Provide keyword to perform a search').setRequired(true)
    );
export async function execute(interaction: CommandInteraction) {
    interaction.reply('Please wait while Borealis performs the search for you. This may take a while...');
    const res = await ytsr(interaction.options.getString('keywords'), { limit: 5 }).catch(() => {
        return interaction.editReply(`No match to given keywords found. Check your spelling and try again.`);
    });
    // @ts-ignore
    const video = res.items.filter(i => i.type === 'video');
    if (!video) return interaction.editReply('No match to given keywords found. Check your spelling and try again.');

    const embed = new Embed()
        .setColor('RED')
        .setTitle('Search results')
        .setDescription(`Found the following results for \`${interaction.options.getString('keywords')}\`:`);
    for (let i = 0; i < 5; i++) {
        embed.addField(
            `${video[i].title} (${!video[i].isLive ? video[i].duration : 'currently live'})`,
            `Uploaded ${video[i].uploadedAt} by [${video[i].author.name}](${video[i].author.url})\n[Click to watch!](${video[i].url})`
        );
    }
    await interaction.editReply({ content: null, embeds: [embed] });
}
