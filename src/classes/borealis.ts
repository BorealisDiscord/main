import { readdirSync } from 'fs';
import { Client, Intents, Collection } from 'discord.js';

const eventFiles = readdirSync(`${__dirname}/../events`);
const commandFiles = readdirSync(`${__dirname}/../commands`);

export default class Borealis extends Client {
    commands: Collection<string, any>;
    constructor() {
        super({ intents: [Intents.FLAGS.GUILDS] });

        this.commands = new Collection();
        this.handleEvents(`${__dirname}/../events`);
        this.handleCommands(`${__dirname}/../commands`);
        // the token is automatically loaded from process.env.DISCORD_TOKEN
        this.login();
    }
    handleEvents(subdir: string) {
        eventFiles.forEach(async file => {
            const event = await import(`${subdir}/${file}`);
            const name = file.split('.')[0];
            this.on(name, (...args) => event.execute(...args, this));
            console.log(`✅ [EVENT LOG] | Event ${name} successfully loaded!`);
        });
    }
    handleCommands(subdir: string) {
        commandFiles.forEach(async file => {
            const command = await import(`${subdir}/${file}`);
            if (command.data) {
                this.commands.set(command.data.name, command);
                console.log(`✅ [COMMAND LOG] | Command ${command.data.name} successfully loaded!`);
            } else {
                console.warn(`❌ [COMMAND LOG] | Command ${file} failed to load! Perhaps it is missing a data object?`);
            }
        });
    }
}
