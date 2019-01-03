module.exports = class blockUser {
    static async run(message, sql) {
        if (message.args === "") return message.reply("please provide an ID.");
        if (await sql.prepare("SELECT * FROM blocked WHERE id=?").then(v => v.get([message.args]))) return message.reply("ID is already blocked.");
        sql.prepare("INSERT INTO blocked VALUES (?)").then(v => v.run([message.args])).then(() => {
            message.reply("ID successfully blocked.");
        });
    }
}