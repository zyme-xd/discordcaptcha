const versionCheck = require("../utils/versionCheck");

module.exports.run = async function() {
    console.log(`[LOG] Logged in (${this.guilds.size} servers - ${this.users.size} users)!`);

    if (Object.keys(this.config.presence).length !== 0) {
        this.user.setPresence({
            game: {
                name: this.config.presence.name,
                type: this.config.presence.type
            },
            status: "online"
        }).catch(console.error);
    }

    // Check version
    await versionCheck();

    // Init DB
    await this.db.open("./database.sqlite");
    await this.db.run("CREATE TABLE IF NOT EXISTS `queries` (`id` TEXT)");
};