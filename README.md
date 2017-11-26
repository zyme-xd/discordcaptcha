<img src="https://image.ibb.co/gEN0oR/discord_banner.png">
A Captcha verification bot based on discord.js.

⚠️ This version is only working on Windows (Webshot Module). Try the <a href="https://github.com/y21/discordcaptcha/tree/linux-stable">`linux-stable`</a> Branche for Linux-compatibility

## Setup procedure
DiscordCaptcha requires NodeJS 8.0+. Install it <a href="https://nodejs.org/en/download/package-manager/">here</a>.<br />
To install all required NPM-Modules, run `npm install` <b>in bots' directory</b><br/><br/>

The config file is located in `~/src/`. Get your Token from <a href="https://discordapp.com/developers/applications/me">here</a>.

## Additional commands

```js
!block <UserID> // Blocks a User ID. If the User sends a message to the guild, he'll get kicked.
!pop <UserID> // Removes a User ID from the blacklist. User can write again without getting kicked.
!clear <UserID> // Clears an amount of messages.
```

## Tips

• Look at the wiki for some fixes.<br/>
• Contact me via discord. (y21#0909 | ID: 312715611413413889)<br/>
• Open a Pull Request/Issue
