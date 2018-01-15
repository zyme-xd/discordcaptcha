class Captcha {
	/**
     * @param {string} captcha - The captcha (pass null and call generate method if it shall be random)
     * @param {object} author - The author object (Has to has an id property and should look like <@123456789>)
     */
	constructor(captcha, author) {
		this.captcha = captcha;
		this.author = author;
	}

	/**
     * @returns {string} Captcha value of class
     */
	generate() {
		let temp = fs.readdirSync("./captchas", callback_);
		let rand = Math.floor(Math.random() * temp.length);
		this.captcha = temp[rand];
		return this.captcha;
	}
	
	log(){
		let tempQueryFile = JSON.parse(fs.readFileSync("./src/Query.json", "utf8"));
		verifylogs[this.author.id] = {
			inQueue: Date.now(),
			verifiedAt: false
		};
		fs.writeFile("./src/Query.json", JSON.stringify(tempQueryFile), callback_);
		fs.writeFile("./src/logs.json", JSON.stringify(verifylogs), callback_);
	}
}
// Module Imports and instances
const Discord = require("discord.js");
const client = new Discord.Client();
const fs = require("fs");
const snekfetch = require("snekfetch");
const verifylogs = require("./src/logs.json");

// Command Imports
const config = require("./src/config.json");
const callback_ = err => {
	err ? console.error(err) : null;
};


let queue = [], latestVersion;

try {
	snekfetch.get("https://raw.githubusercontent.com/y21/discordcaptcha/master/src/config.json")
		.then(r => {
			JSON.parse(r.body).version == config.version ? null : console.log("### A new version of discordcaptcha is available!  (Latest: " + JSON.parse(r.body).version + ")\n\n");
			latestVersion = JSON.parse(r.body).version;
		});
} catch (e) {
	console.log(e);
}

client.on("ready", () => {
	try {
		console.log("Logged in!");
		client.user.setActivity(config.streamingGame, {url: config.streamingLink, type: "STREAMING"});
		client.guilds.size > 1 ? console.log("It looks like this bot is on more than one guild. It is recommended not to have this bot on more than one since it could do random stuff.") : null;
		client.guilds.forEach(guild => {
			!guild.roles.get(config.userrole) ? console.log(`${guild.name} has no userrole or the snowflake that was given in the config file is invalid.`) : null;
		});
	} catch (e) {
		console.log("[DISCORDCAPTCHA-readyEvent] >> " + e);
	}
});

client.on("message", (message) => {
	try{
		if(config["blockedIDs"][message.author.id]){
			if(config["blockedIDs"][message.author.id].blocked === "true"){
				message.member.kick();
			}
		}
		let tempQueryFile = JSON.parse(fs.readFileSync("./src/Query.json", "utf8"));
		if (message.channel.name === "verify") {
			message.delete();
			if (message.content === `${config.prefix}verify`) {
				if (tempQueryFile["query"][message.author.id]) return message.reply("Already verified or in queue!");
				let captchaInstance = new Captcha(null, message.author);
				let captcha = captchaInstance.generate();
				message.author.send(new Discord.RichEmbed()
					.setTitle("Verification")
					.setDescription("This guild is protected by discordcaptcha, an open-source verification bot made by y21#0909.")
					.addField("Instructions", `In a few seconds an image will be sent to you which includes a number. Please send ${config.prefix}verify <captcha> into the channel ${message.channel.name} (${message.channel})`)
					.setColor("RANDOM")
					.setTimestamp()
				).catch(e => e.toString().includes("Cannot send messages to this user") ? message.reply("please turn on dms") : null);
				message.author.send({ files: [new Discord.Attachment(`./captchas/${captcha}`, "captcha.png")] });
				tempQueryFile.query[message.author.id] = {
					verified: "false"
				};
				captchaInstance.log();
				message.channel.awaitMessages(msg => msg.content === config.prefix + "verify " + captchaInstance.captcha.substr(0, captchaInstance.captcha.indexOf(".")) && msg.author === message.author, {
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
						config.logging ? client.channels.find("name", config.chat).send("<@" + message.author.id + "> was successfully verified.") : null;
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
					}).catch(() => {});
			}
		}

		require("./src/Commands.js")(message, config, Discord, fs, latestVersion); // Command Handler
	}catch(e){
		console.log(e);
	}
});
process.on("unhandledRejection", (err) => {
	console.log(err);
});

client.login(config.token);
