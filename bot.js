const Discord = require('discord.js');
const client = new Discord.Client();
const { prefix, token } = require('./config.json');
const fs = require('fs');
const schedule = require('node-schedule');

client.commands = new Discord.Collection();

const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
	const command = require(`./commands/${file}`);
	client.commands.set(command.name, command);
}

client.once('ready', () => {
	client.user.setUsername('Best Girl');
	console.log(`Logged in as ${client.user.tag}!`);
	const command = client.commands.get('daily');
	const testChannel = client.channels.cache.find(channel => channel.id === '676034600312766487');
	// const delaySeconds = 30;
	// setInterval(function() {
	// 	command.receiveLatest(testChannel);
	// 	// else {
	// 	// 	console.log('Found it');
	// 	// 	setTimeout(function() {
	// 	// 		command.repeat(testChannel);
	// 	// 	}, 60 * 1000);
	// 	// }
	// }, delaySeconds * 1000);
	schedule.scheduleJob({ hour: 0, minute: 0 }, function() {
		command.receiveLatestOrGenerateRandom(testChannel);
	});
});

client.login(token);

client.on('message', msg => {

	if (!msg.content.startsWith(`${prefix}` || msg.author.bot)) return;

	const args = msg.content.slice(prefix.length).trim().split(/ +/);
	const commandName = args.shift().toLowerCase();

	if (!client.commands.has(commandName)) return;
	const command = client.commands.get(commandName);

	try {
		if ((command.name === 'mute' || command.name === 'unmute' || command.name === 'kick' || command.name === 'prune') && !msg.member.hasPermission('ADMINISTRATOR')) {
			return msg.channel.send('Sorry, you don\'t have permission to use this feature');
		}
		// eslint-disable-next-line curly
		else command.execute(msg, args);
	}
	catch (err) {
		console.log(err);
		msg.reply('Invalid command');
	}
});
