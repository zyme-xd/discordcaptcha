module.exports.run = function(message) {

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