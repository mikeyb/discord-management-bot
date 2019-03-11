const report = (message, CHANNEL_MODS) => {
    const args = message.content.slice(1).split(/report\s+/);
    message.member.createDM().then(
        dmchannel => {
            dmchannel.send('' +
                '`-- REPORT RECIEVED --`' +
                '\n\n`CHANNEL` ' + message.channel +
                '\n`CONTENT` ' + args[1]
            );
        }
    );
    return CHANNEL_MODS.send('' +
        '`-- REPORT --`' +
        '\n\n`REPORTER` ' + message.author +
        '\n`CHANNEL` ' + message.channel +
        '\n`CONTENT` ' + args[1]
    );
};

module.exports = report;