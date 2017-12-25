module.exports = (message) => {
    if (message.member.hasPermission('ADMINISTRATOR')) {
        message.guild.member(message.mentions.users.first()).kick();
    }
};