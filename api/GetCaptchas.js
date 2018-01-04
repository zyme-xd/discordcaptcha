/**
 * @param {module} fs - The module fs
 * @returns {object} files - An array with filenames
 */
module.exports = fs => {
    try { return fs.readdirSync("./captchas") } catch(e){ return e; }
}
