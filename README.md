# ETC Discord Utility Bot
Useful utilities for the ETC Discord community

## Features
### User
- `!report [reason]`
  - Used to report all the naughties to admins/mods
- `!geth`
  - Send Geth links (only in #development or #mining channels)
- `!pools`
  - Send list of pools to #mining channel

### Admins/Mods
- Approval requests show up in moderation channel
- Scrubbing blacklisted websites and notifying moderation channel

.secrets.json format example
```
{
    "discord": {
        "API_SECRET": "",
        "CLIENT_ID": "",
        "GUILD_NAME": "ETC - Ethereum Classic",
        "COMMAND_PREFIX": "!",
        "CHANNEL_MODS_NAME": "",
        "CHANNEL_INTRO_NAME": ""
        "CHANNEL_TICKER_NAME": ""
    }
}
```