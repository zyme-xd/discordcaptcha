module.exports = (message) => {
    if (message.member.hasPermission('MANAGE_MESSAGES')) {
        try {
            message.channel.bulkDelete(message.content.substr(7));
        } catch (e) {
            message.reply(e);
        }
    } else {
        return message.channel.send("Missing Permissions");
    }
};