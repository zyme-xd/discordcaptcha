/**
 * @param {module} fs - The fs module
 * @returns {object} logs - Logs object
 */
module.exports = fs => {
    try { return JSON.parse(fs.readFileSync("./src/logs.json", "utf8")); } catch(e){ return e; }
}
