const _ = require('underscore');
const Discord = require('discord.js');
const secrets = require('./.secrets.json');
// const blacklisted_websites = require('./assets/blacklisted_websites');
// const { geth, getPools } = require('./lib/doc');
// const report = require('./lib/report');
const ticker = require('./lib/ticker');
// const pools = require('./assets/pools');

const discord = new Discord.Client();
discord.login(secrets.discord.API_SECRET);

const GUILD_NAME = secrets.discord.GUILD_NAME;
// const CHANNEL_MODS_NAME = secrets.discord.CHANNEL_MODS_NAME;
// const CHANNEL_INTRO_NAME = secrets.discord.CHANNEL_INTRO_NAME;
const CHANNEL_TICKER_NAME = secrets.discord.CHANNEL_TICKER_NAME;
const COMMAND_PREFIX = secrets.discord.COMMAND_PREFIX;
const CMC_OPTIONS = {
    'url': secrets.coinmarketcap.api[secrets.env].url,
    'key': secrets.coinmarketcap.api[secrets.env].key
}

let GUILD;
let TOKENS;
// let CHANNEL_MODS;
// let CHANNEL_INTRO;

discord.on(
    'ready',
    async () => {
        GUILD = await discord.guilds.find(guild =>  guild.name === GUILD_NAME);
        // CHANNEL_MODS = await GUILD.channels.find(channel => channel.name === CHANNEL_MODS_NAME);
        // CHANNEL_INTRO = await GUILD.channels.find(channel => channel.name === CHANNEL_INTRO_NAME);
        CHANNEL_TICKER = await GUILD.channels.find(channel => channel.name === CHANNEL_TICKER_NAME);
        TOKENS = await ticker.tokens(CMC_OPTIONS);
        // setInterval(() => { CHANNEL_INTRO.send('Checking for humans -> Send a message in this channel for approval.'); }, 21600000);
    }
);

discord.on(
    'message',
    async message => {
        // forward a copy of intro channel messages to moderator channel
        if (message.channel.name === CHANNEL_INTRO_NAME && !message.author.bot) {
            return CHANNEL_MODS.send(message.author + ' `-- Requesting Approval --` ' + message.content);
        }

        // if the message starts with designated prefix &&
        // it is not the bot &&
        // it is for this guild we are serving
        if (
            message.content.startsWith(COMMAND_PREFIX) &&
            !message.author.bot &&
            message.guild.id === GUILD.id
        ) {
            // get all components of message after !command then the command in lowercase
            const args = message.content.slice(1).split(/ +/);
            const command = args.shift().toLowerCase();

            switch (command) {
                // case 'report': report(message, CHANNEL_MODS); break;
                // case 'geth': geth(message); break;
                // case 'pools': getPools(message); break;
                case 'ticker': ticker.getTicker(message, args[0], TOKENS, CMC_OPTIONS); break;
                default: return;
            }
        // } else {
        // // else we run message through filter if not the bot
        //     if (message.author.bot) { return; } else {
        //         // convert the message to lowercase and see of any words
        //         //   are matched in our website blocking filter
        //         const content = message.toString().toLowerCase();
        //         const hasBlacklistedWebsite = _.some(
        //             blacklisted_websites,
        //             site => { return content.includes(site); }
        //         );
        //         if (hasBlacklistedWebsite) {
        //             await message.delete();
        //             await CHANNEL_MODS.send('' +
        //                 '` -- BLACKLISTED WEBSITE POSTED -- `' +
        //                 '\n\n' + message.author + ' posted the following (now deleted) message with a blacklisted website:' +
        //                 '\n' + message.content
        //             );
        //             await message.reply('that website is not allowed here.  Moderators have been notified.');
        //         }
        //     }
        }
    }
);