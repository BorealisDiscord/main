import db from "quick.db";
import { MessageEmbed, Formatters } from "discord.js";

export default {
    name: 'messageUpdate',
    execute(oldMessage, newMessage) {
        if (oldMessage.author.bot) return;
        const original = oldMessage.content.slice(0, 1950) + (oldMessage.content.length > 1950 ? "..." : "");
        const edited = newMessage.content.slice(0, 1950) + (newMessage.content.length > 1950 ? "..." : "");

        let embed = new MessageEmbed()
            .setAuthor(`${newMessage.author.tag}`, newMessage.author.displayAvatarURL())
            .setTitle(`Message edited`)
            .setDescription(`Click [here](${newMessage.url}) to view the edited message.`)
            .addField(`Old message content`, original)
            .addField(`New message content`, edited)
            .addField(`Message ID`, newMessage.id)
            .addField(`Message was edited`, Formatters.time(newMessage.editedAt, "R"))
        
        // we are also checking if message contains any attachments
        if (newMessage.attachments.size > 0) { 
            embed.addField(`Attachments`, newMessage.attachments.map((a) => a.url), true)
        }
        
        if (!db.get(`${newMessage.guild.id}.config.msglog.channel`)) {
            newMessage.guild.channels.cache.get(db.get(`${newMessage.guild.id}.config.msglog.channel`)).send({embeds: [embed]})
        }
    }
}