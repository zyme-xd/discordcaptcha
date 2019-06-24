module.exports = function(message) {
    message.reply(`pong! ${this.ping}`);
};

module.exports.info = {
    description: "Simple ping command",
    args: [ ]
};