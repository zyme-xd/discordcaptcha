module.exports = class queriesCommand {
    static run(message, sqlite) {
        sqlite.all("SELECT * FROM queries").then(v => {
            message.reply(v.map(val => val.id).join("\n"));
        });
    }
}