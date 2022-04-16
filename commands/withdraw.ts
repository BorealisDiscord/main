const { SlashCommandBuilder } = require("@discordjs/builders");
const db = require("quick.db");

export default {
    data: new SlashCommandBuilder()
        .setName("withdraw")
        .setDescription("Withdraw your money.")
        .addIntegerOption((option) => option.setName("money").setDescription("How much money you want to withdraw?").setRequired(true)),
    async execute(interaction, client) {
        let money = interaction.options.getInteger("money");

        if (money > db.get(`${interaction.guild.id}.${interaction.user.id}.bank`))
        return interaction.reply({
            content: `You are trying to withdraw **$${money}**, although you have only **$${db.get(`${interaction.guild.id}.${interaction.user.id}.bank`)}** remaining in your bank.`,
            ephemeral: true
        });

        if (money <= 0) 
        return interaction.reply({
            content: `You cannot withdraw amount of money worth zero or below from your bank!`,
            ephemeral: true
        });

        db.subtract(`${interaction.guild.id}.${interaction.user.id}.bank`, parseInt(money));
        db.add(`${interaction.guild.id}.${interaction.user.id}.wallet`, parseInt(money));

        await interaction.reply(`Successfully withdrew **$${money}** from your bank!`);
    }

}