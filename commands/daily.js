const dailySeries = require('./authenticate');

const Discord = require('discord.js');

const characters = ['rui', 'ruixnat', 'chizuru', 'mami'];

let fetched;
function getRandomNumber(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
}

let seriesName, postNumber;

async function getPostNumber(name) {
    switch (name) {
        case 'rui': return getRandomNumber(201, 500);
        case 'ruixnat': return getRandomNumber(26, 333);
        case 'chizuru': return getRandomNumber(1, await upToDateSeries(name, 'KanojoOkarishimasu'));
        case 'erika': return getRandomNumber(1, await upToDateSeries(name, 'Cuckoo'));
        case 'mami': return getRandomNumber(1, await upToDateSeries(name, 'KanojoOkarishimasu'));
        // case 'hinaxnatsuo': return getRandomNumber(1, 135);
        default: break;
    }
}

const seriesEmbed = function (post, newest) {
    const messageEmbed = new Discord.MessageEmbed();

    messageEmbed.setTitle(post.title);
    messageEmbed.setURL(`https://www.reddit.com${post.permalink}`);
    messageEmbed.setColor('#0099ff');
    messageEmbed.setImage(post.url);
    messageEmbed.setFooter(
        `Posted by u/${post.author.name}`,
        'https://www.redditstatic.com/desktop2x/img/favicon/favicon-32x32.png',
    );
    if (newest) {
        messageEmbed.setDescription(`${post.author.name} just submitted a new post. Look at our best girl!!!`);
    }
    else {
        messageEmbed.setDescription('Best girl moment!!!');
    }
    return messageEmbed;
};

async function fetchLatest(name, subreddit) {
    try {
        const posts = await dailySeries.getLatest(name, subreddit);
        return posts;
    }
    catch (err) {
        console.log(err);
        return [];
    }
}

async function generateRandomOrSpecificPost(character, number) {
    const getSubmission = await dailySeries.retrieveSeries(character, number);
    return getSubmission;
}

async function upToDateSeries(name, subReddit) {
    const getResult = await dailySeries.getTotalSeries(name, subReddit);
    return getResult.length;
}

module.exports = {
    name: 'daily' || 'best',
    description: '!Daily',
    guildOnly: true,
    async execute(message, args) {
        if (!args[0]) {
            seriesName = characters[getRandomNumber(0, characters.length)];
            postNumber = await getPostNumber(seriesName);
        }
        else {
            const content = message.content;
            if (content.toLowerCase().includes('rui') && content.toLowerCase().includes('nat')) {
                seriesName = 'ruixnat';
            }
            else {
                seriesName = args[0].toLowerCase();
            }

            const extractNumber = message.content.match(/(\d+)/);

            postNumber = !extractNumber ? await getPostNumber(seriesName) : extractNumber[0];
        }

        console.log(seriesName, postNumber);

        fetched = generateRandomOrSpecificPost(seriesName, postNumber);
        fetched.then(submission => {
            if (submission.length === 0) return message.channel.send(`Daily ${seriesName[0].toUpperCase() + seriesName.slice(1)} Post #${postNumber} doesn't existed, author must has been a baka at counting!`);
            submission.map(post => {
                return message.channel.send(seriesEmbed(post, false));
            });
        });
    },
    receiveLatestOrGenerateRandom(channel, name, subreddit) {
        fetched = fetchLatest(name, subreddit);
        fetched.then(async submission => {
            if (submission.length === 0) {
                postNumber = await getPostNumber(name);
                fetched = generateRandomOrSpecificPost(name, postNumber);
                fetched.then(value => {
                    if (value.length === 0) return;
                    value.map(post => {
                        return channel.send(seriesEmbed(post, false));
                    });
                });
            }
            submission.map(output => {
                return channel.send(seriesEmbed(output, true));
            });
        });
    },
};