const fs = require('fs');

module.exports = {
    name: 'unmute',
    description: '!Unmute',
    guildOnly: true,
    async execute(message, args) {
        const memberToUnmute = message.guild.member(message.guild.members.cache.get(args[0].replace(/[\\<>@#&!]/g, '')));
        if(!memberToUnmute) return message.channel.send('You need to mention someone.');

        const getMembers = JSON.parse(fs.readFileSync('./commands/dataList/mutedList.json'));
        if(!getMembers) return message.channel.send('No one has been muted');
        // const memberHasMuteRole = message.member.roles.cache.find(role => role.name === 'muted');
        // if(!memberHasMuteRole) return message.channel.send('Member has already been muted or never get muted');
        const muteRole = message.guild.roles.cache.find(role => role.name === 'muted');
        if(!muteRole) return message.channel.send('There is no mute role in this server');

        if(!memberToUnmute.roles.cache.has(muteRole.id)) return message.channel.send('Member has already been unmuted or never got muted');

        const index = getMembers.members.findIndex(id => id.memberID === memberToUnmute.id);

        if(index !== -1) {
            getMembers.members[index].status = 'unmuted';
            await memberToUnmute.roles.remove(muteRole.id);
            return message.channel.send(`${memberToUnmute.user.tag} has been unmuted`);
        }
    },
};