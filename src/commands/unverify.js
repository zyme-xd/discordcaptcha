module.exports = class unverifyCommand {
    static async run(message, sqlite, config) {
        try {
            await sqlite.prepare("DELETE FROM queries WHERE id = ?").then(v => v.run([message.author.id]));
            await message.member.removeRole(message.guild.roles.find(v => v.id === config.userrole)).then(() => {
                message.reply("Successfully unverified.");
            });
        } catch(e) {
            message.reply("An error occured: " + e.toString());
        }
    }
}