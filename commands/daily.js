const dailySeries = require('./authenticate');

const Discord = require('discord.js');

const characters = ['rui', 'ruixnat', 'chizuru', 'mami'];
function getRandomNumber(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
}

let seriesName, postNumber;

function getPostNumber(name) {
    switch(name) {
        case 'rui': return getRandomNumber(201, 500);
        case 'ruixnat': return 1 || getRandomNumber(26, 330);
        case 'chizuru': return getRandomNumber(1, 7);
        case 'erika': return getRandomNumber(1, 14);
        case 'mami': return getRandomNumber(1, 7);
        // case 'hinaxnatsuo': return getRandomNumber(1, 135);
        default: break;
    }
}

module.exports = {
    name: 'daily' || 'best',
    description: '!Daily',
    guildOnly: true,
    execute(message, args) {
        if (!args[0]) {
            seriesName = characters[getRandomNumber(0, characters.length)];
            postNumber = getPostNumber(seriesName);
        }
        else {
            const content = message.content;

            // if (content.toLowerCase().includes('hina') && content.toLowerCase().includes('nat')) {
            //     seriesName = 'hinaxnatsuo';
            // }
            if (content.toLowerCase().includes('rui') && content.toLowerCase().includes('nat')) {
                seriesName = 'ruixnat';
            }
            else {
                seriesName = args[0].toLowerCase();
            }

            const extractNumber = message.content.match(/(\d+)/);

            postNumber = !extractNumber ? getPostNumber(seriesName) : extractNumber[0];
        }

        console.log(seriesName, postNumber);

        dailySeries.retrieveSeries(seriesName, postNumber).then(series => {
            // eslint-disable-next-line curly
            if (series.length === 0) return message.channel.send(`Daily ${seriesName[0].toUpperCase() + seriesName.slice(1)} Post #${postNumber} doesn't existed, author must has been a baka at counting!`);
            series.filter(value => value.author.name === 'MattyH19' || value.author.name === 'Jack-corvus').map(post => {
                if(!post) return message.channel.send(`Daily ${seriesName[0].toUpperCase() + seriesName.slice(1)} Post ${postNumber} does not existed, author must has been a baka at counting!`);
                const messageEmbed = new Discord.MessageEmbed()
                    .setColor('#0099ff')
                    .setTitle(post.title)
                    .setURL(`https://www.reddit.com${post.permalink}`)
                    .setAuthor(post.author.name)
                    .setImage(post.url);
                return message.channel.send(messageEmbed);
            });
        });
    },
    repeat(channel) {
        seriesName = characters[getRandomNumber(0, characters.length)];
        postNumber = getPostNumber(seriesName);

        console.log(seriesName, postNumber);
        dailySeries.retrieveSeries(seriesName, postNumber).then(series => {
            if (series.length === 0) return channel.send('No daily series found, author must has been a baka at counting!');
            series.map(value => {
                const messageEmbed = new Discord.MessageEmbed()
                    .setColor('#0099ff')
                    .setTitle(value.title)
                    .setURL(`https://www.reddit.com${value.permalink}`)
                    .setAuthor(value.author.name)
                    .setImage(value.url);
                return channel.send(messageEmbed);
            });
        });
    },
};