// const { Client, Intents, Message, MessageEmbed, DiscordAPIError, Options } = require('discord.js');
// const client = new Client({
//     intents : [
//         Intents.FLAGS.GUILDS,
//         Intents.FLAGS.GUILD_MESSAGES,
//     ]
// });

const Discord = require('discord.js');
const client = new Discord.Client({intents: ["Guilds", "GuildMessages", "MessageContent"]});

client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}`);
});

client.on('messageCreate', msg => {
    console.log(msg.content);
    if(msg.content == "ping"){
        
        msg.reply("pong!");
    }
});

//Login to client
client.login('MTA0ODU0MDkwMTY5OTUwMjEzMA.GVTjGD.E6VwZZaZ5OkMMzSvg9UN3BVYSnvNbo0YOHdWfo');