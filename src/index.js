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
const modules = require("./src/Modules.js");
const webshot = require("webshot");
// Configuration File: src/config.json

var waitingQueue = [];
var queue = [];
var kicked = [];
client.on("guildMemberAdd", (member) => {
    member.user.send({
        embed: {
            color: 0xffff00,
            description: "To verify yourself as a human, write `" + prefix + "receive` in the guild to receive your captcha"
        }
    });
});


client.on("ready", () => {
    console.log("Logged in!")
    client.user.setGame(streamingGame, streamingLink);
});

client.on('message', (message) => {
    if (!message.guild) return;
    let file = JSON.parse(fs.readFileSync("./src/config.json", "utf8"));
    let queryFile = JSON.parse(fs.readFileSync("./src/Query.json", "utf8"));
    const args = message.content.slice(prefix.length).trim().split(/ +/g);
    const command = args.shift().toLowerCase();
    var time = new Date();
    var content = message.content;
    var author = message.author.id;
    modules.blockedID(file, message);
    if (message.author.id != clientID) {
        if (message.content === prefix + "receive" || message.content === prefix + "verify" || message.content === prefix + "captcha") {
            if (message.channel.name === "verify") {
                if (message.member.roles.has(userRoleID)) {
                    modules.alreadyVerified(message);
                } else {
                    var captcha = Math.floor(Math.random() * 9000) + 1001;
                    modules.createCaptcha(webshot, message, colors, captcha);
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

                    queryFile.query[author + "x" + captcha] = {
                        verified: "false"
                    };
                    fs.writeFile("./src/Query.json", JSON.stringify(queryFile));
                    queue.push(author + "x" + captcha);




                    waitingQueue.push(message.author.id);
                    console.log(queue);
                }
            }
        } else if (message.channel.name === "verify" && message.content.includes(prefix + "verify")) {
            modules.checkVerify(message, client, queue, prefix);
        }
    }
    if (message.content.toLowerCase().startsWith(prefix + "ban")) {
        if (message.member.hasPermission('ADMINISTRATOR')) {
            message.guild.member(message.mentions.users.first()).kick();
        }
        modules
    }
    if (message.content.toLowerCase().startsWith(prefix + "block")) {
        if (message.member.hasPermission('ADMINISTRATOR')) {
            if (!file.blockedIDs[args[0]]) {
                file.blockedIDs[args[0]] = {
                    blocked: "true"
                };
                fs.writeFileSync("./src/config.json", JSON.stringify(file));
                message.channel.send("Added `" + message.content.substr(7) + "` to the blocked list.");
            } else {
                message.channel.send("ID is already blocked.");
            }

        } else {
            return message.channel.send("Missing Permissions");
        }
    }
    if (message.content.toLowerCase().startsWith(prefix + "removeBlock")) {
        if (message.member.hasPermission('ADMINISTRATOR')) {
            if (file.blockedIDs[args[0]].blocked == "true") {
                file.blockedIDs[args[0]].blocked = "false";
                fs.writeFileSync("./src/config.json", JSON.stringify(file));
                message.channel.send("Successfully removed the block for `" + args[0] + "`.")
            } else {
                message.channel.send("ID is not blocked.");
            }
        } else {
            return message.channel.send("Missing Permissions");
        }
    }

    if (message.content.startsWith(prefix + "clear") && message.content.indexOf("captcha") === "-1") {
        if (message.member.hasPermission('ADMINISTRATOR')) {
            message.channel.bulkDelete(message.content.substr(7));
        } else {
            return message.channel.send("Missing Permissions");
        }
    }
    if (message.channel.name === "verify") {
        message.delete();
    }
    if (message.author.id === owner && evalPerm === "true" && message.content.startsWith(prefix + "eval")) {
        message.channel.send(":outbox_tray: Output: ```JavaScript\n" + eval(message.content.substr(6)) + "\n```");
    }

});
client.login(config.token);