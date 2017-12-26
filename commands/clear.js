module.exports = (message) => {
    try {
        if (message.member.hasPermission('MANAGE_MESSAGES')) {
            message.channel.bulkDelete(message.content.substr(7));
        } else {
            return message.channel.send("Missing Permissions");
        }
    } catch (e) {
        console.log("[DISCORDCAPTCHA-clearMessages] >> " + e);
    }
};