const Discord = require('discord.js');
const client = new Discord.Client({ intents: ["Guilds", "GuildMessages", "MessageContent"]});

const Token = 'MTA4NDAxMzg2MDQwODgwNzQ2NA.GDfwOA.4Y1XW1gkoC-ht-xwd7P4a298AR8mg4FYj7xq6c';

const PREFIX = '!';

function EmbedInfo(title, description, footerImg, footerTxt){
    this.title = title;
    this.description = description;
    this.footerImg = footerImg;
    this.footerTxt = footerTxt;
}

client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}`);
});

client.on('messageCreate', msg => {
    if(msg.author.bot || msg.content[0] != PREFIX) return;

    let args = msg.content.substring(PREFIX.length).split(" ");

    if(args[0] === 'test'){
        const embed = EmbedCreater(new EmbedInfo('testTitle', 'testDescription', msg.author.avatarURL(), msg.author.username));
        msg.channel.send({ embeds: [embed] });
    }
});

function EmbedCreater(EmbedInfo){
    // const embed = new Discord.EmbedBuilder()
    //     .setColor(0x0099FF)
    //     .setTitle('Some title')
    //     .setURL('https://discord.js.org/')
    //     .setAuthor({ name: 'Some name', iconURL: 'https://i.imgur.com/AfFp7pu.png', url: 'https://discord.js.org' })
    //     .setDescription('Some description here')
    //     .setThumbnail('https://i.imgur.com/AfFp7pu.png')
    //     .addFields(
    //         { name: 'Regular field title', value: 'Some value here' },
    //         { name: '\u200B', value: '\u200B' },
    //         { name: 'Inline field title', value: 'Some value here', inline: true },
    //         { name: 'Inline field title', value: 'Some value here', inline: true },
    //     )
    //     .addFields({ name: 'Inline field title', value: 'Some value here', inline: true })
    //     .setImage('https://i.imgur.com/AfFp7pu.png')
    //     .setTimestamp()
    //     .setFooter({ text: 'Some footer text here', iconURL: 'https://i.imgur.com/AfFp7pu.png' });

    const embed = new Discord.EmbedBuilder()
        .setColor('Random')
        .setTitle(EmbedInfo.title)
        .setDescription(EmbedInfo.description)
        .setTimestamp()
        .setFooter( { text: EmbedInfo.footerTxt, iconURL: EmbedInfo.footerImg });

    return embed;
}

client.login(Token);