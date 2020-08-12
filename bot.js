const Discord = require('discord.js');
const client = new Discord.Client();
const { prefix, token } = require('./config.json');
const fs = require('fs');

client.commands = new Discord.Collection();

const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
	const command = require(`./commands/${file}`);
	client.commands.set(command.name, command);
}

client.once('ready', () => {
	client.user.setUsername('Best Girl');
	console.log(`Logged in as ${client.user.tag}!`);
	// const command = client.commands.get('daily');
	// const testChannel = client.channels.cache.find(channel => channel.id === '735420626977685504');

	// setInterval(function() {
	// 	command.repeat(testChannel);
	// }, 60000 * 60 * 6);
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

client.on('messageDelete', async message => {
	if (!message.guild) return;
	const fetchedLogs = await message.guild.fetchAuditLogs({
		limit: 1,
		type: 'MESSAGE_DELETE',
	});

	const delectionLog = fetchedLogs.entries.first();

	if (!delectionLog) return console.log(`A message by ${message.author.tag} was deleted, but no relevant audit logs were found.`);

	const { executor, target } = delectionLog;

	if (target.id === message.author.id) {
		console.log(`A message by ${message.author.tag} was deleted by ${executor.tag}.`);
	}
	else {
		console.log(`A message by ${message.author.tag} was deleted, but we don't know by who.`);
	}
});

// client.on('message', async msg => {
// 	if (!msg.content.startsWith(`${prefix}` || msg.author.bot)) return;

// 	const args = msg.content.slice(prefix.length).trim().split(/ +/);
// 	const commandName = args.shift().toLowerCase();

// 	if (!client.commands.has(commandName)) return;
// 	const command = client.commands.get(commandName);
// 		//const query = querystring.stringify(args.join(' '));

// 		// try {
// 		// 	const link = `https://www.bungie.net/Platform/User/SearchUsers/?q=${args}`;

// 		// 	const list = await fetch(link, config).then(response => response.json());

// 		// 	list.Response.map(response => {
// 		// 		console.log(response);
// 		// 		if(response.length === 0) {
// 		// 			return msg.channel.send('No result found');
// 		// 		}
// 		// 		const embed = new Discord.MessageEmbed()
// 		// 		.setColor('#0099ff')
// 		// 		.setTitle(response.displayName)
// 		// 		.setImage('https://www.bungie.net/' + response.profilePicturePath)
// 		// 		.setTimestamp();
// 		// 		msg.channel.send(embed);
// 		// 	});
// 		// 	console.log('Done');

// 		// }
// 		// catch (error) {
// 		// 	console.log(error);
// 		// }
// 		// const trim = (str, max) => ((str.length > max) ? `${str.slice(0, max - 3)}...` : str);
// 	}
// });