const { Client, Intents, Message, MessageEmbed, DiscordAPIError, Options } = require('discord.js');
const client = new Client({
    intents : [
        Intents.FLAGS.GUILDS,
        Intents.FLAGS.GUILD_MESSAGES,
    ]
});


client.once('ready', ()=>{
    console.log("디스코드 봇이 준비되었습니다.");
    client.user.setActivity("!도움말", {type:'PLAYING'});
});

client.on('message', message => {
    if(message.content == "!도움말"){
        const embed = new MessageEmbed();
        embed.setTitle("!도움말");
        embed.setColor("FFB2F5");
        embed.setDescription("\n**!도움말**\n```도움말창을 보여줍니다.```\n\n**!소개**\n```이 봇에 대한 소개임당```");
        message.channel.send({embeds: [embed]});
    }

    if(message.content == "!소개"){
        //message.channel.send(message.author.displayAvatarURL(ImageData));
        const embed = new MessageEmbed();
        embed.setAuthor("2m8", "https://cdn.discordapp.com/attachments/957615021490315324/994641496148029501/7eb206f172cfb621d77f57a9dc1b5bb5_11227730928.png");
        embed.setTitle("**봇소개**");
        embed.setColor("FFB2F5");
        //embed.setDescription("내 정보");
        //embed.addField(name = "이름", value = "> " + message.author.username, inline = false);
        //embed.setDescription()
        //embed.addField(name = "아바타", value = , inline = false);
        message.reply({embeds : [embed]});
    }

});

client.login('OTkzNDE0MjA2NzcyNzQwMTI2.GAAuYW.a7hR2-p_hPHL03lTIm3AP8gqdC3aw6ob9GUHME');


