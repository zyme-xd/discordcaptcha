const { Constants } = require("discord.js");
const { existsSync } = require("fs");
// This file validates the config file and checks for logical errors
// It is called by client.js when the process is started

const ERROR_CODES = {
    FILE_NOT_FOUND: "File was not found",
    INVALID_KEY: "Invalid key provided, check if it exists in the config file and if its type is correct ($)",
    DEFAULT_TOKEN: "Looks like you forgot to replace the token placeholder with your actual bot token",
    INVALID_PREFIX_LENGTH: "Invalid prefix, make sure it's at least 1 character",
    INVALID_PRESENCE_TYPE: "Invalid presence type, make sure it's one of these: " + Constants.ActivityTypes,
    INVALID_ID: "Invalid ID in \"$\" found",
    COMMAND_NOT_FOUND: "Command in config file not found",
    INVALID_COMMAND_ENTRY: "Invalid command entry found (check config.commands)"
};

const REGEXES = {
    TOKEN: /^[MN][A-Za-z\d]{23}\.[\w-]{6}\.[\w-]{27}$/,
    SNOWFLAKE: /^\d{17,19}$/
};

const requiredKeys = {
    token: "string",
    prefix: "string",
    deleteMessages: "boolean",
    presence: "object",
    servers: "object",
    ignoreServers: "object",
    commands: "object"
};

module.exports = async () => {
    let config;
    try {
        config = require("./config");
    } catch(e) {
        throw new Error(ERROR_CODES.FILE_NOT_FOUND);
    }
    for(const [key, val] of Object.entries(requiredKeys)) {
        if (config[key] === undefined || typeof config[key] !== val) {
            throw new Error(
                ERROR_CODES.INVALID_KEY.replace("$", key)
            );
        }
    }

    if (!REGEXES.TOKEN.test(config.token)) {
        throw new Error(ERROR_CODES.DEFAULT_TOKEN);
    }

    if (config.prefix.length < 1) {
        throw new Error(ERROR_CODES.INVALID_PREFIX_LENGTH);
    }

    if (Object.keys(config.presence).length === 0) {
        console.info("[INFO] Presence disabled");
    } else if (!config.type || !Constants.ActivityTypes.includes(config.presence.type.toUpperCase())) {
        throw new Error(ERROR_CODES.INVALID_PRESENCE_TYPE);
    }

    if (Object.keys(config.servers).length === 0) {
        console.info("[INFO] No servers specified");
    }

    if (Object.keys(config.servers).some(v => !REGEXES.SNOWFLAKE.test(v))) {
        throw new Error(
            ERROR_CODES.INVALID_ID.replace("$", "config.server.? (property key)")
        );
    }

    if (Object.values(config.servers).some(v => !REGEXES.SNOWFLAKE.test(v.verificationRole) || !REGEXES.SNOWFLAKE.test(v.verificationChannel))) {
        throw new Error(
            ERROR_CODES.INVALID_ID.replace("$", "config.server.? (property value)")
        );
    }

    if (config.ignoreServers.some(v => !REGEXES.SNOWFLAKE.test(v))) {
        throw new Error(
            ERROR_CODES.INVALID_ID.replace("$", "config.ignoreServers")
        );
    }

    if (Object.keys(config.commands).some(v => v.includes("/") || !existsSync(`./commands/${v}.js`))) {
        throw new Error(ERROR_CODES.COMMAND_NOT_FOUND);
    }

    return config;
};

module.exports.ERROR_CODES = ERROR_CODES;