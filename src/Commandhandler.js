module.exports = class CommandHandler {
    constructor(commands, config) {
        this.config = config;
        this.commands = commands;
    }
    exec(message) {
        message.command = message.content.split(" ")[0].substr(this.config.prefix.length);
        if (!this.commands.some(v => v.alias === message.command)) return;
        if (message.author.id !== this.config.ownerid && !Object.entries(this.config.commands).find(v => v[1].command === message.command)[1].contributors.includes(message.author.tag)) return;
        this.commands.find(v => v.alias === message.command).run(message);
    }
}