import {REST} from '@discordjs/rest';
import {Routes} from 'discord-api-types/v9';
import fs from 'fs';
const clientId = '955496551768277043';
const guildId = '925397204141756516';

export async function handleCommands(client: any) {
    client.handleCommands = async(commandFolders: any, path: any) => {
        client.commandArray = [];
        for (const folder of commandFolders) {
            const commandFiles = fs.readdirSync(`${path}/${folder}`).filter(file => file.endsWith('.js'));
            for (const file of commandFiles) {
                const command = fs.readdirSync(`/commands/${folder}/${file}`).filter(file => file.endsWith('.js'));
                client.commands.set(command['data']['name'], command);
                client.commandArray.push(command['data'].toJSON());
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
