// Module Imports and instances
const Discord = require('discord.js');
const client = new Discord.Client();
const fs = require("fs");
const webshot = require("webshot");

// Command Imports
const config = require("./src/config.json");
var blockCommand, removeBlockCommand, banCommand, clearCommand, verifylogs;
config["commands"]["blockUser"].enabled ? blockCommand = require("./commands/block.js") : blockCommand = false;
config["commands"]["removeBlockFromUser"].enabled ? removeBlockCommand = require("./commands/removeBlock.js") : removeBlockCommand = false;
config["commands"]["banGuildMember"].enabled ? banCommand = require("./commands/removeBlock.js") : banCommand = false;
config["commands"]["clear"].enabled ? clearCommand = require("./commands/removeBlock.js") : clearCommand = false;
config.logging ? verifylogs = require("./src/logs.json") : verifylogs = false;

try {
    snekfetch.get('https://raw.githubusercontent.com/y21/discordcaptcha/master/src/config.json')
    .then(r => JSON.parse(r.body).version == config.version ? null : console.log("### A new version of discordcaptcha is available!  (Latest: " + JSON.parse(r.body).version + ")\n\n"));
} catch(e){
    console.log(e);
}


var waitingQueue = [];
var queue = [];


client.on("ready", () => {
    try {
        console.log("Logged in!")
        client.user.setGame(config.streamingGame, config.streamingLink);
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
                        var captcha = Math.floor(Math.random() * 9000) + 1001;
                        var floor = Math.floor(Math.random() * 10000) + 1;
                        var fontFace, fontSize, fontPosition;
                        if (floor < 5000) {
                            fontFace = "Comic Sans MS";
                        } else if (floor >= 5000) {
                            fontFace = "Arial";
                        }
                        var floorx = Math.floor(Math.random() * 10000) + 1;
                        fontSize = Math.floor(Math.random() * 20) + 35;
                        var height = Math.floor(Math.random() * 20) + 10 + "%";
                        var width = Math.floor(Math.random() * 20) + 10 + "%";
                        var fontColor = config.possibleCaptchaColors[Math.floor(Math.random() * 4) + 1];
                        var bgColor = config.possibleCaptchaColors[Math.floor(Math.random() * 4) + 1];
                        var rotate = Math.floor(Math.random() * 70) + 11;
                        var letterSpacing = Math.floor(Math.random() * 30) + 10;
                        var boxWidth = Math.floor(Math.random() * 30) + 30;
                        var boxHeight = Math.floor(Math.random() * 30) + 30;
                        var boxColor = config.possibleCaptchaColors[Math.floor(Math.random() * 4) + 1];
                        var boxBorderSize = Math.floor(Math.random() * 7) + 1 + "px";
                        var boxMarginTop = Math.floor(Math.random() * 70) + 10 + "%";
                        var boxMarginLeft = Math.floor(Math.random() * 70) + 10 + "%";
                        if (Math.random() > Math.random()) {
                            var rbackup = rotate;
                            rotate -= rbackup;
                            rotate -= rbackup;
                        }
                        if (bgColor === fontColor) {
                            fontColor = config.possibleCaptchaColors[Math.floor(Math.random() * 4) + 1];
                        }
                        webshot('<html><body style=\'background-image: url("http://b.reich.io/jjvoab.png");\'><h1 style="font-family:' + fontFace + '; color:' + fontColor + '; font-size:' + fontSize + 'px; position: absolute; top:' + height + ';left:' + width + '; -moz-transform: rotate(' + rotate + 'deg); -ms-transform: rotate(' + rotate + 'deg);-o-transform: rotate(' + rotate + 'deg);-webkit-transform: rotate(' + rotate + 'deg);letter-spacing: ' + letterSpacing + 'px;"><i><del>' + captcha + '</del></i></h1></body></html>', './captchas/' + floor + '.png', {
                            siteType: 'html',
                            screenSize: {
                                width: 500,
                                height: 500
                            }
                        }, function (err) {
                            message.author.send("", {
                                files: ['./captchas/' + floor + ".png"]
                            })
                        });

                        setTimeout(function () {
                            fs.unlinkSync("./captchas/" + floor + ".png");
                        }, 30000);
                        let msg = message.author.send(new Discord.RichEmbed()
                            .setTitle("Verification")
                            .setDescription("This guild is protected by discordcaptcha, an open-source verification bot made by y21#0909.")
                            .addField("Instructions", `In a few seconds an image will be sent to you which includes a number. Please send ${config.prefix}verify <captcha> into the channel ${message.channel.name} (${message.channel})`)
                            .setColor("RANDOM")
                            .setTimestamp()
                        ).catch(e => e.toString().includes("Cannot send messages to this user") ? message.reply("please turn on dms") : null);
                        tempQueryFile.query[message.author.id] = {
                            verified: "false"
                        };
                        queue.push(message.author + "x" + captcha);
                        waitingQueue.push(message.author.id);
                        verifylogs[message.author.id] = {
                            inQueue: Date.now(),
                            verifiedAt: false
                        };
                        fs.writeFile("./src/Query.json", JSON.stringify(tempQueryFile));
                        fs.writeFile("./src/logs.json", JSON.stringify(verifylogs));
                    }
                }
            } else if (message.channel.name === "verify" && message.content.includes(config.prefix + "verify")) {
                var input = message.content.substr(8);
                for (i = 0; i < queue.length; i++) {
                    var cpoint = queue[i].indexOf("x");
                }
                cpoint++;
                for (i = 0; i < queue.length; i++) {
                    var oldcaptcha = queue[i].substr(cpoint);
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
                        fs.writeFile("./src/Query.json", JSON.stringify(tempQueryFile));
                        fs.writeFile("./src/logs.json", JSON.stringify(verifylogs));
                    }

                } else {
                    if (message.content.toLowerCase() != config.prefix + "verify") {
                        message.author.send("You were kicked from " + message.guild.name + " (WRONG_CAPTCHA)");
                        message.member.kick();
                    }
                }
            }
        }

        // Moderation Commands
        if (message.content.startsWith(config.prefix)) {
            switch (message.content.split(" ")[0]) {
                case config.prefix + config["commands"]["banGuildMember"].command:
                    banCommand(message, config["commands"]["banGuildMember"].contributors)
                    break;
                case config.prefix + config["commands"]["blockUser"].command:
                    blockCommand(message, fs, config.prefix, config["commands"]["blockUser"].contributors);
                    break;
                case config.prefix + config["commands"]["removeBlockFromUser"].command:
                    removeBlockCommand(message, fs, config.prefix, config["commands"]["removeBlockFromUser"].contributors);
                    break;
                case config.prefix + config["commands"]["clear"].command:
                    clearCommand(message, config["commands"]["clear"].contributors);
                    break;
                case config.prefix + "eval":
                    if (message.author.id === config.ownerid && config.evalAllowed === "true") {
                        message.channel.send(":outbox_tray: Output: ```JavaScript\n" + eval(message.content.substr(6)) + "\n```");
                    }
                    break;
            }
        }


        // API Commands
        if (message.content.startsWith(config.prefix)) {
            if (message.content.split(" ")[0] == "?api") {
                switch(message.content.split(" ")[1]){
                case config.prefix + "queries":
                    if (message.author.id === config.ownerid) {
                        const getQueryEntries = require("./api/GetQueryEntries.js");
                        message.channel.send("```js\n" + require("util").inspect(getQueryEntries(fs)) + "\n```");
                    }
                    break;
                case config.prefix + "querydelete":
                    if (message.author.id === config.ownerid) {
                        require("./api/DeleteQueryEntries.js").all(fs);
                        message.channel.send("Deleted the query.");
                    }
                    break;
                case config.prefix + "purgelogs":
                if (message.author.id === config.ownerid) {
                    require("./api/PurgeVerifyLogs.js")(fs);
                    message.channel.send("Purged logs.");
                    console.log(1);
                    break;
                }
            }
        }
    }


        (message.channel.name === "verify" || message.content.startsWith(config.prefix + "verify") && message.author.id != client.user.id) ? message.delete(): null; // Delete Message if channels' name is "verify"
    } catch (e) {
        console.log("[DISCORDCAPTCHA-message] >> " + e);
    }
});
client.login(config.token);
