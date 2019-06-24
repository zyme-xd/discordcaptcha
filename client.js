const Discord = require("discord.js");
const sqlite = require("sqlite");
const fs = require("fs");
const client = new Discord.Client({ disableEveryone: true });
const config = require("./config.json");

// Init events
fs.readdir("./events/", (err, data) => {
    if (err) return console.error("Could not read `./events/` directory: " + err);

    for(const filename of data) {
        const event = require(`./events/${filename}`);
        client.on(filename.substr(0, filename.indexOf(".js")), event.run.bind(client));
    }
});


client.login(config.token);