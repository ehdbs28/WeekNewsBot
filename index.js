const Discord = require('discord.js');
const client = new Discord.Client({ intents: ["Guilds", "GuildMessages", "MessageContent"]});

const Token = 'MTA4NDAxMzg2MDQwODgwNzQ2NA.GDfwOA.4Y1XW1gkoC-ht-xwd7P4a298AR8mg4FYj7xq6c';

const PREFIX = '!';

client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}`);
});

client.on('messageCreate', msg => {
    if(msg.author.bot || msg.content[0] != PREFIX) return;

    let args = msg.content.substring(PREFIX.length).split(" ");

    switch(args[0]){
        case '소개':
            var embed = IntroduceBotEmbedCreater(msg.author.avatarURL(), msg.author.username);
            msg.reply({ embeds: [embed] });
            break;
        case '설명':
        case '도움말':
            var embed = InfoEmbedCreater(msg.author.avatarURL(), msg.author.username);
            msg.reply({ embeds: [embed] });
            break;
    }
});

function IntroduceBotEmbedCreater(){
    const embed = new Discord.EmbedBuilder()
        .setColor('0099FF')
        .setTitle(':file_folder: __봇 소개__')
        .setDescription('2학년 1반 **이 주의 새로운 이슈**를 알려주는 봇입니다 :)')
        .setFooter({text: '도윤#0111 제작'});

    return embed;
}

function InfoEmbedCreater(userIcon, userName){
    const embed = new Discord.EmbedBuilder()
        .setColor('0099FF')
        .setTitle(':file_folder: __도움말__')
        .addFields(
            { name: '!소개', value: ':pencil: - 봇에 대한 소개글을 출력합니다.'},
            { name: '\n', value: '\n' },
            { name: '!도움말 or !설명', value: ':robot: - 봇에 대한 도움말을 알려줍니다.' },
            { name: '\n', value: '\n' },
            { name: '!오늘의노래 or !노래추천', value: ':notes: - 관리자가 선정한 오늘의 노래를 추천합니다.'},
            { name: '\n', value: '\n' },
            { name: '!오늘의운세 [띠] or !운세 [띠]', value: ':four_leaf_clover: - 띠별 오늘의 운세를 알려줍니다.'},
            { name: '\n', value: '\n' },
            { name: '!이번주알고리즘 or !알고리즘', value: ':desktop: - 관리자가 선정한 이번주의 알고리즘문제를 추천합니다.'},
            { name: '\n', value: '\n' }
        )
        .setTimestamp()
        .setFooter({ text: userName, iconURL: userIcon });

    return embed;
}

client.login(Token);