import { SlashCommandBuilder } from '@discordjs/builders';

export default {
    data: new SlashCommandBuilder()
        .setName('purge')
        .setDescription('Bulk delete messages!')
        .addIntegerOption((option) => option.setName('amount').setDescription("How many messages should be deleted?").setRequired(true))
        .addUserOption((option) => option.setName('author').setDescription("Optionally, you can specify a user whose recent messages will be deleted.")),
    async execute(interaction, client) {
        if (!interaction.memberPermissions.has("MANAGE_MESSAGES"))
        return interaction.reply({content: "Insufficient permissions to run this command!", ephemeral: true})

        if (!interaction.guild.me.permissions.has("MANAGE_MESSAGES"))
        return interaction.reply({content: "I am sorry, but I don't have sufficient permissions to commence this action.", ephemeral: true})
        else {
            let amount = interaction.options.getInteger('amount');

            if (isNaN(amount) || parseInt(amount) > 100 || parseInt(amount) < 1) return interaction.reply({content: "Please, specify a **valid number** between 1 and 100.", ephemeral: true})
            else {
                if (!interaction.options.getUser('author')) {
                    try {
                        let { size } = await interaction.channel.bulkDelete(amount)
                        if (size > 0) {
                            await interaction.reply({content: `Successfully deleted **${size}** messages!`, ephemeral: true})
                        } else {
                            return interaction.reply({content: `No messages were removed despite amount being specified. Perhaps you are trying to run this command on an empty channel.`, ephemeral: true})
                        }
                    } catch (err) {
                        await interaction.reply({
                            content: `An error occured while trying to bulk delete messages!\nPlease check if the messages you are trying to bulk delete aren't older than 2 weeks.`,
                            ephemeral: true
                        })
                    }
                } else {
                    try {
                        const messages = await interaction.channel.messages.fetch({limit: amount});
                        let filtered = messages.filter((msg) => msg.author.id === interaction.options.getUser('author')?.id);
                        await interaction.channel.bulkDelete(filtered).then(() => {
                            if (filtered.size > 0) {
                                interaction.reply({content: `Out of **${amount} filtered messages,** Borealis successfully deleted **${filtered.size}** last messages of user **${interaction.options.getUser('author')?.tag} (ID: ${interaction.options.getUser('author')?.id})**!`, ephemeral: true})
                            } else {
                                interaction.reply({content: `No messages were removed despite amount and target being specified. Perhaps you are trying to run this command on an empty channel.`, ephemeral: true})
                            }
                        });
                    } catch (err) {
                        console.error(err);
                        await interaction.reply({
                            content: `An error occured while trying to bulk delete messages!\nPlease check if the messages you are trying to bulk delete aren't older than 2 weeks.`,
                            ephemeral: true
                        })
                    }
                }
            }
        }
    }
}