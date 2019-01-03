module.exports = class querydeleteCommand {
    static run(message, sqlite) {
        sqlite.run("DELETE FROM queries").then(() => {
            message.reply("Query deleted.");
        }).catch(() => {
            message.reply("An error occured.");
        });
    }
}