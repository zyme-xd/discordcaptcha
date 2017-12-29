module.exports.all = function(fs){
    return fs.writeFileSync("./src/Query.json", JSON.stringify({"query":{}}));
}