module.exports = (message, fs) => {
    let file = JSON.parse(fs.readFileSync("../src/config.json", "utf8"));
    if (message.member.hasPermission('ADMINISTRATOR')) {
        if (file.blockedIDs[args[0]].blocked == "true") {
            file.blockedIDs[args[0]].blocked = "false";
            fs.writeFileSync("./src/config.json", JSON.stringify(file));
            message.channel.send("Successfully removed the block for `" + args[0] + "`.")
        } else {
            message.channel.send("ID is not blocked.");
        }
    } else {
        return message.channel.send("Missing Permissions");
    }
};