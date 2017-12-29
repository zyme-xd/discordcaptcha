/**
 * @param {module} fs - The npm module fs
 * @returns {object} query - Query entries as object.
 */
module.exports = function(fs){
    return JSON.parse(fs.readFileSync("./src/Query.json", "utf8"))['query'];
}