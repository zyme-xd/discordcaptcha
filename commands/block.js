module.exports =  (message, fs) => {
    let file = JSON.parse(fs.readFileSync("../src/config.json", "utf8"));
    if (message.member.hasPermission('ADMINISTRATOR')) {
        if (!file.blockedIDs[args[0]]) {
            file.blockedIDs[args[0]] = {
                blocked: "true"
            };
            fs.writeFileSync("../src/config.json", JSON.stringify(file));
            message.channel.send("Added `" + message.content.substr(7) + "` to the blocked list.");
        } else {
            message.channel.send("ID is already blocked.");
        }

    } else {
        return message.channel.send("Missing Permissions");
    }
}