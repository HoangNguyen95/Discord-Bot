const dailySeries = require('./authenticate');

const Discord = require('discord.js');

module.exports = {
    name: 'daily',
    description: '!Daily',
    guildOnly: true,
    execute(message, args) {
        dailySeries.retrieveSeries(args[0].toLowerCase(), args[1]).then(series => {
            if(series.length === 0) return message.channel.send('No daily series found');
            series.map(value => {
                const messageEmbed = new Discord.MessageEmbed()
                    .setColor('#0099ff')
                    .setTitle(value.title)
                    .setImage(value.url);
                return message.channel.send(messageEmbed);
            });
        });
    },
};