module.exports = class banGuildMember {
    static async run(message) {
        if (message.mentions.members.size > 0) {
            let bannedUsers = 0;
            message.reply((message.mentions.members.tap(v => v.ban().then(() => ++bannedUsers).catch(e => {
                message.reply("An error occured while trying to ban `" + v.user.tag + "`: " + e.toString());
            })) ? "" : "") + bannedUsers + " user(s) banned.");
        } else message.reply("please mention user(s) to ban.")
    }
}