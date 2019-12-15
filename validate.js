// This file validates the config file and checks for logical errors
// It is called by client.js when the process is started

const ERROR_CODES = {
    FILE_NOT_FOUND: "File was not found",
    INVALID_KEY: "Invalid key provided ($)"
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

module.exports = () => {
    let config;
    try {
        config = require("./config");
    } catch(e) {
        throw new Error(ERROR_CODES.FILE_NOT_FOUND);
    }
    for(const [key, val] in Object.entries(requiredKeys)) {
        if (config[key] === undefined || typeof config[key] !== val) {
            throw new Error(
                ERROR_CODES.INVALID_KEY.replace("$", key)
            );
        }
    }

    return config;
};

module.exports.ERROR_CODES = ERROR_CODES;