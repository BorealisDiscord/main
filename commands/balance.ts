import { SlashCommandBuilder } from "@discordjs/builders";
import { MessageEmbed } from "discord.js";
import db from "quick.db";

export default {
    data: new SlashCommandBuilder()
        .setName("balance")
        .setDescription("Check balance of your or someone else's wallet.")
        .addUserOption((option) => option.setName("user").setDescription("A user whose wallet should be checked")),
    async execute(interaction, client) {
        let uWallet = interaction.options.getUser("user");
        let embed = new MessageEmbed().setColor("BLUE");

        if (db.get(`${interaction.guild.id}.${interaction.user.id}.wallet`) == null) {
            db.set(`${interaction.guild.id}.${interaction.user.id}.wallet`, 0); db.set(`${interaction.guild.id}.${interaction.user.id}.bank`, 0);
        }

        if (uWallet && db.get(`${interaction.guild.id}.${uWallet.id}.wallet`) == null) {
            db.set(`${interaction.guild.id}.${uWallet.id}.wallet`, 0); db.set(`${interaction.guild.id}.${uWallet.id}.bank`, 0);
        }

        if (!uWallet) {
            embed.setAuthor("Your balance", interaction.user.displayAvatarURL({dynamic: true}))
            .addField(":dollar: In cash", `$${db.get(`${interaction.guild.id}.${interaction.user.id}.wallet`)}`, true)
            .addField(":bank: In bank", `$${db.get(`${interaction.guild.id}.${interaction.user.id}.bank`)}`, true)
            .addField(":1234: Overall net worth", `$${db.get(`${interaction.guild.id}.${interaction.user.id}.wallet`) + db.get(`${interaction.guild.id}.${interaction.user.id}.bank`)}`, true)
        } else {
            embed.setAuthor(`Balance of user ${uWallet.tag}`, uWallet.displayAvatarURL({dynamic: true}))
            .addField(":dollar: In cash", `$${db.get(`${interaction.guild.id}.${uWallet.id}.wallet`)}`, true)
            .addField(":bank: In bank", `$${db.get(`${interaction.guild.id}.${uWallet.id}.bank`)}`, true)
            .addField(":1234: Overall net worth", `$${db.get(`${interaction.guild.id}.${uWallet.id}.wallet`) + db.get(`${interaction.guild.id}.${uWallet.id}.bank`)}`, true)
        }

        await interaction.reply({embeds: [embed]});
    }
}