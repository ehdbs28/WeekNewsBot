const Fs = require('fs');
const Discord = require('discord.js');
const Google = require('googleapis');

const client = new Discord.Client({ intents: ["Guilds", "GuildMessages", "MessageContent"]});
const Youtube = Google.google.youtube({
    version: 'v3',
    auth: 'AIzaSyDAU3df1sy9T9Y73vRn8eKo51LdDkhSyyM'
});

const Token = 'MTA4NDAxMzg2MDQwODgwNzQ2NA.GDfwOA.4Y1XW1gkoC-ht-xwd7P4a298AR8mg4FYj7xq6c';

const PREFIX = '!';
const EMBED_COLOR = '0099FF';
const ManagerID = '418003150310473730';
const VIDIO_LINK_TEMPLETE = 'https://www.youtube.com/watch?v=';

client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}`);
});

client.on('messageCreate', msg => {
    if(msg.author.bot || msg.content[0] != PREFIX) return;

    let args = msg.content.substring(PREFIX.length).split(" ");

    switch(args[0]){
        case '소개':
            var embed = IntroduceBotEmbedCreater();
            msg.reply({ embeds: [embed] });
            break;
        case '설명':
        case '도움말':
            var embed = InfoEmbedCreater(msg.author.avatarURL(), msg.author.username);
            msg.reply({ embeds: [embed] });
            break;
        case '오늘의노래':
        case '노래추천':
            RecommendSongEmbedCreater(msg.author.avatarURL(), msg.author.username).then(embed => {
                msg.reply({content: '`오늘의 노래추천입니다 :)`', embeds: [embed] });
            })
            .catch(error => {
                console.log(error);
            });
            break;
        case 'DataSet':
            if(msg.author.id !== ManagerID) return;
            DataSet(args[1]);
            GetSongInfo();
            break;
    }
});

function DataSet(songId){
    let Data = {
        todaySong : songId
    }

    let JsonData = JSON.stringify(Data);

    Fs.writeFile('Data.json', JsonData, 'utf8', error => {
        if(error){
            console.log('fail to write file');
            return;
        }
        
        console.log('success to write file');
    });
}

function IntroduceBotEmbedCreater(){
    const embed = new Discord.EmbedBuilder()
        .setColor(EMBED_COLOR)
        .setTitle(':file_folder: __봇 소개__')
        .setDescription('2학년 1반 **이 주의 새로운 이슈**를 알려주는 봇입니다 :)')
        .setFooter({text: '도윤#0111 제작'});

    return embed;
}

function InfoEmbedCreater(userIcon, userName){
    const embed = new Discord.EmbedBuilder()
        .setColor(EMBED_COLOR)
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

function GetSongInfo() {
    return new Promise((resolve, reject) => {
        Fs.readFile('Data.json', 'utf-8', (error, data) => {
            if (error) {
                console.log('error in read jsonFile');
                reject(error);
                return;
            }

            var data = JSON.parse(data);

            Youtube.videos.list({
                id: data.todaySong,
                part: 'snippet, statistics, contentDetails'
            }, (error, res) => {
                if (error) {
                    console.log('error in youtube data parsing | VIDIO');
                    reject(error);
                    return;
                }

                const vidio = res.data.items[0];
                
                let songInfo = {
                    songTime: FormatDuration(vidio.contentDetails.duration),
                    songURL: VIDIO_LINK_TEMPLETE + data.todaySong,
                    songName: vidio.snippet.title,
                    songThumbnail: GetVidioThumbnail(data.todaySong),
                    channelName: '',
                    channelIcon: ''
                }

                const channelID = vidio.snippet.channelId;

                Youtube.channels.list({
                    id: channelID,
                    part: 'snippet'
                }, (error, res) => {
                    if (error) {
                        console.log('error in youtube data parsing | CHANNEL');
                        reject(error);
                        return;
                    }

                    channel = res.data.items[0];

                    songInfo.channelName = channel.snippet.title;
                    songInfo.channelIcon = channel.snippet.thumbnails.high.url;

                    resolve(songInfo);
                });
            });
        });
    })
}

async function RecommendSongEmbedCreater(userIcon, userName) {
    return new Promise(async (resolve, reject) => {
        try {
            const songInfo = await GetSongInfo();

            const embed = new Discord.EmbedBuilder()
                .setColor(EMBED_COLOR)
                .setAuthor({ name: songInfo.channelName, iconURL: songInfo.channelIcon})
                .setTitle(`**__${songInfo.songName}__**`)
                .setURL(songInfo.songURL)
                .setThumbnail(songInfo.songThumbnail)
                .addFields(
                    { name: '\n', value: '\n' },
                    { name: '곡 길이', value: songInfo.songTime, inline: true},
                    { name: '\u200b', value: '\u200b', inline: true},
                    { name: '아티스트', value: songInfo.channelName, inline: true},
                )
                .setTimestamp()
                .setFooter({ text: userName, iconURL: userIcon });

            resolve(embed);
        } catch (error) {
            console.error(error);
            reject(error);
        }
    });
}

function FormatDuration(duration) {
    const match = duration.match(/PT(\d+H)?(\d+M)?(\d+S)?/);
    const hours = (parseInt(match[1]) || 0);
    const minutes = (parseInt(match[2]) || 0);
    const seconds = (parseInt(match[3]) || 0);

    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}

function GetVidioThumbnail(id){
    return `https://img.youtube.com/vi/${id}/maxresdefault.jpg`;
}

client.login(Token);