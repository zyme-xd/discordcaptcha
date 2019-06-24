module.exports.run = function(message) {
    // Check if message starts with prefix, is not sent by a bot and not in DMs
    if (message.content.startsWith(this.config.prefix) || !message.author.bot || message.guild) return;

    // Define required properties
    Object.defineProperties(message, {
        command: {
            value: message.content.substr(this.config.prefix.length).split(" ")[0]
        },
        args: {
            value: message.content.split(" ").slice(1)
        }
    });

    // Check if command exists
    if (!this.commands.has(message.command)) return;

    // Run command
    this.commands.get(message.command).bind(this)(message);
};