module.exports = class makerole {
    static run(message) {
        message.guild.createRole({
            name: message.args || "Verified",
            color: 0x00ff00,
            permissions: [
                "SEND_MESSAGES"
            ]
        }, "discordcaptcha verified user role").catch(e => {
            message.reply("An error occured while trying to create the role: " + e.toString());
        }).then(role => {
            message.reply("Successfully created the role. ID: " + role.id);
        });
    }
}