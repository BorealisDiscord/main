import { SlashCommandBuilder } from "@discordjs/builders";
import { MessageEmbed } from "discord.js";
import { fetch } from "undici";

export default {
    data: new SlashCommandBuilder()
        .setName("clashroyale")
        .setDescription("Check Clash Royale player stats by unique tag.")
        .addStringOption((option) => option.setName('usertag').setDescription("Pass the unique player tag (without \"#\" sign!).").setRequired(true)),
    async execute(interaction, client) {
        const usertag = interaction.options.getString('usertag');
        const res = await fetch(`https://api.clashroyale.com/v1/players/%23${usertag}`, {
            headers: {
                'Authorization': `Bearer ${process.env.CR_API_KEY}`
            }
        });
        const data: { name: string, trophies: number, bestTrophies: number, wins: number, threeCrownWins: number, losses: number, donations: number, donationsReceived: number } = (await res.json()) as any;
        const embed = new MessageEmbed()
        .setAuthor(`Info about player: #${usertag}`)
        .setThumbnail("https://image.winudf.com/v2/image1/Y29tLnY1YXBwcy5tYW5hZ2Vycm95YWxlcGxheWVyc3RhdHNjbGFuc3RhdHNfaWNvbl8xNTQ3MTk1NzcwXzAyOA/icon.png?w=340&fakeurl=1")
        .addField(":bust_in_silhouette: Username", `${data.name}`, true)
        .addField(":trophy: Trophies", `**Current trophies:** ${data.trophies}\n**Overall best:** ${data.bestTrophies}`, true)
        .addField(":crossed_swords: Battle stats", `**Wins:** ${data.wins}\n**Three crown wins:** ${data.threeCrownWins}\n**Losses:** ${data.losses}\n**W/L ratio:** ${data.losses > 0 ? (data.wins / (data.losses)).toFixed(2) : "No losses recorded, can't calculate W/L ratio"}`)
        .addField(":card_box: Donations", `**You donated:** ${data.donations} cards\n**You received:** ${data.donationsReceived} cards\n**D/R cards ratio:** ${data.donationsReceived > 0 ? ((data.donations) / (data.donationsReceived)).toFixed(2) : "No cards received, can't calculate D/R ratio"}`)
        .setColor("ORANGE")
        .setFooter("Powered by Borealis")
        .setTimestamp()

        const eEmbed = new MessageEmbed()
        .setTitle("Nothing found!")
        .setDescription("Make sure you've passed `usertag` argument **WITHOUT** hash sign (#) and is 9 characters long.")
        .setColor("RED")
        .setFooter("Powered by Borealis")
        .setTimestamp()
        if (data.name === undefined) return interaction.reply({embeds: [eEmbed], ephemeral: true}); else return interaction.reply({embeds: [embed]});
    }
}
