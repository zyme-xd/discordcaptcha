// Module Imports and instances
const Discord = require("discord.js");
const client = new Discord.Client();
const fs = require("fs");
const fetch = require("node-fetch");
const jimp = require("jimp");
const sql = require("sqlite");
sql.open("./src/db.sqlite");
const { version } = require("./package.json");

class Captcha {
    /**
     * @param {string} captcha - The captcha (pass null and call generate method if it shall be random)
     * @param {object} author - The author object (Has to has an id property and should look like <@123456789>)
     * @param {buffer} image buffer - Initialize object with an already existing image buffer
     */
    constructor(captcha, author, buff) {
        this._captcha = captcha;
    }

    /**
     * @returns {string} Captcha value of class
     */
    generate() {
        let rand = Math.random().toString(36).substr(2, 6);
        this.captcha = rand;
        return this.captcha;
    }

    get captcha() {
        return this._captcha;
    }

    set captcha(value) {
        this._captcha = value;
    }
}

// Command Imports
const config = require("./src/config.json");
fetch("https://raw.githubusercontent.com/y21/discordcaptcha/master/src/config.json")
.then(v => v.text())
.then(v => {
    v = JSON.parse(v);
    if (v.version !== version) {
        console.log("A new version of discordcaptcha is available.");
    }
});


client.on("ready", () => {
    try {
        console.log("Logged in!");
        if (client.guilds.size > 1) console.log("It looks like this bot is on more than one guild. It is recommended not to have this bot on more than one since it could do random stuff.")
        client.guilds.forEach(guild => {
            if (!guild.roles.get(config.userrole)) console.log(`${guild.name} has no userrole or the snowflake that was given in the config file is invalid.`);
        });
    } catch (e) {
        console.log("[DISCORDCAPTCHA-readyEvent] >> " + e);
    }
});

client.on("warn", console.warn);
client.on("error", console.error);
client.on("disconnect", () => console.log("Bot disconnected from WebSocket!"));
client.on("reconnect", () => console.log("Reconnecting to WebSocket ..."));

client.on("guildMemberRemove", member => {
    sql.prepare("DELETE FROM queries WHERE id = ?").then(v => v.run([member.id]));
});

client.on("message", async (message) => {
    try {
        if (await sql.prepare("SELECT * FROM blocked WHERE id = ?").then(v => v.get([message.author.id]))) message.member.kick();
        if (message.channel.name === "verify") {
            if (message.author.id != client.user.id) message.delete();
            else message.delete(2500);
            if (message.content === `${config.prefix}verify`) {
                if (await sql.prepare("SELECT * FROM queries WHERE id = ?").then(v => v.get([message.author.id]))) return message.reply("Already verified or in queue!");
                let captchaInstance = new Captcha(null, message.author);
                let captcha = captchaInstance.generate();
                if (config.captchaType == "image") {
                    let image = await jimp.read("https://i.imgur.com/mkoc2Fh.png");
                    image.resize(750, 750); // make bigger
                    image.print(await jimp.loadFont(jimp.FONT_SANS_64_BLACK), Math.random() * 400, Math.random() * 400, captcha); // print captcha on image
                    message.author.send(new Discord.RichEmbed()
                        .setTitle("Verification")
                        .setDescription("This guild is protected by DiscordCaptcha, an open-source verification bot made by y21#0909.")
                        .addField("Instructions", `In a few seconds an image will be sent to you which includes a number. Please send ${config.prefix}verify <captcha> into the channel ${message.channel.name} (${message.channel})`)
                        .setColor("RANDOM")
                        .setTimestamp()
                    ).catch(e => e.toString().includes("Cannot send messages to this user") ? message.reply("please turn on direct messages.") : null);
                    image.getBuffer(jimp.MIME_PNG, (err, buff) => {
                        message.author.send(new Discord.Attachment(buff, "captcha.png"));
                    });
                } else if (config.captchaType == "text") {
                    message.author.send(new Discord.RichEmbed()
                        .setDescription("Paste the code below in the verify channel to get verified.\n\n**Verification Bot made by y21#0909**")
                    );
                    message.author.send(`${config.prefix}verify ${captchaInstance.captcha}`, {
                        code: "js"
                    });
                }
                sql.prepare("INSERT INTO queries VALUES (?)").then(v => v.run([message.author.id]));
                sql.run('insert into queries values ("' + message.author.id + '")');
                message.channel.awaitMessages(msg => msg.content === config.prefix + "verify " + captchaInstance.captcha && msg.author === message.author, {
                        max: 1,
                        errors: ["time"]
                    })
                    .then(() => {
                        message.author.send({
                            embed: {
                                color: 0x00ff00,
                                description: "Successfully verified on `" + message.guild.name + "`"
                            }
                        });
                        let logChannel = client.channels.get(config.chat) || client.channels.find("name", config.chat);
                        if (logChannel && logChannel.type === "text") logChannel.send(`${message.author.toString()} was successfully verified.`);
                        if (config.logging) sql.prepare("INSERT INTO logs VALUES (?, ?)").then(v => v.run([message.author.id, Date.now()]));
                        sql.prepare("DELETE FROM queries WHERE id = ?").then(v => v.run([message.author.id]));
                        message.member.addRole(config.userrole).catch(()=>{});
                        delete captchaInstance;
                    }).catch(console.log);
            }
        }
        require("./src/Commands.js")(message, config, Discord, fs); // Command Handler
    } catch (e) {
        console.log(e);
    }
});
process.on("unhandledRejection", console.log);

client.login(config.token);
