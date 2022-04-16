import { SlashCommandBuilder } from '@discordjs/builders';
import Embed from '../classes/Embed';
import { MessageActionRow, MessageButton, version, CommandInteraction } from 'discord.js';
import { totalmem } from 'os';
// @ts-ignore
import { version as typescript } from 'typescript/package.json';
export const data = new SlashCommandBuilder()
    .setName('info')
    .setDescription('Information about this bot & invite link');
export async function execute(interaction: CommandInteraction) {
    const embed = new Embed()
        .setAuthor({ name: 'Borealis v0.1.2', iconURL: interaction.client.user.displayAvatarURL() })
        .setColor('BLUE')
        .addField(
            ':1234: Versions',
            `**- of node.js:** ${process.version}\n**- of discord.js:** ${version}\n**- of Typescript:** ${typescript}`,
            true
        )
        .addField(
            ':pencil: Memory usage',
            `**Taken:** ${(process.memoryUsage().rss / 1024 / 1024).toFixed(2)} MB\n**Overall:** ${(
                totalmem() /
                1024 /
                1024 /
                1024
            ).toFixed(2)} GB`,
            true
        )
        .addField(':timer: Ping', `${Date.now() - interaction.createdTimestamp} ms`, true)
        .addField(':cityscape: Guilds count', `${interaction.client.guilds.cache.size}`, true)
        .addField(':busts_in_silhouette: Creator(s)', `**- main developer:** Oliwier (SlaVistaPL)#0752`, true);

    const buttons = new MessageActionRow().addComponents(
        new MessageButton()
            .setLabel('Invite Borealis to your server!')
            .setStyle('LINK')
            .setURL(
                'https://discord.com/api/oauth2/authorize?client_id=955496551768277043&permissions=2147510278&scope=applications.commands%20bot'
            )
    );
    await interaction.reply({ embeds: [embed], components: [buttons] });
}
