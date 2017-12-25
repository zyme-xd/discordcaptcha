module.exports = (message, fs, prefix) => {
    let file = JSON.parse(fs.readFileSync("./src/config.json", "utf8"));
    const args = message.content.slice(prefix.length).trim().split(/ +/g);
    if (message.member.hasPermission('ADMINISTRATOR')) {
        if(file.blockedIDs[args[1]]){
        if (file.blockedIDs[args[1]].blocked == "true") {
            file.blockedIDs[args[1]].blocked = "false";
            fs.writeFileSync("./src/config.json", JSON.stringify(file));
            message.channel.send("Successfully removed the block for `" + args[1] + "`.")
        }
        } else {
            message.channel.send("ID is not blocked.");
        }
    } else {
        return message.channel.send("Missing Permissions");
    }
};