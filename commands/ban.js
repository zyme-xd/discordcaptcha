/**
 * @param {string} message - The message object, needed to get mentioned users, check if member has ADMINISTRATOR permissions and convert the first mentioned user in a guildmember 
**/
module.exports = (message) => {
    try {
    if (message.member.hasPermission('ADMINISTRATOR')) {
        message.guild.member(message.mentions.users.first()).ban();
    }
}catch(e){
    console.log("[DISCORDCAPTCHA-ban] >> " + e);
}
};
