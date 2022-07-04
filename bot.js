const { Client, Intents, Message, MessageEmbed, DiscordAPIError } = require('discord.js');
const discord = require("discord.js");
const client = new Client({
    intents : [
        Intents.FLAGS.GUILDS,
        Intents.FLAGS.GUILD_MESSAGES,
    ]
});

client.once('ready', ()=>{
    console.log("디스코드 봇이 준비되었습니다.");
    client.user.setActivity("!정보", {type:'PLAYING'});
});

client.on('message', message => {
    if(message.content == "정보"){
        const embed = new discord.MessageEmbed();
        //embed.setTitle("이것은 embed 타이틀");
        //embed.setColor("579cfb");
        //embed.setDescription("안녕 이곳은 설명란");

        message.channel.send(embed);
    }
});

client.login('OTkzNDE0MjA2NzcyNzQwMTI2.GAAuYW.a7hR2-p_hPHL03lTIm3AP8gqdC3aw6ob9GUHME');


