/**
 * @param {Object} message - The message object, needed to get mentioned users, check if member has ADMINISTRATOR permissions and convert the first mentioned user in a guildmember 
 * @returns {promise} message - The "missing permissions" promise (will return if member has not enough permissions
**/
module.exports = (message) => {
    try {
    if (message.member.hasPermission('ADMINISTRATOR')) {
        message.guild.member(message.mentions.users.first()).ban();
    } else {
        return message.channel.send("Missing Permissions");
    }
}catch(e){
    console.log("[DISCORDCAPTCHA-ban] >> " + e);
}
};
