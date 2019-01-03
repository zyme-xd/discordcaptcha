module.exports = class CommandHandler {
    constructor(commands, config, sql) {
        this.sql = sql;
        this.config = config;
        this.commands = commands;
    }
    exec(message) {
        message.command = message.content.split(" ")[0].substr(this.config.prefix.length);
        message.args = message.content.split(" ").slice(1).join(" ");
        if (!this.commands.some(v => v.alias === message.command)) return;
        if (message.author.id !== this.config.ownerid && !Object.entries(this.config.commands).find(v => v[1].command === message.command)[1].contributors.includes(message.author.tag)) return;
        if (this.commands.find(v => v.alias === message.command).enabled !== true) return message.reply("❌ | Command disabled.");
        this.commands.find(v => v.alias === message.command).run(message, this.sql, this.config);
    }
}