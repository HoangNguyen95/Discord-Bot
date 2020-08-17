const dailySeries = require('./authenticate');

const Discord = require('discord.js');

const characters = ['rui', 'ruixnat', 'chizuru', 'mami'];
function getRandomNumber(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
}

let seriesName, postNumber;

function getPostNumber(name) {
    switch (name) {
        case 'rui': return getRandomNumber(201, 500);
        case 'ruixnat': return getRandomNumber(26, 333);
        case 'chizuru': return getRandomNumber(1, 10);
        case 'erika': return getRandomNumber(1, 16);
        case 'mami': return getRandomNumber(1, 10);
        // case 'hinaxnatsuo': return getRandomNumber(1, 135);
        default: break;
    }
}

const seriesEmbed = function(post, newest) {
    const messageEmbed = new Discord.MessageEmbed();

    messageEmbed.setTitle(post.title);
    messageEmbed.setURL(`https://www.reddit.com${post.permalink}`);
    messageEmbed.setColor('#0099ff');
    messageEmbed.setImage(post.url);
    messageEmbed.setFooter(
        `Posted by u/${post.author.name}`,
        'https://www.redditstatic.com/desktop2x/img/favicon/favicon-32x32.png',
    );
    if(newest) messageEmbed.setDescription(`${post.author.name} just posted a new post. Look at our best girl!!!`);
    return messageEmbed;
};

// async function fetchedPost(delaySeconds) {
//     try {
//         const posts = await dailySeries.getLatestSeries(delaySeconds);
//         return posts;
//     }
//     catch {
//         console.error;
//         return [];
//     }
// }

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
                return message.channel.send(seriesEmbed(post));
            });
        });
    },
    repeat(channel) {
        seriesName = 'erika';
        postNumber = getPostNumber(seriesName);

        console.log(seriesName, postNumber);
        dailySeries.retrieveSeries(seriesName, postNumber).then(series => {
            if (series.length === 0) return channel.send('No daily series found, author must has been a baka at counting!');
            series.map(value => {
                return channel.send(seriesEmbed(value));
            });
        });
    },
    receiveLatestOrGenerateRandom(channel) {
        // const fetched = fetchedPost(delaySeconds);
        // fetched.then(value => {
        //     value.map(sub => {
        //         return channel.send(seriesEmbed(sub));
        //     });
        // });
        const fetched = dailySeries.getLatest('erika', 'Cuckoo');
        fetched.then(value => {
            if(value.length === 0) {
                this.repeat(channel);
            }
            value.map(sub => {
                return channel.send(seriesEmbed(sub, true));
            });
        });
    },
};