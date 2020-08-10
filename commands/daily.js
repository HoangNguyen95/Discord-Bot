const dailySeries = require('./authenticate');

const Discord = require('discord.js');

function getRandomNumber(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
}

function getPostNumber(name) {
    switch(name) {
        case 'rui': return getRandomNumber(359, 500);
        case 'ruixnat': return getRandomNumber(1, 330);
        case 'hinaxnatsuo': return getRandomNumber(1, 135);
        default: break;
    }
}

module.exports = {
    name: 'daily',
    description: '!Daily',
    guildOnly: true,
    execute(message, args) {
        const characters = ['rui', 'ruixnat', 'hinaxnatsuo'];
        let seriesName, postNumber;
        if (!args[0]) {
            seriesName = characters[getRandomNumber(0, characters.length)];
            postNumber = getPostNumber(seriesName);
        }
        else {
            const content = message.content;

            if (content.toLowerCase().includes('hina') && content.toLowerCase().includes('nat')) {
                seriesName = 'hinaxnatsuo';
            }
            else if (content.toLowerCase().includes('rui') && content.toLowerCase().includes('nat')) {
                seriesName = 'ruixnat';
            }
            else {
                seriesName = args[0].toLowerCase();
            }

            const extractNumber = message.content.match(/(\d+)/);

            postNumber = !extractNumber ? getPostNumber(seriesName) : extractNumber;

        }
        console.log(seriesName, postNumber);

        dailySeries.retrieveSeries(seriesName, postNumber).then(series => {
            if (series.length === 0) return message.channel.send('No daily series found, author must has been a baka at counting!');
            series.map(value => {
                console.log(value);
                const messageEmbed = new Discord.MessageEmbed()
                    .setColor('#0099ff')
                    .setTitle(value.title)
                    .setURL(`https://www.reddit.com${value.permalink}`)
                    .setAuthor(value.author.name)
                    .setImage(value.url);
                return message.channel.send(messageEmbed);
            });
        });
    },
};