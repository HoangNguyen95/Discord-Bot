const snoowrap = require('snoowrap');
const { userAgent, clientId, clientSecret, refreshToken } = require('../config.json');

const r = new snoowrap({
    userAgent: userAgent,
    clientId: clientId,
    clientSecret: clientSecret,
    refreshToken: refreshToken,
  });

function retrieveSeries(character, number) {
    switch (character) {
        case 'rui': {
            if(number > 200) {
                return r.getSubreddit('DomesticGirlfriend').search({ query: `daily_${character}_post_${number}`, sort:'day' });
            }
            else {
                return 'No post found';
            }
        }
        case 'hinaxnatsuo': {
            return r.getSubreddit('DomesticGirlfriend').search({ query: `daily_${character}_reboot_post_${number}`, sort:'day' });
        }
        default: return 'No daily series found';
    }
}

module.exports.retrieveSeries = retrieveSeries;