module.exports =  (message, fs, prefix) => {
    let file = JSON.parse(fs.readFileSync("./src/config.json", "utf8"));
    const args = message.content.slice(prefix.length).trim().split(/ +/g);
    if (message.member.hasPermission('ADMINISTRATOR')) {
        if (!file.blockedIDs[args[1]]) {
            file.blockedIDs[args[1]] = {
                blocked: "true"
            };
            fs.writeFileSync("./src/config.json", JSON.stringify(file));
            message.channel.send("Added `" + message.content.substr(7) + "` to the blocked list.");
        } else {
            message.channel.send("ID is already blocked.");
        }

    } else {
        return message.channel.send("Missing Permissions");
    }
}