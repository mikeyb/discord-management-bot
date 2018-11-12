const Discord = require('discord.js');
const secrets = require('./.secrets.json');

const discord = new Discord.Client();
discord.login(secrets.discord.API_SECRET);

const GUILD_NAME = secrets.discord.GUILD_NAME;
const CHANNEL_MODS_NAME = secrets.discord.CHANNEL_MODS_NAME;
const ADMIN_ROLE_NAME = secrets.discord.ADMIN_ROLE_NAME;
const MOD_ROLE_NAME = secrets.discord.MOD_ROLE_NAME;
const CHANNEL_INTRO_NAME = secrets.discord.CHANNEL_INTRO_NAME;
const ROLE_APPROVED_NAME = secrets.discord.ROLE_APPROVED_NAME;
const COMMAND_PREFIX = secrets.discord.COMMAND_PREFIX;

let GUILD;
let CHANNEL_MODS;
let CHANNEL_INTRO;
let ROLE_APPROVED;

discord.on(
    'ready',
    async () => {
        GUILD = await discord.guilds.find(guild =>  guild.name === GUILD_NAME);
        CHANNEL_MODS = await GUILD.channels.find(channel => channel.name === CHANNEL_MODS_NAME);
        CHANNEL_INTRO = await GUILD.channels.find(channel => channel.name === CHANNEL_INTRO_NAME);
        ROLE_APPROVED = await GUILD.roles.find(role => role.name === ROLE_APPROVED_NAME);

        setInterval(() => { CHANNEL_INTRO.send('Checking for humans -> Send a message in this channel for approval.'); }, 3600000);
    }
);

discord.on(
    'message',
    message => {
        if (message.channel.name === CHANNEL_INTRO_NAME) {
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
                case 'approve': approveMember(message); break;
                case 'report': report(message); break;
                default: return;
            }
        } else { return; }
    }
);

const approveMember = async message => {
    if (
        message.channel.id === CHANNEL_MODS.id &&
        message.member.highestRole.name === ADMIN_ROLE_NAME || MOD_ROLE_NAME
    ) {
        const member = message.mentions.users.first();
        return await member.addRole(ROLE_APPROVED);
    } else { return; }
}

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
}