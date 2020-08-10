const snoowrap = require('snoowrap');
const { userAgent, clientId, clientSecret, refreshToken } = require('../config.json');

const r = new snoowrap({
    userAgent: userAgent,
    clientId: clientId,
    clientSecret: clientSecret,
    refreshToken: refreshToken,
});

function retrieveSeries(character, number) {
    try {
        console.log(character, number);
        switch (character) {
            case 'rui': {
                if (number > 358) {
                    return r.getSubreddit('DomesticGirlfriend').search({ query: `daily_${character}_post_${number}` });
                }
                else {
                    return 'No post found';
                }
            }
            case 'hinaxnatsuo': {
                return r.getSubreddit('DomesticGirlfriend').search({ query: `daily_${character}_reboot_${number}` });
            }
            case 'ruixnat': {
                return r.getSubreddit('DomesticGirlfriend').search({ query: `daily_${character}_${number}` });
            }
            default: return 'No daily series found';
        }
    }
    catch (err) {
        console.log(err);
    }
}

module.exports.retrieveSeries = retrieveSeries;