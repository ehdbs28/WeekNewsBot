const { Client, Intents, Message, MessageEmbed, DiscordAPIError, Options } = require('discord.js');
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
    if(message.content == "!도움말"){
        const embed = new MessageEmbed();
        embed.setTitle("!도움말");
        embed.setColor("579cfb");
        embed.setDescription("\n**!도움말**\n```도움말창을 보여줍니다.```\n\n**!내정보**\n```사용자의 정보를 보여줍니다.```");
        message.channel.send({embeds: [embed]});
    }

    if(message.content == "!내정보"){
        message.channel.send(message.author.displayAvatarURL(ImageData));
    }

});

client.login('OTkzNDE0MjA2NzcyNzQwMTI2.GAAuYW.a7hR2-p_hPHL03lTIm3AP8gqdC3aw6ob9GUHME');


