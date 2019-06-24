const fetch = require("node-fetch");
const pkg = require("../package");

module.exports = () => {
    fetch("https://raw.githubusercontent.com/y21/discordcaptcha/master/package.json")
        .then(v => v.json())
        .then(v => {
            if (pkg.version !== v.version) {
                console.log("[WARN] Latest version is not identical to local version");
            }
        });
};