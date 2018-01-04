<img src="https://image.ibb.co/gEN0oR/discord_banner.png"><br/>
A Captcha verification bot based on Discord.js.

## Setup procedure
DiscordCaptcha requires NodeJS 8.0+. Install it <a href="https://nodejs.org/en/download/package-manager/">here</a>.<br />
To install all required NPM-Modules, run `npm install` <b>in bots' directory</b>(Click <a href="https://discordjs.guide/#/preparations/?id=installing-nodejs">here</a> for a detailed installation on how to install nodejs)<br/><br/>

For now, make sure the bot is only in one guild.

The config file is located in `~/src/`. Get your Token from <a href="https://discordapp.com/developers/applications/me">here</a>.

## Additional commands

```js
/**
* Snowflake: ID
* Mention: A basic mention (looks like <@123456789>)
**/
!block <Snowflake | Mention> // Blocks a User ID. If the User sends a message to the guild, he'll get kicked.
!removeBlock <Snowflake | Mention> // Removes a User ID from the blacklist. User can write again without getting kicked.
!clear <amount> // Clears an amount of messages.
!version // The current version and the latest version
```

## Adding captchas
You can add as many captchas as you want into the `~/captchas/` directory, but please keep in mind that:
- Extension has to be .png
- Filename **has** to be the same as the captcha.

## API related commands

```js
!api queries // Current query
!api querydelete // Deletes the query (should be executed every 2 or 3 weeks)
!api purgelogs // Purges the logs
!api logs // Get logs
!api captchas // All captchas (limited to 2000 chars)
```

## Tips

• Look at the wiki for some fixes.<br/>
• Contact me via discord. (y21#0909 | ID: 312715611413413889)<br/>
• Open a Pull Request/Issue
