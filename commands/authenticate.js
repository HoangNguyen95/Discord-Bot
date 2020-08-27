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

const authors = ['Jack-corvus', 'chara129', 'MattyH19'];

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
    const filterResult = result.filter(filtered => {
        return ((moment().unix() - filtered.created_utc) < 3600 * 6 && authors.find(filtered.author));
    });
    return filterResult;
}

function filterAuthor(data, author) {
    return data.filter(value => value.author.name === author);
}

async function getTotalSeries(name, subreddit) {
    const getTotalSubmissions = await r.getSubreddit(subreddit).search({ query: `Daily ${name}`, syntax: 'lucene' });
    let authorSubmissions;
    if(name === 'mami') {
        authorSubmissions = filterAuthor(getTotalSubmissions, 'Jack-corvus');
        return authorSubmissions;
    }
    else if (name === 'ruka') {
        authorSubmissions = filterAuthor(getTotalSubmissions, 'chara129');
        return authorSubmissions;
    }
    authorSubmissions = filterAuthor(getTotalSubmissions, 'MattyH19');
    return authorSubmissions;
}

async function retrieveSeries(character, number) {
    let getResult, finalResult;
    try {
        switch (character) {
            case 'rui': {
                getResult = await r.getSubreddit('DomesticGirlfriend').search({ query: `Daily ${character} Post ${number}`, syntax: 'lucene', limit: 1 });
                finalResult = filterAuthor(getResult, 'MattyH19');
                return finalResult;
            }
            case 'ruixnat': {
                getResult = await r.getSubreddit('DomesticGirlfriend').search({ query: `Daily ${character} ${number}`, restrictSr: true, syntax: 'lucene', limit: 1 });
                finalResult = filterAuthor(getResult, 'MattyH19');
                return finalResult;
            }
            case 'chizuru': {
                getResult = await r.getSubreddit('KanojoOkarishimasu').search({ query: `Daily ${character} ${number}`, restrictSr: true, syntax: 'lucene', limit: 1 });
                finalResult = filterAuthor(getResult, 'MattyH19');
                return finalResult;
            }
            case 'erika': {
                getResult = await r.getSubreddit('Cuckoo').search({ query: `Daily ${character} ${number}`, restrictSr: true, syntax: 'lucene', limit: 1 });
                finalResult = filterAuthor(getResult, 'MattyH19');
                return finalResult;
            }
            case 'mami': {
                getResult = await r.getSubreddit('KanojoOkarishimasu').search({ query: `Daily ${character} ${number}`, restrictSr: true, syntax: 'lucene', limit: 1 });
                finalResult = filterAuthor(getResult, 'Jack-corvus');
                return finalResult;
            }
            case 'ruka': {
                getResult = await r.getSubreddit('KanojoOkarishimasu').search({ query: `Daily ${character} ${number}`, restrictSr: true, syntax: 'lucene', limit: 1 });
                finalResult = filterAuthor(getResult, 'chara129');
                return finalResult;
            }
            default: return;
        }
    }
    catch (err) {
        console.log(err);
    }
}

module.exports.retrieveSeries = retrieveSeries;
// module.exports.getLatestSeries = getLatestSeries;
module.exports.getLatest = getLatest;
module.exports.getTotalSeries = getTotalSeries;