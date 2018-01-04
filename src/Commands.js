module.exports = (message, config, Discord, fs) => {
    var blockCommand, removeBlockCommand, banCommand, clearCommand, verifylogs, versionCommand;
    config["commands"]["blockUser"].enabled ? blockCommand = require("../commands/block.js") : blockCommand = false;
    config["commands"]["removeBlockFromUser"].enabled ? removeBlockCommand = require("../commands/removeBlock.js") : removeBlockCommand = false;
    config["commands"]["banGuildMember"].enabled ? banCommand = require("../commands/removeBlock.js") : banCommand = false;
    config["commands"]["clear"].enabled ? clearCommand = require("../commands/clear.js") : clearCommand = false;
    config["commands"]["version"].enabled ? versionCommand = true : versionCommand = false;
    config.logging ? verifylogs = require("../src/logs.json") : verifylogs = false;
    const Handler = require("../api/Handler.js");

    // Bot Commands
    if (message.content.startsWith(config.prefix)) {
        switch (message.content.split(" ")[0]) {
            case config.prefix + config["commands"]["banGuildMember"].command:
                if (!banCommand) return;
                banCommand(message, config["commands"]["banGuildMember"].contributors)
                break;
            case config.prefix + config["commands"]["blockUser"].command:
                if (!blockCommand) return;
                blockCommand(message, fs, config.prefix, config["commands"]["blockUser"].contributors);
                break;
            case config.prefix + config["commands"]["removeBlockFromUser"].command:
                if (!removeBlockCommand) return;
                removeBlockCommand(message, fs, config.prefix, config["commands"]["removeBlockFromUser"].contributors);
                break;
            case config.prefix + config["commands"]["clear"].command:
                if (!clearCommand) return;
                clearCommand(message, config["commands"]["clear"].contributors);
                break;
            case config.prefix + "eval":
                if (message.author.id === config.ownerid && config.evalAllowed === "true") {
                    message.channel.send(":outbox_tray: Output: ```JavaScript\n" + eval(message.content.substr(6)) + "\n```");
                }
                break;
            case config.prefix + config["commands"]["version"].command:
                versionCommand ? message.channel.send(new Discord.RichEmbed()
                    .setColor("RANDOM")
                    .setTitle("Version")
                    .setDescription(`Current DiscordCaptcha version: \`${config.version}\`\nLatest version: \`${latestVersion}\``)
                    .addField("Repository", "https://github.com/y21/discordcaptcha/")
                    .setTimestamp()
                ) : null;
                break;
        }
    }


    // API Commands
    if (message.content.startsWith(config.prefix)) {
        if (message.content.split(" ")[0] == "?api") {
            switch (message.content.split(" ")[1]) {
                case "queries":
                    if (message.author.id === config.ownerid) {
                        message.channel.send("```js\n// Query\n\n" + require("util").inspect(new Handler("GetQueryEntries").request()) + "\n```");
                    }
                    break;
                case "querydelete":
                    if (message.author.id === config.ownerid) {
                        new Handler("DeleteQueryEntries").request();
                        message.channel.send("Deleted the query.");
                    }
                    break;
                case "purgelogs":
                    if (message.author.id === config.ownerid) {
                        new Handler("PurgeVerifyLogs").request();
                        message.channel.send("Purged logs.");
                    }
                    break;
                case "logs":
                    if (message.author.id === config.ownerid) {
                        message.channel.send("```js\n// Logs\n\n" + require("util").inspect(new Handler("GetLogs").request()) + "\n```");
                    }
                    break;
                case "captchas":
                if (message.author.id === config.ownerid) {
                    message.channel.send("```js\n// Captchas\n\n" + require("util").inspect(new Handler("GetCaptchas").request()).substr(0,1999) + "\n```");
                }
                    break;
            }
        }
    }
}
