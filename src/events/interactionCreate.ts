import { Interaction } from 'discord.js';

export async function execute(interaction: Interaction, client) {
    if (!interaction.isCommand()) return;
    const command = client.commands.get(interaction.commandName);
    if (!command) return;

    try {
        await command.execute(interaction);
    } catch (error) {
        console.error(error);
        await interaction.reply({
            content: `There was an error while executing this command!\nIn case you are running under that issue repeatedly, send the stacktrace included below to the Borealis developer: \`\`\`${error}\`\`\``,
            ephemeral: true
        });
    }
};