const request = require('request');


const { randomInt } = require('crypto');

const { Client, GatewayIntentBits, EmbedBuilder } = require('discord.js');
const client = new Client({
    intents : [
        // 서버 메세지 읽기, 메세지 내용 접근 권한 등을 넣어주기
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent
    ]
});

const baseUrl = "https://hangang.ivlis.kr/";
const tempUrl = "https://hangang.ivlis.kr/aapi.php?type=dgr";
const textUrl = "https://hangang.ivlis.kr/aapi.php?type=text";

const LoadData = (url, callback) => {


    request.get(url, (err, res, body) => {
        if(err) 
        {
            console.log(`Load Data fail on ${url}`);
            return;
        }
        callback(body);
        console.log(`Load Data on ${url}`);
    });
};


client.on('messageCreate', msg => {

    if(msg.content == "ping")
    {
        msg.channel.send("pong!");
    }


    if(msg.content == "온도 불러오기")
    {
  
        LoadData(tempUrl, body => {

            msg.channel.send(
                {
                    
                    embeds : [
                        new EmbedBuilder()
                        .setTitle("멘토멘티 봇")
                        .setDescription(`한강물 온도는 ${body}입니다.`)
                        .setURL(baseUrl)
                        .setColor([randomInt(0, 256), randomInt(0, 256), randomInt(0, 256)])
                    ]
                }
            );
        });
    }
    else if(msg.content == "명언 불러오기")
    {
        LoadData(textUrl, body => {
            msg.channel.send(
                {
                    embeds : [
                        new EmbedBuilder()
                        .setTitle("멘토멘티 봇")
                        .setDescription(body)
                        .setURL(baseUrl)
                        .setColor([randomInt(0, 256), randomInt(0, 256), randomInt(0, 256)])
                    ]
                }
            );
        });
    }
    else if(msg.content == "자살 방지 문구")
    {
        LoadData(textUrl, body => {
            msg.channel.send(
                {
                    embeds : [
                        new EmbedBuilder()
                        .setTitle("멘토멘티 봇")
                        .setDescription("**한번 해봐요**-익명의 누군가")
                        .setURL(baseUrl)
                        .setColor([randomInt(0, 256), randomInt(0, 256), randomInt(0, 256)])
                    ]
                }
            );
        });
    }
});

client.login("MTAwNzYwMzYyNzM2MTMyNTE2Nw.GbdnYF.Gxj6UUJcpjUndp4faVSqnsse1jPzC1agXjn-OI");