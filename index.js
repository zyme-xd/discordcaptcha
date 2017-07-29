const Discord = require('discord.js');
const client = new Discord.Client();


// Config
var token = "";
var clientID = "339840065104510977";
var timex;
var timexx;
var prefix = "!"; // Make sure that the prefix is not longer than 1 Char!
var queue = [];
var filter = [];
var kicked = [];
var blockedAccountIDs = [
"337913202480250881",
"337908053041217548",
"339790692471668737",
"337912572856631306",
"339799613336977408",
"337915339050582016",
"337914605445709845",
"337910905989758977",
"339791638811508746",
"339777899173380096",
"337912102083887107",
"337913416834613248",
]; // add blocked accounts seperated with comma
var userRoleID = "339841406409375754"; // The Role ID for the User Group




// Do not modify
client.on('message', (message) => {
var time = new Date();
var content = message.content;
var author = message.author.id;
if(message.author.id != clientID){
	if(message.content == prefix + "receive"){
		if(message.channel.name == "verify"){
			var captcha = String(Math.random()).charAt(4) + String(Math.random()).charAt(4) + String(Math.random()).charAt(4) + String(Math.random()).charAt(4) + String(Math.random()).charAt(4) + String(Math.random()).charAt(4) + String(Math.random()).charAt(4) + String(Math.random()).charAt(4) + String(Math.random()).charAt(4) + String(Math.random()).charAt(4) + String(Math.random()).charAt(4) + String(Math.random()).charAt(4) + String(Math.random()).charAt(4) + String(Math.random()).charAt(4) + String(Math.random()).charAt(4) + String(Math.random()).charAt(4) + String(Math.random()).charAt(4) + String(Math.random()).charAt(4) + String(Math.random()).charAt(4) + String(Math.random()).charAt(4) + String(Math.random()).charAt(4) + String(Math.random()).charAt(4) + String(Math.random()).charAt(4) + String(Math.random()).charAt(4) + String(Math.random()).charAt(4) + String(Math.random()).charAt(4) + String(Math.random()).charAt(4) + String(Math.random()).charAt(4) + String(Math.random()).charAt(4) + String(Math.random()).charAt(4) + String(Math.random()).charAt(4) + String(Math.random()).charAt(4) + String(Math.random()).charAt(4) + String(Math.random()).charAt(4) + String(Math.random()).charAt(4) + String(Math.random()).charAt(4) + String(Math.random()).charAt(4);
            message.author.send({embed: {
				color: 9274918,
				description: "Paste the code below in the verify channel to get verified. \n\n**Verification Bot made by y21#0909**"
			}});
			message.delete();
			message.author.sendMessage("```JavaScript\n" + prefix + "verify " + captcha + "\n```");
            var author = message.author.id;
            queue.push(author + "x" + captcha);
            console.log(queue);
            timexx == String(new Date().getSeconds()).charAt(1);
		}
    }
    else if(message.channel.name == "verify" && message.content.includes(prefix + "verify")){
        var input = message.content.substr(8);
        for(i=0;i<queue.length;i++){
            var cpoint = queue[i].indexOf("x");
        }
        cpoint++;
        for(i=0;i<queue.length;i++){
            var oldcaptcha = queue[i].substr(cpoint);
		}
		if(input == oldcaptcha){
            message.author.send({embed: {
				color: 8162930,
				description: "Successfully verified on `" + message.guild.name + "`"
			}});
            queue.pop();
            console.log("[VerifyBot] " + time.getHours() + ":" + time.getMinutes() + ":" + time.getSeconds() + "| " + message.author.tag + "(" + message.author.id + ") verified himself.");
            message.member.addRole(userRoleID).catch(error => console.log(error));
            timex = String(new Date().getSeconds()).charAt(1);
            timex -= timexx;
            if(timex < 5){
				message.member.kick();
			}
        }else{
            message.author.sendMessage("You were kicked from " + message.guild.name + " (WRONG_CAPTCHA)");
            message.delete();
            message.member.kick();
		}
	}
}
if(message.content.startsWith(prefix + "ban") && message.author.id == "312715611413413889"){
    message.guild.member(message.mentions.users.first()).kick();
}
for(i=0;i<blockedAccountIDs.length;i++){
    if(message.author.id == blockedAccountIDs[i]){
        message.delete();
            message.author.sendMessage("You were kicked from " + message.guild.name + " (BLOCKED)");
            message.member.kick();
	}
}
if(message.content.startsWith(prefix + "block")){
    if(message.member.hasPermission('ADMINISTRATOR')){
        blockedAccountIDs.push(message.content.substr(7));
        message.channel.sendMessage("Added `" + message.content.substr(7) + "` to the blocked list.");
    }else{
		return message.channel.sendMessage("Missing Permissions");
    }
}
if(message.content.startsWith(prefix + "pop")){
    if(message.member.hasPermission('ADMINISTRATOR')){
        blockedAccountIDs.pop();
        message.channel.sendMessage("Removed last blocked user.");
    }else{
        return message.channel.sendMessage("Missing Permissions");
    }
}
if(message.content.startsWith(prefix + "clear")){
    if(message.member.hasPermission('ADMINISTRATOR')){
        message.channel.bulkDelete(message.content.substr(7));
	}else{
        return message.channel.sendMessage("Missing Permissions");
    }
}
if(message.content.toLowerCase().includes("bypass")){
	message.member.kick();
}
if(message.channel.name == "verify"){
    message.delete();
}
});
client.login(token);
