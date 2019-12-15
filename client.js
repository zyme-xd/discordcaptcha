const Discord = require("discord.js");
const fs = require("fs");
const validate = require("./validate");
const commands = new Map();

const client = new Discord.Client({ disableEveryone: true });

Object.defineProperties(client, {
    commands: {
        value: commands,
        enumerable: false
    },
    query: {
        value: new Map(),
        enumerable: false
    }
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

// Init commands
fs.readdir("./commands/", (err, data) => {
    if (err) return console.error("Could not read `./commands/` directory: " + err);

    for(const filename of data) {
        const command = require(`./commands/${filename}`);
        try {
            commands.set(filename.substr(0, filename.indexOf(".js")), command);
        } catch(e) {
            console.error(e.stack);
        }
    }
});

validate().then(c => {
    client.login(c.token).catch(console.error);
    Object.defineProperty(client, "config", {
        value: c,
        enumerable: false
    })
}).catch(console.error);

/*if (config.token === "Bot Token") {
    console.log("Looks like you forgot to put your token into the config.json file.");
} else client.login(config.token);*/