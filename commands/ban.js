module.exports = (message) => {
    try {
    if (message.member.hasPermission('ADMINISTRATOR')) {
        message.guild.member(message.mentions.users.first()).ban();
    }
}catch(e){
    console.log("[DISCORDCAPTCHA-ban] >> " + e);
}
};