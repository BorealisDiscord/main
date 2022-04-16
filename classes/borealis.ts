import "dotenv/config";
import fs from "fs";
import { REST } from "@discordjs/rest"
import { Routes } from "discord-api-types/v9"
import {Client, Intents, Collection} from "discord.js";

const eventFiles = fs.readdirSync(`${__dirname}/../events`).filter(file => file.endsWith(".js"));
const commandFiles = fs.readdirSync(`${__dirname}/../commands`).filter(file => file.endsWith(".js"));

export default class Borealis extends Client {
	commands: Collection<string, any>
	constructor() {
        super({intents: [Intents.FLAGS.GUILDS]})
        
        this.commands = new Collection();
        this.handleEvents(`${__dirname}/../events`);
        this.handleCommands(`${__dirname}/../commands`);
        // @ts-ignore
        this.login(process.env.BOTTOKEN); 
	}
	handleEvents(subdir: string) {
        eventFiles.forEach(async file => {
            const event = await import(`${subdir}/${file}`);
            if (event.default?.name) { 
                this.on(event.default.name, (...args) => event.default.execute(...args, this));
                console.log(`✅ [EVENT LOG] | Event ${event.default.name} successfully loaded!`);
            } else {
                console.warn(`❌ [EVENT LOG] | Event ${file} failed to load!`);
            }
        });
	}
	handleCommands(subdir: string) {
        commandFiles.forEach(async file => {
            const command = await import(`${subdir}/${file}`);
            if (command.default?.data) {
                this.commands.set(command.default.data.name, command);
                console.log(`✅ [COMMAND LOG] | Command ${command.default.data.name} successfully loaded!`);
            } else {
                console.warn(`❌ [COMMAND LOG] | Command ${file} failed to load! Perhaps it is missing a data object?`);
            }
        });
        const rest = new REST({version: '9'}).setToken(process.env.BOTTOKEN);

        (async () => {
            try {
                console.log('Started refreshing slash commands.');
                await rest.put(Routes.applicationGuildCommands(clientId, guildId), {
                    body: this.commands
                });
                console.log('Successfully reloaded slash commands!')
            } catch(err) {
                console.error(err);
            }
        })
	}
}
