const dailySeries = require('./authenticate');

const Discord = require('discord.js');

const fs = require('fs');

const getRawData = fs.readFileSync('./commands/data/data.json');

const getParseData = JSON.parse(getRawData);

let fetched;

let seriesName, postNumber, getSubByName;

function getRandomNumber(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
}

async function getPostNumber(name) {
    switch (name) {
        case 'rui': return getRandomNumber(201, 500);
        case 'ruixnat': return getRandomNumber(26, 333);
        case 'chizuru': return getRandomNumber(1, await upToDateSeries(name));
        case 'erika': return getRandomNumber(1, await upToDateSeries(name));
        case 'mami': return getRandomNumber(1, await upToDateSeries(name));
        case 'ruka': return getRandomNumber(2, await upToDateSeries(name));
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
    if (newest) {
        messageEmbed.setDescription(`Look what I found, ${post.author.name} just submitted a new post. Click the link and support this amazing work!!!`);
    }
    else {
        messageEmbed.setDescription('Random girl moment!!!');
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

function getRandomCharacter() {
    const getCharacter = getParseData.listOfSeries.map(character => character.name);
    const randomCharacter = getCharacter[getRandomNumber(0, getCharacter.length)];
    return randomCharacter;
}

function getSubReddit(name) {
    const getSubreddit = getParseData.listOfSeries.filter(filterSub => filterSub.name === name).map(getSub => getSub.sub);
    return getSubreddit;
}

async function generateRandomOrSpecificPost(character, number, subreddit) {
    const getSubmission = await dailySeries.retrieveSeries(character, number, subreddit);
    return getSubmission;
}

async function upToDateSeries(name) {
    getSubByName = getSubReddit(name);
    const getResult = await dailySeries.getTotalSeries(name, getSubByName[0]);
    if (getResult.length === 0) return;
    return getResult.length;
}

function discardMentionedUser(message) {
    const filterArgument = message.filter(argument => !argument.match(/^<@!?(\d+)>$/)).map(arg => arg);
    console.log(filterArgument);
    return filterArgument;
}

module.exports = {
    name: 'daily' || 'best',
    description: '!Daily',
    guildOnly: true,
    async execute(message, args) {
        const getMessage = discardMentionedUser(args);
        if (!getMessage[0]) {
            seriesName = getRandomCharacter();
            postNumber = await getPostNumber(seriesName);
        }
        else {
            const content = message.content;
            if (content.toLowerCase().includes('rui') && content.toLowerCase().includes('nat')) {
                seriesName = 'ruixnat';
            }
            else {
                seriesName = getMessage[0].toLowerCase();
                const grabNumber = getMessage.toString().match(/\d+/g);
                postNumber = !grabNumber ? await getPostNumber(seriesName) : grabNumber[0];
            }
        }
        getSubByName = getSubReddit(seriesName);
        fetched = generateRandomOrSpecificPost(seriesName, postNumber, getSubByName[0]);
        fetched.then(submission => {
            if (submission.length === 0) return message.channel.send(`Daily ${seriesName[0].toUpperCase() + seriesName.slice(1)} Post #${postNumber} doesn't existed, author must has been a baka at counting!`);
            submission.map(post => {
                return message.channel.send(seriesEmbed(post, false));
            });
        });
    },
    receiveLatestOrGenerateRandom(channel, name) {
        getSubByName = getSubReddit(name);
        fetched = fetchLatest(name, getSubByName[0]);
        fetched.then(async submission => {
            if (submission.length === 0) {
                getSubByName = getSubReddit(name);
                fetched = generateRandomOrSpecificPost(name, postNumber, getSubByName[0]);
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