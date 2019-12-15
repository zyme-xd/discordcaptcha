// This file validates the config file and checks for logical errors
// It is called by client.js when the process is started

const ERROR_CODES = {
    FILE_NOT_FOUND: "File was not found",
    INVALID_KEY: "Invalid key provided, check if it exists in the config file and if its type is correct ($)",
    DEFAULT_TOKEN: "Looks like you forgot to replace the token placeholder with your actual bot token"
}

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

    if (config.token === "Bot Token") {
        throw new Error(DEFAULT_TOKEN);
    }

    return config;
};

module.exports.ERROR_CODES = ERROR_CODES;