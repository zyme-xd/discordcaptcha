/**
 * @param {Object} message - The message object, needed to get mentioned users, check if member has ADMINISTRATOR permissions and convert the first mentioned user in a guildmember 
 * @param {array} contrib - Users that are allowed to use that command
 * @returns {promise} message - The "missing permissions" promise (will return if member has not enough permissions
**/
module.exports = (message, contrib) => {
    try {
    if (contrib.includes(message.author.tag)) {
        message.guild.member(message.mentions.users.first()).ban();
    }
}catch(e){
    console.log("[DISCORDCAPTCHA-ban] >> " + e);
}
};