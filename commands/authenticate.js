const snoowrap = require('snoowrap');

const moment = require('moment');

const r = new snoowrap({
    userAgent: process.env.userAgent,
    clientId: process.env.clientId,
    clientSecret: process.env.clientSecret,
    accessToken: process.env.accessToken,
    refreshToken: process.env.refreshToken,
    username: process.env.username,
    password: process.env.password,
});

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
    const result = await r.getSubreddit(subreddit).search({ query:`Daily ${name}`, sort: 'new', syntax: 'lucene', limit: 1 });
    const filterResult = result.filter(filtered => {
        return ((moment().unix() - filtered.created_utc) < 3600 * 6);
    });
    return filterResult;
}

async function retrieveSeries(character, number) {
    try {
        switch (character) {
            case 'rui': {
                return await r.getSubreddit('DomesticGirlfriend').search({ query: `daily_${character}_post_${number}`, syntax: 'lucene', limit: 1 });
            }
            case 'ruixnat': {
                return await r.getSubreddit('DomesticGirlfriend').search({ query: `daily_${character}_${number}`, restrictSr: true, syntax: 'lucene', limit: 1 });
            }
            case 'chizuru': {
                return await r.getSubreddit('KanojoOkarishimasu').search({ query: `daily_${character}_${number}`, restrictSr: true, syntax: 'lucene', limit: 1 });
            }
            case 'erika': {
                return await r.getSubreddit('Cuckoo').search({ query: `daily_${character}_${number}`, restrictSr: true, syntax: 'lucene', limit: 1 });
            }
            case 'mami': {
                return await r.getSubreddit('KanojoOkarishimasu').search({ query: `daily_${character}_${number}`, restrictSr: true, syntax: 'lucene', limit: 1 });
            }
            default: return 'No daily series found';
        }
    }
    catch (err) {
        console.log(err);
    }
}

module.exports.retrieveSeries = retrieveSeries;
// module.exports.getLatestSeries = getLatestSeries;
module.exports.getLatest = getLatest;