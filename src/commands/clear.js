module.exports = class clearCommand {
    static run(message) {
        message.channel.bulkDelete(parseInt(message.args) + 1 || 11).then(v => {
            message.reply(`Deleted ${v.size} messages.`).then(m => m.delete(2500));
        }).catch(() => {
            message.reply("An error occured while trying to bulk delete.");
        });
    }
}