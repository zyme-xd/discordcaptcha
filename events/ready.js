const versionCheck = require("../utils/versionCheck");

module.exports.run = async function() {
    console.log(`[LOG] Logged in (${this.guilds.size} servers - ${this.users.size} users)!`);

    // Check version
    await versionCheck();

    // Init DB
    await this.db.open("./database.sqlite");
    await this.db.run("CREATE TABLE IF NOT EXISTS `queries` (`id` TEXT)");
};