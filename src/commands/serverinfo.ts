import { SlashCommandBuilder } from '@discordjs/builders';
import Embed from '../classes/Embed';
import { CommandInteraction, MessageEmbed } from 'discord.js';

export const data = new SlashCommandBuilder().setName('serverinfo').setDescription('Check info about this server.');
export async function execute(interaction: CommandInteraction) {
    const { guild } = interaction;
    const { createdTimestamp, ownerId, description, members, memberCount, joinedAt, channels, emojis, stickers, name } =
        guild;

    const pCount = members.cache.filter(m => !m.user.bot).size;
    const bCount = members.cache.filter(m => m.user.bot).size;

    const tcCount = channels.cache.filter(c => c.type === 'GUILD_TEXT').size;
    const vcCount = channels.cache.filter(c => c.type === 'GUILD_VOICE').size;
    const tCount = channels.cache.filter(
        c => c.type === 'GUILD_NEWS_THREAD' || c.type === 'GUILD_PUBLIC_THREAD' || c.type === 'GUILD_PRIVATE_THREAD'
    ).size;
    const cCount = channels.cache.filter(c => c.type === 'GUILD_CATEGORY').size;
    const sCount = channels.cache.filter(c => c.type === 'GUILD_STAGE_VOICE').size;
    const ncCount = channels.cache.filter(c => c.type === 'GUILD_NEWS').size;

    const aeCount = emojis.cache.filter(e => e.animated).size;
    const seCount = emojis.cache.filter(e => !e.animated).size;
    const stCount = stickers.cache.size;

    const embed = new Embed()
        .setAuthor({ name, iconURL: guild.iconURL({ dynamic: true }) })
        .setThumbnail(guild.iconURL({ dynamic: true }))
        .setDescription(`*${description ? description : 'No description.'}*`)
        .addField(':heavy_plus_sign: Guild created at', `<t:${createdTimestamp / 1000}:R>`, true)
        .addField(':arrow_right: Borealis joined at', `<t:${joinedAt.getTime() / 1000}:R>`, true)
        .addField(':crown: Owner', `<@${ownerId}>`, true)
        .addField(
            ':busts_in_silhouette: Members',
            `**Members:** ${pCount}\n**Bots:** ${bCount}\n\n**Overall:** ${memberCount}`,
            true
        )
        .addField(
            ':bar_chart: Channels',
            `**Text:** ${tcCount}\n**Voice:** ${vcCount}\n**Open threads:** ${tCount}\n**Categories:** ${cCount}\n**Stages:** ${sCount}\n**News channels:** ${ncCount}\n\n**Overall:** ${channels.cache.size}`,
            true
        )
        .addField(
            ':smile: Emojis & stickers',
            `**Animated:** ${aeCount}\n**Static:** ${seCount}\n**Stickers:** ${stCount}`,
            true
        )
        .addField(
            ':frame_photo: Download guild icon',
            `[.jpg](${guild.iconURL({ format: 'jpg' })}) | [.png](${guild.iconURL({
                format: 'png'
            })}) | [.webp](${guild.iconURL({ format: 'webp' })})`
        )
        .setColor('BLUE');

    await interaction.reply({ embeds: [embed] });
}
