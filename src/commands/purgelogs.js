module.exports = class purgelogsCommand {
    static run(message, sqlite) {
        sqlite.run("DELETE FROM logs").then(() => {
            message.reply("Succesfully purged logs.");
        }).catch(() => {
            message.reply("An error occured while trying to purge logs.");
        })
    }
}