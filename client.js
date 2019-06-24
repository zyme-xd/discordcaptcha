const Discord = require("discord.js");
const sqlite = require("sqlite");
const fs = require("fs");
const config = require("./config.json");

const client = new Discord.Client({ disableEveryone: true });

Object.defineProperty(client, 'db', {
    value: sqlite
});

// Init events
fs.readdir("./events/", (err, data) => {
    if (err) return console.error("Could not read `./events/` directory: " + err);

    for(const filename of data) {
        const event = require(`./events/${filename}`);
        try {
            client.on(filename.substr(0, filename.indexOf(".js")), event.run.bind(client));
        } catch(e) {
            console.error(e.stack);
        }
    }
});


client.login(config.token);