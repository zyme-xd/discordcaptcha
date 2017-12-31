<img src="https://image.ibb.co/gEN0oR/discord_banner.png"><br/>
A Captcha verification bot based on Discord.js.

## Setup procedure
DiscordCaptcha requires NodeJS 8.0+. Install it <a href="https://nodejs.org/en/download/package-manager/">here</a>.<br />
To install all required NPM-Modules, run `npm install` <b>in bots' directory</b><br/><br/>

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
```

## Tips

• Look at the wiki for some fixes.<br/>
• Contact me via discord. (y21#0909 | ID: 312715611413413889)<br/>
• Open a Pull Request/Issue
