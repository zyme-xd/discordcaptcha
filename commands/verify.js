const { randomBytes } = require("crypto");
const Jimp = require("jimp");
const { RichEmbed } = require("discord.js");

module.exports = async function(message) {
    // Check if channel is verification channel (provided in config.json) or if it was sent in a dm
    if (message.channel.type !== "dm" && message.channel.id !== this.config.servers[message.guild.id].verificationChannel) return;

    if (message.args.length === 0 && message.channel.type !== "dm") {
        // No arguments provided
        const captcha = randomBytes(32).toString("hex").substr(0, 6);
        const font = await Jimp.loadFont(Jimp.FONT_SANS_64_BLACK);
        const image = await Jimp.read("./assets/noise.jpg");
        const [x, y] = new Array(2).fill(Math.floor(Math.random() * 100));
        image.print(font, x, y, captcha);

        const buffer = await image.getBufferAsync(Jimp.MIME_JPEG);
        const embed = new RichEmbed()
            .setTitle("Verification")
            .setDescription("This server is protected by [DiscordCaptcha](https://github.com/y21/discordcaptcha), an open-source project that prevents servers from being raided.\n" +
                "Please solve this captcha by sending `" + this.config.prefix + "verify [code]` in <#" + message.channel.id + ">")
            .attachFile({ attachment: buffer, name: "captcha.jpeg" })
            .setImage("attachment://captcha.jpeg");

        message.author.send(embed).catch(() => {
            message.reply("⛔ | Could not send captcha, maybe you have Direct Messages disabled?");
        });

        this.query.set(message.author.id, {
            captcha,
            guild: message.guild.id
        });

    } else if (message.args.length === 1) {
        // Arguments provided
        if (!this.query.has(message.author.id)) return message.reply("⛔ | Please request a captcha by sending `" + this.config.prefix + "verify`");

        const { captcha, guild: id } = this.query.get(message.author.id);
        const guild = this.guilds.get(id);
        let member = guild.members.get(message.author.id) || await guild.fetchMember(message.author.id);

        if (message.args[0] !== captcha) return message.reply("⛔ | Invalid captcha!");
        else {
            member.addRole(this.config.servers[message.guild.id].verificationRole).then(() => {
                message.reply("✅ | Successfully verified.");
            }).catch(console.error);
            this.query.delete(message.author.id);
        }

    }
};

module.exports.info = {
    description: "Used to receive a captcha or to use it",
    args: [
        { required: false, description: "The captcha code", name: "captcha" }
    ]
};