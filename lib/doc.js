const pools = require('../assets/pools');

const geth = message => {
    if (message.channel.name === 'development' || message.channel.name === 'mining') {
        const reply = '' +
            '```' +
            '\nGithub: https://github.com/ethereumproject/go-ethereum' +
            '\nReleases: https://github.com/ethereumproject/go-ethereum/releases' +
            '\nWiki: https://github.com/ethereumproject/go-ethereum/wiki' +
            '\nCommands: https://github.com/ethereumproject/go-ethereum/wiki/Command-Line-Options' +
            '```';
        return message.channel.send(reply);
    }
};

const getPools = message => {
    if (message.channel.name === 'mining') {
        let reply = '```';
        _.each(
            pools,
            pool => { return reply = reply + pool + '\n'; }
        );
        return message.channel.send(reply + '```');
    }
};

module.exports = { geth, getPools };