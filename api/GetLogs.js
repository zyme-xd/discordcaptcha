let sql = require("sqlite");
sql.open('./src/db.sqlite');

/**
 * @returns {object} logs - Logs object
 */
module.exports = async () => {
    let logs = await sql.all('select * from logs').catch(e => console.log("An error occured: " + e));
    return logs;
}
