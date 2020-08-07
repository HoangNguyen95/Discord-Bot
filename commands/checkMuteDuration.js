const fs = require('fs');

module.exports = {
    name: 'check',
    description: '!Check',
    guildOnly: true,
    execute(message, args) {
        const memberToUnmute = message.guild.member(message.guild.members.cache.get(mentionMember(args[0])));
        if(!memberToUnmute) return message.channel.send('You need to mention someone');

        const getMembers = JSON.parse(fs.readFileSync('./commands/dataList/mutedList.json'));

        if(!getMembers) return message.channel.send('No one has been muted');

        const index = getMembers.members.findIndex(id => id.memberID === memberToUnmute.id);

        if(index !== -1) {
            const currentTime = new Date().getTime();
            const memberMuteTime = new Date(getMembers.members[index].muteTime).getTime();

            if(currentTime < memberMuteTime) {
                const muteDuration = msToHMS(memberMuteTime - currentTime);
                return message.channel.send(`${muteDuration} left for ${memberToUnmute.user.tag}`);
            }
            else {
                return message.channel.send(`${memberToUnmute.user.tag} has already been unmuted`);
            }
        }

        function mentionMember(mention) {
            if (!mention) return;

            const matches = mention.match(/^<@!?(\d+)>$/);

            const id = matches[1];

            return id;
        }

        function msToHMS(duration) {
            let days = (Math.floor(duration / (24 * 60 * 60 * 1000)));
            const daysMS = duration % (24 * 60 * 60 * 1000);
            let hours = Math.floor((daysMS) / (60 * 60 * 1000));
            const hoursMS = duration % (60 * 60 * 1000);
            let minutes = Math.floor((hoursMS) / (60 * 1000));
            const minutesMS = duration % (60 * 1000);
            let seconds = Math.floor((minutesMS) / (1000));
            // seconds = (seconds < 10) ? `0 ${seconds}` : seconds;
            // minutes = (minutes < 10) ? `0 ${minutes}` : minutes;
            // hours = (hours < 10) ? `0 ${hours}` : hours;
            days = (days < 10) ? `0${days}` : days;
            hours = (hours < 10) ? `0${hours}` : hours;
            minutes = (minutes < 10) ? `0${minutes}` : minutes;
            seconds = (seconds < 10) ? `0${seconds}` : seconds;

            return `${days}:${hours}:${minutes}:${seconds}`;
        }
    },
};