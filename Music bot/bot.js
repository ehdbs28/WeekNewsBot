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
        case 'p':
        case 'play':

            async function play(connection, msg){
                var server = servers[msg.guild.id];

                console.log(servers);

                if(!server.dispatcher){
                    const stream = ytdl(server.queue[0], {filter: "audioonly"})
                    const player = joinVoiceChannel.createAudioPlayer();
                    const resource = joinVoiceChannel.createAudioResource(stream);
                    
                    await player.play(resource);
                    connection.subscribe(player);
                    
                    server.dispatcher = connection;
                    
                    server.queue.shift();

                    player.on(joinVoiceChannel.AudioPlayerStatus.Idle, () => {
                        if(server.queue[0]){
                            play(connection, msg);
                        }
                        else{
                            connection.disconnect();
                        }
                    });
                }

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

        case 'skip':
            var server = servers[msg.guild.id];
            if(server.dispatcher){
                play(server.dispatcher, msg);
            }
            break;

        case 'stop':
            var server = servers[msg.guild.id];
            for(var i = server.queue.length - 1; i >= 0; i--){
                server.queue.splice(i, 1);
            }

            server.dispatcher.disconnect();
            msg.reply(":stop_button: 노래를 종료합니다");
            break;
    }      
});

//Login to client
client.login('MTA0ODU0MDkwMTY5OTUwMjEzMA.GVTjGD.E6VwZZaZ5OkMMzSvg9UN3BVYSnvNbo0YOHdWfo');