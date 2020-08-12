const snoowrap = require('snoowrap');
const { userAgent, clientId, clientSecret, refreshToken } = require('../config.json');

const r = new snoowrap({
    userAgent: userAgent,
    clientId: clientId,
    clientSecret: clientSecret,
    refreshToken: refreshToken,
});

async function retrieveSeries(character, number) {
    try {
        switch (character) {
            case 'rui': {
                // await r.getUser('MattyH19').getSubmissions({ query: `daily_${character}_post_${number}`, limit: 1 }).then(console.log);
                // await r.getUser('MattyH19').getSubmissions().fetchAll().then(sub => {
                //     console.log(sub.length);
                //     sub.filter(link => link.permalink.includes(`daily_${character}_post_${number}`)).map(value => console.log(value.permalink));
                // });
                return await r.getSubreddit('DomesticGirlfriend').search({ query: `daily_${character}_post_${number}`, syntax: 'lucene', limit: 1 });
            }
            // case 'hinaxnatsuo': {
            //     return r.getSubreddit('DomesticGirlfriend').search({ query: `daily_${character}_reboot_${number}` });
            // }
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