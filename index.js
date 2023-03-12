const Fs = require('fs');
const Discord = require('discord.js');
const Google = require('googleapis');
const Axios = require('axios');
const Cheerio = require('cheerio');

const client = new Discord.Client({ intents: ["Guilds", "GuildMessages", "MessageContent"]});
const Youtube = Google.google.youtube({
    version: 'v3',
    auth: 'AIzaSyDAU3df1sy9T9Y73vRn8eKo51LdDkhSyyM'
});

const Token = 'MTA4NDAxMzg2MDQwODgwNzQ2NA.GA9WoP.JohvkRgQMt8w8KiOEdxAfxEph8z8Yk6FaEkbbo';

const PREFIX = '!';
const EMBED_COLOR = '0099FF';
const ManagerID = '418003150310473730';
const VIDIO_LINK_TEMPLETE = 'https://www.youtube.com/watch?v=';

const Constellation = {
    물병: 0,
    양: 1,
    쌍둥이: 2,
    사자: 3,
    천칭: 4,
    사수: 5,
    물고기: 6,
    황소: 7,
    게: 8,
    처녀: 9,
    전갈: 10,
    염소: 11
};
Object.freeze(Constellation);

const BackjoonLevel = {
    무등급: 0,
    브론즈V: 1,
    브론즈IV: 2,
    브론즈III: 3,
    브론즈II: 4,
    브론즈I: 5,
    실버V: 6,
    실버IV: 7,
    실버III: 8,
    실버II: 9,
    실버I: 10,
    골드V: 11,
    골드IV: 12,
    골드III: 13,
    골드II: 14,
    골드I: 15,
    플레티넘V: 16,
    플레티넘IV: 17,
    플레티넘III: 18,
    플레티넘II: 19,
    플레티넘I: 20,
    다이아몬드V: 21,
    다이아몬드IV: 22,
    다이아몬드III: 23,
    다이아몬드II: 24,
    다이아몬드I: 25,
    루비V: 26,
    루비IV: 27,
    루비III: 28,
    루비II: 29,
    루비I: 30
};
Object.freeze(BackjoonLevel);

client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}`);
    client.user.setPresence({ activities: [{ name: '!설명 / !도움말' }], status: 'online' });
});

client.on('messageCreate', async msg => {
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
        case '오늘의운세':
        case '운세':
            if(args[1] in Constellation){
                try{
                    const embed = await FortuneEmbedCreater(msg.author.avatarURL(), msg.author.username, args[1]);
                    msg.reply({ embeds: [embed] });
                }
                catch(error){
                    console.log(error);
                    msg.reply('운세를 불러오는 중 오류가 발생하였습니다.');
                }
            }
            else{
                msg.reply('정확한 별자리를 입력하여주세요.');
            }
            break;
        case '이번주백준':
        case '백준':
            BackjoonProblemEmbedCreater(msg.author.avatarURL(), msg.author.username).then(embed => {
                msg.reply({content: '`이주의 추천백준문제입니다 :)`', embeds: [embed] });
            })
            .catch(error => {
                console.log(error);
            });
            break;
        case 'DataSet':
            if(msg.author.id !== ManagerID) return;
            DataSet(args[1], args[2]);
            break;
    }
});

function DataSet(songId, backjoonId){
    let Data = {
        todaySong : songId,
        weekBackjoon : backjoonId
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
            { name: '!오늘의운세 [별자리] or !운세 [별자리]', value: ':four_leaf_clover: - 별자리별 오늘의 운세를 알려줍니다.'},
            { name: '\n', value: '\n' },
            { name: '!이번주백준 or !백준', value: ':desktop: - 관리자가 선정한 이번주의 백준문제를 추천합니다.'},
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

async function FortuneEmbedCreater(userIcon, userName, constellation){
    try {
        const [fortuneData] = await Promise.all([
            GetFortuneHTMLData(constellation).then(data => data)
        ]);

        const embed = new Discord.EmbedBuilder()
            .setColor(EMBED_COLOR)
            .setTitle(`:four_leaf_clover: ${constellation}자리 운세`)
            .setDescription(`\`${fortuneData.fortuneDate}\`\n${fortuneData.fortune}`)
            .setTimestamp()
            .setFooter({ text: userName, iconURL: userIcon });

        return embed;
    } catch (error) {
        console.log(error);
        throw error;
    }
}

async function BackjoonProblemEmbedCreater(userIcon, userName){
    return new Promise(async (resolve, reject) => {
        try{
            const backjoonData = await GetBackjoonData()

            const embed = new Discord.EmbedBuilder()
                .setColor(EMBED_COLOR)
                .setAuthor({ name: backjoonData.problemNum })
                .setTitle(backjoonData.problemTitle)
                .setURL(backjoonData.problemURL)
                .setThumbnail('https://onlinejudgeimages.s3-ap-northeast-1.amazonaws.com/images/boj-og.png')
                .addFields(
                    { name: '난이도', value: backjoonData.Level, inline: true },
                    { name: '\u200B', value: '\u200B', inline: true },
                    { name: '알고리즘 분류', value: backjoonData.algorithmType, inline: true },
                )
                .setTimestamp()
                .setFooter({ text: userName, iconURL: userIcon });

            resolve(embed);
        }
        catch(error){
            console.log(error);
            reject(error);
        }
    })
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

async function GetFortuneHTMLData(constellation){
    return new Promise(async (resolve, reject) => {
        try{
            const url = `https://search.naver.com/search.naver?where=nexearch&sm=tab_etc&qvt=0&query=${constellation}자리%20운세`;
            const { data } = await Axios.get(url);
            const $ = Cheerio.load(data);

            const fortuneDate = $('.con_date').eq(0).text();
            const fortune = $('.text._cs_fortune_text').eq(0).text();

            resolve({ fortuneDate, fortune });
        }
        catch(error){
            console.log(error);
            reject(error);
        }
    })
}

async function GetBackjoonData(){
    return new Promise(async (resolve, reject) => {
        Fs.readFile('Data.json', 'utf-8', async (error, data) => {
            if (error) {
                console.log('error in read jsonFile');
                reject(error);
                return;
            }
    
            var jsonData = JSON.parse(data);
    
            const url = `https://solved.ac/api/v3/problem/show?problemId=${jsonData.weekBackjoon}`;
            try{
                const { data } = await Axios.get(url);
                
                const problemURL = `https://www.acmicpc.net/problem/${jsonData.weekBackjoon}`;
                const problemNum = `${jsonData.weekBackjoon}번`;
                const problemTitle = data.titles[0].title;
                const GetLevel = currentLevel => {
                    for(let key in BackjoonLevel){
                        if(BackjoonLevel[key] == currentLevel){
                            return key;
                        }
                    }
    
                    return null;
                };
                const Level = GetLevel(data.level);
                const algorithmType = data.tags[0].displayNames[0].name;
                
                resolve( {problemURL, problemNum, problemTitle, Level, algorithmType} );
            }
            catch(error){
                console.log(error);
                reject(error);
            }
        })
    }) 
}

client.login(Token);