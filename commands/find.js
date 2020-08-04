const Discord = require('discord.js');

module.exports = {
    name: 'find',
    description: '!Find',
    guildOnly: true,
    async execute(message, args) {
        const fetch = require('node-fetch');
        try {
            const config = {
                method: 'GET',
                headers: {
                    'X-API-KEY': 'b4aea1ce35b64250ad556028d11fc0af',
                },
            };

            const link = `https://www.bungie.net/Platform/User/SearchUsers/?q=${args}`;

            const list = await fetch(link, config).then(response => response.json());

            if(list.Response.length === 0) return message.channel.send('No result found');

            list.Response.map(response => {
                const embed = new Discord.MessageEmbed()
                .setColor('#0099ff')
				.setTitle(response.displayName)
				.setImage('https://www.bungie.net/' + response.profilePicturePath)
				.setTimestamp();
				return message.channel.send(embed);
            });
        }
        catch(error) {
            console.log(error);
        }
    },
};