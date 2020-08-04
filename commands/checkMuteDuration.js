const fs = require('fs');

module.exports = {
    name: 'check',
    description: '!Check',
    guildOnly: true,
    execute (message, args) {
        const memberToUnmute = message.guild.member(message.guild.members.cache.get(mentionMember(args[0])));

        if(!memberToUnmute) return message.channel.send('You need to mention someone');

        const getMembers = JSON.parse(fs.readFileSync('./commands/dataList/mutedList.json'));

        if(!getMembers) return message.channel.send('No one has been muted');

        if(memberToUnmute.id === getMembers.memberID) {
            const currentTime = new Date().getTime();
            if(currentTime > getMembers.muteTime) {
                const muteDuration = new Date(getMembers.muteTime - currentTime).toISOString().slice(11, -4);
                console.log(muteDuration);
                return message.channel.send(`${muteDuration} left`);
            }
        }

        function mentionMember(mention) {
            if (!mention) return;

            const matches = mention.match(/^<@!?(\d+)>$/);

            const id = matches[1];

            return id;
        }
    },
};