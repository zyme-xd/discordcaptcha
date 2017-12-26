const Discord = require('discord.js');
const client = new Discord.Client();
const fs = require("fs");
const config = require("./src/config.json");
const token = config.token;
const clientID = config.clientid;
const prefix = config.prefix;
const normalChat = config.chat;
const userRoleID = config.userrole;
const evalPerm = config.evalAllowed;
const owner = config.ownerid;
const streamingGame = config.streamingGame;
const streamingLink = config.streamingLink;
const colors = config.possibleCaptchaColors;
const blockedAccountIDs = config.blockedIDs;
const query = require("./src/Query.json");
const blockCommand = require("./commands/block.js");
const removeBlockCommand = require("./commands/removeBlock.js");
const banCommand = require("./commands/ban.js");
const clearCommand = require("./commands/clear.js");
const queryFile = JSON.parse(fs.readFileSync("./src/Query.json", "utf8"));
// Configuration File: src/config.json
var waitingQueue = [];
var queue = [];
client.on("guildMemberAdd", (member) => {
    try {
        member.user.send({
            embed: {
                color: 0xffff00,
                description: "To verify yourself as a human, write `" + prefix + "receive` in the guild to receive your captcha"
            }
        });
    } catch (e) {
        console.log("[DISCORDCAPTCHA-guildMemberAdd] >> " + e)
    }
});
client.on("ready", () => {
    try {
        console.log("Logged in!")
        client.user.setGame(streamingGame, streamingLink);
    } catch (e) {
        console.log("[DISCORDCAPTCHA-readyEvent] >> " + e)
    }
});

client.on('message', (message) => {
    try {
        if (!message.guild) return;
        const file = JSON.parse(fs.readFileSync("./src/config.json", "utf8"));
        const args = message.content.slice(prefix.length).trim().split(/ +/g);
        const command = args.shift().toLowerCase();
        var time = new Date();
        if (file.blockedIDs[message.author.id]) {
            if (file.blockedIDs[message.author.id].blocked == "true") {
                message.member.kick();
                console.log(message.member + " was kicked.");
            }
        }
        if (message.author.id != clientID) {
            if (message.content === prefix + "receive" || message.content === prefix + "verify" || message.content === prefix + "captcha") {
                if (message.channel.name === "verify") {
                    if (message.member.roles.has(userRoleID)) {
                        message.author.send({
                            embed: {
                                color: 0xff0000,
                                description: "Already verified on `" + message.guild.name + "`"
                            }
                        });
                    } else {
                        var captcha = Math.floor(Math.random() * 9000) + 1001;
                        var floor = Math.floor(Math.random() * 10000) + 1;
                        let webshot = require("webshot");
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
                        var fontColor = colors[Math.floor(Math.random() * 4) + 1];
                        var bgColor = colors[Math.floor(Math.random() * 4) + 1];
                        var rotate = Math.floor(Math.random() * 70) + 11;
                        var letterSpacing = Math.floor(Math.random() * 30) + 10;
                        var boxWidth = Math.floor(Math.random() * 30) + 30;
                        var boxHeight = Math.floor(Math.random() * 30) + 30;
                        var boxColor = colors[Math.floor(Math.random() * 4) + 1];
                        var boxBorderSize = Math.floor(Math.random() * 7) + 1 + "px";
                        var boxMarginTop = Math.floor(Math.random() * 70) + 10 + "%";
                        var boxMarginLeft = Math.floor(Math.random() * 70) + 10 + "%";
                        if (Math.random() > Math.random()) {
                            var rbackup = rotate;
                            rotate -= rbackup;
                            rotate -= rbackup;
                        }
                        if (bgColor === fontColor) {
                            fontColor = colors[Math.floor(Math.random() * 4) + 1];
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
                        message.author.send({
                            embed: {
                                color: 0x0000ff,
                                description: "Write `!verify` <code> in the guild to write in all channel. \n\n**Verification Bot made by y21#0909**"
                            }
                        });
                        message.delete();
                        queryFile.query[message.author + "x" + captcha] = {
                            verified: "false"
                        };
                        fs.writeFile("./src/Query.json", JSON.stringify(queryFile));
                        queue.push(message.author + "x" + captcha);
                        waitingQueue.push(message.author.id);
                        console.log(queue);
                    }
                }
            } else if (message.channel.name === "verify" && message.content.includes(prefix + "verify")) {
                var input = message.content.substr(8);
                for (i = 0; i < queue.length; i++) {
                    var cpoint = queue[i].indexOf("x");
                }
                cpoint++;
                for (i = 0; i < queue.length; i++) {
                    var oldcaptcha = queue[i].substr(cpoint);
                }
                if (input === oldcaptcha) {
                    if (message.member.roles.has(userRoleID)) {
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
                        client.channels.find('name', normalChat).send("<@" + message.author.id + "> was successfully verified.");
                        queryFile.query[message.author.id + "x" + oldcaptcha].verified = "true";
                        queue.pop();
                        fs.appendFileSync("./verify_logs.txt", "[VerifyBot] " + time.getHours() + ":" + time.getMinutes() + ":" + time.getSeconds() + "| " + message.author.tag + "(" + message.author.id + ") verified himself.\n");
                        message.member.addRole(userRoleID).catch(error => console.log(error));
                    }

                } else {
                    if (message.content.toLowerCase() != prefix + "verify") {
                        message.author.send("You were kicked from " + message.guild.name + " (WRONG_CAPTCHA)");
                        message.delete();
                        message.member.kick();
                    }
                }
            }
        }
        if (message.content.toLowerCase().startsWith(prefix + "ban")) {
            banCommand(message);
        }
        if (message.content.toLowerCase().startsWith(prefix + "block")) {
            blockCommand(message, fs, prefix);
        }
        if (message.content.startsWith(prefix + "removeBlock")) {
            removeBlockCommand(message, fs, prefix);
        }
        if (message.content.startsWith(prefix + "clear")) {
            clearCommand(message);
        }
        if (message.author.id === owner && evalPerm === "true" && message.content.startsWith(prefix + "eval")) {
            message.channel.send(":outbox_tray: Output: ```JavaScript\n" + eval(message.content.substr(6)) + "\n```");
        }
        message.channel.name === "verify" ? message.delete() : null; // Delete Message if channels' name is "verify"
    } catch (e) {
        console.log("[DISCORDCAPTCHA-message] >> " + e);
    }
});
client.login(config.token);
