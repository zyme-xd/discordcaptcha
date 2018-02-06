const fs = require("fs");

/**
 * @returns {object} files - An array with filenames
 */
module.exports = () => {
    try { return fs.readdirSync("./captchas") } catch(e){ return e; }
}
