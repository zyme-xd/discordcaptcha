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
    if (!(await versionCheck()).sameVer) console.log("[WARN] Latest version is not identical to local version");
};