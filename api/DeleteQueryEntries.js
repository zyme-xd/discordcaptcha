let sql = require("sqlite");
sql.open('./src/db.sqlite');

/*
 * @param {module} fs - The npm module fs
*/
module.exports = async function() {
    sql.run('delete from queries').catch(e => console.log("[DeleteQueryEntries] An error occured: " + e));
}
