const _ = require('underscore');
const Discord = require('discord.js');
const secrets = require('./.secrets.json');
const blacklisted_websites = require('./assets/blacklisted_websites');
const pools = require('./assets/pools');

const discord = new Discord.Client();
discord.login(secrets.discord.API_SECRET);

const GUILD_NAME = secrets.discord.GUILD_NAME;
const CHANNEL_MODS_NAME = secrets.discord.CHANNEL_MODS_NAME;
const CHANNEL_INTRO_NAME = secrets.discord.CHANNEL_INTRO_NAME;
const COMMAND_PREFIX = secrets.discord.COMMAND_PREFIX;

let GUILD;
let CHANNEL_MODS;
let CHANNEL_INTRO;

discord.on(
    'ready',
    async () => {
        GUILD = await discord.guilds.find(guild =>  guild.name === GUILD_NAME);
        CHANNEL_MODS = await GUILD.channels.find(channel => channel.name === CHANNEL_MODS_NAME);
        CHANNEL_INTRO = await GUILD.channels.find(channel => channel.name === CHANNEL_INTRO_NAME);

        setInterval(() => { CHANNEL_INTRO.send('Checking for humans -> Send a message in this channel for approval.'); }, 3600000);
    }
);

discord.on(
    'message',
    async message => {
        if (message.channel.name === CHANNEL_INTRO_NAME && !message.author.bot) {
            return CHANNEL_MODS.send(message.author + ' `-- Requesting Approval --` ' + message.content);
        }

        if (
            message.content.startsWith(COMMAND_PREFIX) &&
            !message.author.bot &&
            message.guild.id === GUILD.id
        ) {
            const args = message.content.slice(1).split(/ +/);
            const command = args.shift().toLowerCase();
            switch (command) {
                case 'report': report(message); break;
                case 'geth': geth(message); break;
                case 'pools': getPools(message); break;
                default: return;
            }
        } else {
            if (message.author.bot) { return; } else {
                const content = message.toString().toLowerCase();
                const hasBlacklistedWebsite = _.some(
                    blacklisted_websites,
                    site => { return content.includes(site); }
                );
                if (hasBlacklistedWebsite) {
                    await message.delete();
                    await CHANNEL_MODS.send('' +
                        '` -- BLACKLISTED WEBSITE POSTED -- `' +
                        '\n\n' + message.author + ' posted the following (now deleted) message with a blacklisted website:' +
                        '\n' + message.content
                    );
                    await message.reply('that website is not allowed here.  Moderators have been notified.');
                }
            }
        }
    }
);

const report = async message => {
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
    return await CHANNEL_MODS.send('' +
        '`-- REPORT --`' +
        '\n\n`REPORTER` ' + message.author +
        '\n`CHANNEL` ' + message.channel +
        '\n`CONTENT` ' + args[1]
    );
};

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

const getPools = async message => {
    if (message.channel.name === 'mining') {
        let reply = '```';
        await _.each(
            pools,
            pool => { return reply = reply + '\n'; }
        );
        return await message.channel.send(reply + '```');
    }
};