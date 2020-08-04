module.exports = {
	name: 'kick',
    description: 'Kick!',
    guildOnly: true,
	execute(message, args) {
        if(!message.mentions.users.size) {
			return message.reply('You need to mention someone');
		}
		try{
			if(message.mentions.users.first()) {
				message.mentions.members.first().kick('Being a cunt');
				return message.channel.send(`You have kick ${message.mentions.users.first().tag}`);
			}
		}
		catch (error) {
			console.log(error);
		}
	},
};