import { SlashCommandBuilder } from "@discordjs/builders";
import { MessageEmbed } from "discord.js";
import db from "quick.db";
const cooldownList = new Set();

export default {
    data: new SlashCommandBuilder()
        .setName("work")
        .setDescription("Every work or so, you can earn some virtual money."),
    async execute(interaction, client) {
        // if there's no entry in database file - we create one, both for wallet and bank
        if (db.get(`${interaction.guild.id}.${interaction.user.id}.wallet`) == null) {
            db.set(`${interaction.guild.id}.${interaction.user.id}.wallet`, 0); db.set(`${interaction.guild.id}.${interaction.user.id}.bank`, 0);
        }

        let salary = Math.floor(Math.random() * 500) + 50;
        let workStrings = [
            `You've went to the work as a DJ and earned $${salary}.`,
            `You've tested out some brand new video games and earned $${salary}.`,
            `Thanks to the adverts being put on your website, you've earned $${salary}.`,
            `You've found a wallet and its owner. Thanks to your generosity you've earned $${salary}.`
        ]

        if (cooldownList.has(interaction.user.id)) {
            let cEmbed = new MessageEmbed()
            .setAuthor("Working session", interaction.user.displayAvatarURL({dynamic: true}))
            .setDescription("Take a break! You can work every **1 hour.**")
            .setColor("RED")
            .setFooter("Powered by Borealis")
            .setTimestamp()
            return interaction.reply({embeds: [cEmbed], ephemeral: true});
        }

        cooldownList.add(interaction.user.id);
        setTimeout(() => {
            cooldownList.delete(interaction.user.id);
        }, 3600000);
        db.add(`${interaction.guild.id}.${interaction.user.id}.wallet`, salary);
        let wEmbed = new MessageEmbed()
        .setAuthor("Working session", interaction.user.displayAvatarURL({dynamic: true}))
        .setDescription(workStrings[Math.floor(Math.random() * workStrings.length)])
        .setColor("BLUE")
        .setFooter("Powered by Borealis")
        .setTimestamp()
        await interaction.reply({embeds: [wEmbed]});
    }
}