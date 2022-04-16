const {REST} = require('@discordjs/rest');
const {Routes} = require('discord-api-types/v9');
const fs = require('fs');
const clientId = '955496551768277043';
const guildId = '925397204141756516';

module.exports = (client) => {
    client.handleCommands = async(commandFolders, path) => {
        client.commandArray = [];
        for (folder of commandFolders) {
            const commandFiles = fs.readdirSync(`${path}/${folder}`).filter(file => file.endsWith('.js'));
            for (const file of commandFiles) {
                const command = require(`../commands/${folder}/${file}`);
                client.commands.set(command.data.name, command);
                client.commandArray.push(command.data.toJSON());
            }
        }
        const rest = new REST({version: '9'}).setToken(process.env.BOTTOKEN);

        (async () => {
            try {
                console.log('Started refreshing slash commands.');
                await rest.put(Routes.applicationGuildCommands(clientId, guildId), {
                    body: client.commandArray
                });
                console.log('Successfully reloaded slash commands!')
            } catch(err) {
                console.error(err);
            }
        })
    }
}