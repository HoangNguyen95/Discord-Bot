const fs = require('fs');
module.exports = {
    name: 'mute',
    description: '!Mute',
    guildOnly: true,
    async execute(message, args) {

        const memberToMute = message.guild.member(message.guild.members.cache.get(mentionMember(args[0])));

        if (!memberToMute) return message.channel.send('You need to mention someone');

        let muteRole = message.guild.roles.cache.find(role => role.name === 'muted');
        if (!muteRole) {
            try {
                muteRole = await message.guild.roles.create({
                    data: {
                        name: 'muted',
                        color: 'GREEN',
                        permissions: [0],
                        mentionable: false,
                    },
                    reason: 'We need a role to mute shitty cunt',
                });
                message.guild.channels.cache.forEach(channels => {
                    channels.updateOverwrite(muteRole, {
                        SEND_MESSAGES: false,
                        ADD_REACTIONS: false,
                        SEND_TTS_MESSAGES: false,
                        SPEAK: false,
                    });
                }).catch(console.error);
            }
            catch (error) {
                console.log(error);
            }
        }
        if (!args[1]) return message.reply('Please specific mute duration');

        const muteDuration = args[1].match(/[^\d]+|\d+/g);
        const muteTime = convertTime(muteDuration[0], muteDuration[1]);

        if (!memberToMute.roles.cache.has(muteRole.id)) {
            await memberToMute.roles.add(muteRole.id).catch(console.error);
            const reason = args[2] ? args.slice(2).join(' ') : 'Must have been a real Baka';
            message.channel.send(`${memberToMute.user.tag}, You have been muted for ${args[1]}. \nReason: ${reason}`);
            const muteDate = new Date().getTime();
            const unMuteDate = muteDate + muteTime;
            // fs.writeFileSync('./commands/dataList/mutedList.json', JSON.stringify(addMemberToMutedList, null, 4), { flag: 'a+' }, err => {
            // memberToMute.muteStatus = [];

            const mutedMember = {
                memberID: memberToMute.id,
                member: memberToMute.user.tag,
                muteTime: unMuteDate,
                count: 1,
                status: 'muted',
            };

            //     if (err) throw err;
            // });
            exportFile(mutedMember, './commands/dataList/mutedList.json');
        }

        setTimeout(function () {
            if (memberToMute.roles.cache.has(muteRole.id)) {
                memberToMute.roles.remove(muteRole.id).catch(console.error);
                message.channel.send(`${memberToMute.user.tag}, You have been unmuted`);
            }
        }, muteTime);

        function mentionMember(mention) {
            if (!mention) return;

            const matches = mention.match(/^<@!?(\d+)>$/);

            const id = matches[1];

            return id;
        }

        function convertTime(time, unit) {
            let actualTimeout;
            switch (unit) {
                case 's': actualTimeout = time * 1000; break;
                case 'm': actualTimeout = time * 1000 * 60; break;
                case 'h': actualTimeout = time * 1000 * 60 * 60; break;
                default: return message.reply('Please specific which unit');
            }
            return actualTimeout;
        }

        function exportFile(member, path) {
            let memberList;
            fs.access(path, fs.F_OK, err => {
                if (err) {
                    console.error(err);
                    return;
                }
                fs.readFile(path, 'utf8', function (err, data) {
                    if (err) throw err;

                    if (!data) {
                        memberList = { 'members': [] };
                        memberList.members.push(member);
                        fs.writeFile(path, JSON.stringify(memberList, null, 4), { flag: 'w' }, err => {
                            if (err) throw err;
                        });
                    }
                    else {
                        memberList = JSON.parse(data);
                        const index = memberList.members.findIndex(id => id.memberID === member.memberID);
                        if (index !== -1) {
                            memberList.members[index] = member;
                            fs.writeFile(path, JSON.stringify(memberList, null, 4), { flag: 'w+' }, err => {
                                if (err) throw err;
                            });
                        }
                        else {
                            memberList.members.push(member);
                            fs.writeFile(path, JSON.stringify(memberList, null, 4), { flag: 'w+' }, err => {
                                if (err) throw err;
                            });
                        }
                    }
                });
            });
        }
    },
};