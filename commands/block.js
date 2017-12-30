/**
 * @param {Object} message - The message object
 * @param {Module} fs - The npm module fs
 * @param {string} prefix - The prefix
 * @param {array} contrib - Users that are allowed to use that command
**/
module.exports = (message, fs, prefix, contrib) => {
    try {
        let file = JSON.parse(fs.readFileSync("./src/config.json", "utf8"));
        const args = message.content.slice(prefix.length).trim().split(/ +/g);
        if (contrib.includes(message.author.tag)) {
            if (message.mentions.users.size === 0) {
                if (!file.blockedIDs[args[1]]) file.blockedIDs[args[1]] = {
                    blocked: "false"
                };
                if (file.blockedIDs[args[1]].blocked == "false") {
                    file.blockedIDs[args[1]] = {
                        blocked: "true"
                    };
                    fs.writeFileSync("./src/config.json", JSON.stringify(file));
                    message.channel.send("Added `" + message.content.substr(7) + "` to the blocked list.");
                } else {
                    message.channel.send("ID is already blocked.");
                }
            } else {
                if (!file.blockedIDs[message.mentions.users.first().id]) file.blockedIDs[message.mentions.users.first().id] = {
                    blocked: "false"
                };
                if (file.blockedIDs[message.mentions.users.first().id].blocked == "false") {
                    file.blockedIDs[message.mentions.users.first().id] = {
                        blocked: "true"
                    };
                    fs.writeFileSync("./src/config.json", JSON.stringify(file));
                    message.channel.send("Added `" + message.mentions.users.first().id + "` to the blocked list.");
                } else {
                    message.channel.send("ID is already blocked.");
                }
            }
        } else {
            return message.channel.send("Missing Permissions");
        }
    } catch (e) {
        console.log("[DISCORDCAPTCHA-block] >> " + e);
    }
}