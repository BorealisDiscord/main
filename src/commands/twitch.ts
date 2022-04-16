import {SlashCommandBuilder} from "@discordjs/builders";
import {MessageEmbed} from "discord.js";
import {fetch} from "undici";

export default {
    data: new SlashCommandBuilder()
        .setName("twitch")
        .setDescription("Check the stats of a Twitch channel.")
        .addStringOption((option) => option.setName("channel").setDescription("Type the name of an Twitch user.").setRequired(true)),
    async execute(interaction, client) {
        const username = interaction.options.getString("channel");
        const res = await fetch(`https://api.statify.live/twitch/${username}`);

        const data: {name: string, avatar: string, views: any, followers: any, id: any, code: number} = (await res.json()) as any;

        const embed = new MessageEmbed()
        .setAuthor(`${data.name} Twitch channel`, data.avatar)
        .addField(`Views`, `h ${data.views}`, true)
        .addField(`Followers`, `h ${data.followers}`, true)
        .addField(`User ID`, `h ${data.id}`, true)
        .setColor("PURPLE")
        .setFooter("Powered by Borealis & Statify API")
        .setTimestamp();

        if (data.code === 200) {
            interaction.reply(embed);
        } else {
            interaction.reply({content: `I am sorry, but I don't think that user exists on Twitch. Double check that the channel you want to search for exists.`, ephemeral: true});
        }
    }
}