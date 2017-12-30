/**
 * @param {module} fs  - The npm module fs
 */
module.exports = fs => {
    try { return fs.writeFileSync("./src/logs.json", JSON.stringify({})); } catch(e) { return e; }
};
