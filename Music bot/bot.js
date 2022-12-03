const Discord = require('discord.js');
const client = new Discord.Client({intents: ["Guilds", "GuildVoiceStates", "GuildMembers", "GuildMessages", "MessageContent"]});
const joinVoiceChannel = require('@discordjs/voice');

const ytdl = require('ytdl-core');

const PREFIX = '>';

var servers = {};

client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}`);
});

client.on('messageCreate', msg => {
    let args = msg.content.substring(PREFIX.length).split(" ");

    switch(args[0]){
        case 'play':

            async function play(connection, msg){
                var server = servers[msg.guild.id];

                const stream = ytdl(server.queue[0], {filter: "audioonly"})
                const player = joinVoiceChannel.createAudioPlayer();
                const resource = joinVoiceChannel.createAudioResource(stream);

                await player.play(resource);
                connection.subscribe(player);

                server.dispatcher = player;

                server.dispatcher.on(joinVoiceChannel.AudioPlayerStatus.Playing, () => {
                    console.log("오디오 재생중");
                })
                
                server.queue.shift();
                
                server.dispatcher.off(!joinVoiceChannel.AudioPlayerStatus.Playing, () => {
                    console.log('노래 끝');
                    if(server.queue[0]){
                        play(connection, msg);
                    }
                    else{
                        connection.disconnect();
                    }
                });
            }

            if(!args[1]){
                msg.reply(":no_entry_sign: 링크를 입력해야합니다");
                return;
            }

            if(!msg.member.voice.channel){
                msg.reply(":no_entry_sign: 먼저 보이스 채널에 접속하세요");
                return;
            }

            if(!servers[msg.guild.id]) servers[msg.guild.id] = {
                queue: []
            }

            var server = servers[msg.guild.id];
            server.queue.push(args[1]);

            const voiceConnection = joinVoiceChannel.joinVoiceChannel({
                channelId: msg.member.voice.channelId,
                guildId: msg.guildId,
                adapterCreator: msg.guild.voiceAdapterCreator,
            })

            play(voiceConnection, msg);

            const embed = new Discord.EmbedBuilder()
            .setTitle("🎵 노래 재생 시작")
            .setColor('000000')
            .setDescription(args[1]);

            msg.reply({ embeds : [embed]});

            break;
    }      
});

//Login to client
client.login('MTA0ODU0MDkwMTY5OTUwMjEzMA.GVTjGD.E6VwZZaZ5OkMMzSvg9UN3BVYSnvNbo0YOHdWfo');