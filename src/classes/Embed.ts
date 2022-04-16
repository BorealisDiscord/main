import { MessageEmbed } from 'discord.js';

export default class Embed extends MessageEmbed {
    constructor() {
        super();
        this.setFooter({ text: 'Powered by Borealis' });
        this.setTimestamp();
    }
}
