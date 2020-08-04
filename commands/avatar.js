module.exports = {
	name: 'avatar',
	description: 'Avatar!',
	execute(message, args) {
		if(args.length === 0) return message.channel.send('You need to mention someone');
		const avatarList = message.mentions.users.map(user => {
			return `${user.username}'s avatar: ${user.displayAvatarURL({ format: 'png', dynamic: true })}`;
		});
		return message.channel.send(avatarList);
	},
};