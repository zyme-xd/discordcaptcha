module.exports.all = function(fs){
    try { return fs.writeFileSync("./src/Query.json", JSON.stringify({"query":{}})); } catch(e) { return e; }
}
