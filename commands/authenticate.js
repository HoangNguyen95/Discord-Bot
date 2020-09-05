const snoowrap = require('snoowrap');

const moment = require('moment');

const fs = require('fs');

const r = new snoowrap({
    userAgent: process.env.userAgent,
    clientId: process.env.clientId,
    clientSecret: process.env.clientSecret,
    accessToken: process.env.accessToken,
    refreshToken: process.env.refreshToken,
    username: process.env.username,
    password: process.env.password,
});

const authors = JSON.parse(fs.readFileSync('./commands/data/author.json'));

// async function getLatestSeries(delayInSeconds) {
//     const latestPosts = await getLatestSubmission();
//     const filtered = latestPosts.filter(post => {
//         return ((moment().unix() - post.created_utc) < delayInSeconds);
//     });
//     return filtered;
// }

// async function getLatestSubmission() {
//     const getSubmissions = await r.getSubreddit('DestinyTheGame').getNew();
//     const latestSubmissions = getSubmissions.map(submission => submission);
//     return latestSubmissions;
// }

async function getLatest(name, subreddit) {
    const result = await r.getSubreddit(subreddit).search({ query: `Daily ${name}`, sort: 'new', syntax: 'lucene', limit: 1 });
    const getLatestPost = result.filter(filtered => (((moment().unix() - filtered.created_utc) < 3600 * 6) && authors.seriesAuthor.filter(specificAuthor => filtered.author.name === specificAuthor.name)));
    return getLatestPost;
}

function filterAuthor(data) {
    return data.filter(author => authors.seriesAuthor.filter(specificAuthor => author.author.name === specificAuthor.name));
}

async function getTotalSeries(name, subreddit) {
    const getTotalSubmissions = await r.getSubreddit(subreddit).search({ query: `Daily ${name}`, syntax: 'lucene' });
    const authorSubmissions = filterAuthor(getTotalSubmissions);
    return authorSubmissions;
}

async function retrieveSeries(character, number, subreddit) {
    try {
        const getResult = await r.getSubreddit(subreddit).search({ query: `Daily ${character} ${number}`, restrictSr: true, syntax: 'lucene', limit: 1 });
        const finalResult = filterAuthor(getResult);
        return finalResult;
    }
    catch (err) {
        console.log(err);
    }
}

module.exports.retrieveSeries = retrieveSeries;
// module.exports.getLatestSeries = getLatestSeries;
module.exports.getLatest = getLatest;
module.exports.getTotalSeries = getTotalSeries;