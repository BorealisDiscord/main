import fs from "fs";

export async function handleEvents(client: any) {
    client.handleEvents = async(eventFiles, path) => {
        for (const file of eventFiles) {
            const event = fs.readdirSync(`/events/${file}`).filter(file => file.endsWith(".js"));
            if (event['once']) {
                client.once(event['name'], (...args) => event['execute'](...args, client));
            } else {
                client.on(event['name'], (...args) => event['execute'](...args, client));
            }
        }
    }
}
