const { Client } = require("discord.js");
const { readdir } = require("fs");
const validate = require("./validate");
const commands = new Map();

const client = new Client({ disableEveryone: true });

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
readdir("./events/", (err, data) => {
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
readdir("./commands/", (err, data) => {
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
}).catch(err => {
    console.error(err);
    console.log("\n[INFO] Looks like an error occurred while validating the config file.\n" +
                "If you don't know what that means, feel free to contact the developer by joining the discord server in the README.md file.");
    if (!process.argv.includes("--safeexit")) process.exit(1);
    else process.exit(0);
});