module.exports = class removeBlockFromUserCommand {
    static async run(message, sqlite) {
        let check = await sqlite.prepare("SELECT * FROM blocked WHERE id = ?").then(v => v.get([message.args]));
        if (check === undefined) return message.reply("ID is not blocked.");
        sqlite.prepare("DELETE FROM blocked WHERE id = ?").then(v => v.run([message.args])).then(() => {
            message.reply(`Removed block for ID \`${message.args}\``);
        });
    }
}