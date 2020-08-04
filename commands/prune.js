module.exports = {
    name: 'prune',
    description: 'Prune!',
    execute(message, args) {
        const amount = parseInt(args[0]);

		console.log(amount);
		if(isNaN(amount)) {
			return message.channel.send('Yeah...No');
		}
		else if(amount <= 1 || amount >= 99) {
			return message.channel.send('Number between 1 - 99 only');
		}
		message.channel.bulkDelete(amount, true).catch(err => {
			console.log(err);
			message.channel.send('There was an error trying to delete message');
		});
    },
};