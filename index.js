// Module Imports and instances
const Discord = require('discord.js');
const client = new Discord.Client();
const fs = require("fs");
const snekfetch = require("snekfetch");
const verifylogs = require("./src/logs.json");

// Command Imports
const config = require("./src/config.json");
var dmsEnabled;
const callback_ = err => {
    err ? console.error(err) : null
};


var waitingQueue = [];
var queue = [];
var latestVersion;

class Captcha {
    constructor(captcha, author){
        this.captcha = captcha;
        this.author = author;
    }

    generate(){
        let temp = fs.readdirSync("./captchas", callback_);
        let rand = Math.floor(Math.random() * temp.length) + 1;
        this.captcha = temp[rand];
        return this.captcha;
    }

    log(tempQueryFile){
        queue.push(this.author + "x" + this.captcha);
        waitingQueue.push(this.author.id);
        verifylogs[this.author.id] = {
            inQueue: Date.now(),
            verifiedAt: false
        };
        fs.writeFile("./src/Query.json", JSON.stringify(tempQueryFile), callback_);
        fs.writeFile("./src/logs.json", JSON.stringify(verifylogs), callback_);
    }
}



try {
    snekfetch.get('https://raw.githubusercontent.com/y21/discordcaptcha/master/src/config.json')
        .then(r => {
            JSON.parse(r.body).version == config.version ? null : console.log("### A new version of discordcaptcha is available!  (Latest: " + JSON.parse(r.body).version + ")\n\n");
           latestVersion = JSON.parse(r.body).version;
        });
} catch (e) {
    console.log(e);
}

client.on("ready", () => {
    try {
        console.log("Logged in!")
        client.user.setGame(config.streamingGame, config.streamingLink);
        client.guilds.size > 1 ? console.log("It looks like this bot is on more than one guild. It is recommended not to have this bot on more than one since it could do random stuff.") : null;
        client.guilds.forEach(guild => {
            !guild.roles.get(config.userrole) ? console.log(`${guild.name} has no userrole or the snowflake that was given in the config file is invalid.`) : null;
        });
    } catch (e) {
        console.log("[DISCORDCAPTCHA-readyEvent] >> " + e);
    }
});

client.on('message', (message) => {
    try {
        if (!message.guild) return;
        let tempQueryFile = JSON.parse(fs.readFileSync("./src/Query.json", "utf8"));
        const file = JSON.parse(fs.readFileSync("./src/config.json", "utf8"));
        var time = new Date();
        if (file.blockedIDs[message.author.id]) {
            if (file.blockedIDs[message.author.id].blocked == "true") {
                message.member.kick();
                console.log(message.member + " was kicked.");
                message.delete();
            }
        }
        if (message.author.id != config.clientid) {
            if (message.content === config.prefix + "receive" || message.content === config.prefix + "verify" || message.content === config.prefix + "captcha") {
                if (message.channel.name === "verify") {
                    if (tempQueryFile.query[message.author.id]) {
                        message.delete();
                        return message.reply(":x:");
                    }
                    if (message.member.roles.has(config.userrole)) {
                        message.author.send({
                            embed: {
                                color: 0xff0000,
                                description: "Already verified on `" + message.guild.name + "`"
                            }
                        });
                    } else {
                        let captchaInstance = new Captcha(null, message.author);
                        dmsEnabled = false;
                        let captcha = captchaInstance.generate();
                        let msg = message.author.send(new Discord.RichEmbed()
                            .setTitle("Verification")
                            .setDescription("This guild is protected by discordcaptcha, an open-source verification bot made by y21#0909.")
                            .addField("Instructions", `In a few seconds an image will be sent to you which includes a number. Please send ${config.prefix}verify <captcha> into the channel ${message.channel.name} (${message.channel})`)
                            .setColor("RANDOM")
                            .setTimestamp()
                        ).catch(e => e.toString().includes("Cannot send messages to this user") ? message.reply("please turn on dms") : dmsEnabled = true);
                        //if(!dmsEnabled) return message.delete();
                        message.author.send(new Discord.Attachment(`./captchas/${captcha}`, captcha + ".png"));
                        tempQueryFile.query[message.author.id] = {
                            verified: "false"
                        };
                        captchaInstance.log(tempQueryFile);
                    }
                }
            } else if (message.channel.name === "verify" && message.content.includes(config.prefix + "verify")) {
                var input = message.content.substr(8) + ".png";
                for (i = 0; i < queue.length; i++) {
                    var cpoint = queue[i].indexOf("x");
                }
                cpoint++;
                var oldcaptcha;
                for (i = 0; i < queue.length; i++) {
                    oldcaptcha = queue[i].substr(cpoint);
                }
                if (input === oldcaptcha) {
                    if (message.member.roles.has(config.userrole)) {
                        message.author.send({
                            embed: {
                                color: 0xff0000,
                                description: "Already verified on `" + message.guild.name + "`"
                            }
                        });
                    } else {
                        message.author.send({
                            embed: {
                                color: 0x00ff00,
                                description: "Successfully verified on `" + message.guild.name + "`"
                            }
                        });
                        client.channels.find('name', config.chat).send("<@" + message.author.id + "> was successfully verified.");
                        if (tempQueryFile.query[message.author.id])
                            tempQueryFile.query[message.author.id].verified = "true";
                        queue.pop();
                        if (verifylogs[message.author.id]) {
                            if (verifylogs[message.author.id].verifiedAt != false) return;
                            verifylogs[message.author.id].verifiedAt = Date.now();
                        } else {
                            console.log("This ain't looking good.");
                        }
                        message.member.addRole(config.userrole).catch(error => console.log(error));
                        fs.writeFile("./src/Query.json", JSON.stringify(tempQueryFile), callback_);
                        fs.writeFile("./src/logs.json", JSON.stringify(verifylogs), callback_);
                    }

                } else {
                    if (message.content.toLowerCase() != config.prefix + "verify") {
                        message.author.send("You were kicked from " + message.guild.name + " (WRONG_CAPTCHA)");
                        message.member.kick();
                    }
                }
            }
        }
        
        require("./src/Commands.js")(message, config, Discord, fs, latestVersion); // Command Handler
        
        if ((message.channel.name === "verify" || message.content.startsWith(config.prefix + "verify")) && message.author.id != client.user.id) {
            message.delete();
        }
    } catch (e) {
        console.log("[DISCORDCAPTCHA-message] >> " + e);
    }
    
});
process.on('unhandledRejection', (err) => {
    console.log(err);
});

client.login(config.token);
