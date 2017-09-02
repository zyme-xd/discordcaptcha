const Discord = require('discord.js');
const client = new Discord.Client();
const fs = require("fs");


// Config
var token = "MzQwODc1MDM4NzEyNjU5OTc5.DIwEMg.-Zw7hTffFjZLL23HDlQiS080Gd0";
var clientID = "340875038712659979";
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
];
var userRoleID = "339841406409375754"; // The Role ID for the User Group




// Do not modify
client.on("guildMemberAdd", (g, m) => {

	m.send({embed: {
		color: 0xffff00,
		description: "Welcome on `" + g.name + "`\nPlease send `!receive` in the verify channel to receive your code."
	}});
});


client.on('message', (message) => {
var time = new Date();
var content = message.content;
var author = message.author.id;
if(message.author.id != clientID){
	if(message.content == prefix + "receive"){
		if(message.channel.name == "verify"){
			var captcha = String(Math.random()).charAt(4) + String(Math.random()).charAt(4)+ String(Math.random()).charAt(4)+ String(Math.random()).charAt(4)+ String(Math.random()).charAt(4)+ String(Math.random()).charAt(4);
			var floor = Math.floor(Math.random() * 10000) + 1;
            let webshot = require("webshot"); 
			webshot('<html><body><span style="color:#ff0000; font-size: 24px;">' + captcha + '</span></body></html>', './captchas/' + floor + '.png', {siteType:'html',screenSize:{width:100, height:100}}, function(err) {message.author.send("",{files:['./captchas/' + floor + ".png"]}) });
			
			message.author.send({embed: {
				color: 0x0000ff,
				description: "Write `!verify` <code> in the guild to write in all channel. \n\n**Verification Bot made by y21#0909**"
			}});
			message.delete();
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
            if(message.member.roles.has(userRoleID)){
				message.author.send({embed: {
					color: 0xff0000,
					description: "Already verified on `" + message.guild.name + "`"
				}});
			}else{
				message.author.send({embed: {
					color: 0x00ff00,
					description: "Successfully verified on `" + message.guild.name + "`"
				}});
				queue.pop();
				fs.appendFileSync("./verify_logs.txt", "[VerifyBot] " + time.getHours() + ":" + time.getMinutes() + ":" + time.getSeconds() + "| " + message.author.tag + "(" + message.author.id + ") verified himself.");
				message.member.addRole(userRoleID).catch(error => console.log(error));
			}
			
        }else{
            message.author.send("You were kicked from " + message.guild.name + " (WRONG_CAPTCHA)");
            message.delete();
            message.member.kick();
		}
	}
}
if(message.guild){
	if(message.content.startsWith(prefix + "ban") && message.author.id == "312715611413413889"){
		message.guild.member(message.mentions.users.first()).kick();
	}
	for(i=0;i<blockedAccountIDs.length;i++){
		if(message.author.id == blockedAccountIDs[i]){
			message.delete();
				message.author.send("You were kicked from " + message.guild.name + " (BLOCKED)");
				message.member.kick();
		}
	}
	if(message.content.startsWith(prefix + "block")){
		if(message.member.hasPermission('ADMINISTRATOR')){
			blockedAccountIDs.push(message.content.substr(7));
			message.channel.send("Added `" + message.content.substr(7) + "` to the blocked list.");
		}else{
			return message.channel.send("Missing Permissions");
		}
	}
	if(message.content.startsWith(prefix + "pop")){
		if(message.member.hasPermission('ADMINISTRATOR')){
			blockedAccountIDs.pop();
			message.channel.send("Removed last blocked user.");
		}else{
			return message.channel.send("Missing Permissions");
		}
	}
	if(message.content.startsWith(prefix + "clear")){
		if(message.member.hasPermission('ADMINISTRATOR')){
			message.channel.bulkDelete(message.content.substr(7));
		}else{
			return message.channel.send("Missing Permissions");
		}
	}
	if(message.content.toLowerCase().includes("bypass")){
		message.member.kick();
	}
	if(message.channel.name == "verify"){
		message.delete();
	}
}else{
	message.author.send("Please execute that command in a guild");
}
});
client.login(token);
