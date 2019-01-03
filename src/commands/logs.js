const { inspect } = require("util");

module.exports = class logsCommand {
    static run(message, sqlite) {
        sqlite.all("SELECT * FROM logs").then(v => {
            message.reply(inspect(v.map(val => { return {
                user: message.client.users.get(val.id).tag,
                verifiedAt: new Date(parseInt(val.timestamp)).toLocaleString()
            }})), {
                code: "js"
            });
        })
    }
}