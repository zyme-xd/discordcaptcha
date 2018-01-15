const fs = require("fs");

/**
 * @param {object} message - The message object
 * @param {object} config - The config object
 */

module.exports = (message, config) => {
	message.member.removeRole(config.userrole).catch(e => console.log(e));
	let tempQueryFile = JSON.parse(fs.readFileSync("./src/Query.json", "utf8"));
	tempQueryFile.query[message.author.id].verified = "false";
	fs.writeFile("./src/Query.json", JSON.stringify(tempQueryFile), e => e ? console.log(e) : null);
	message.reply("unverified!");
};
