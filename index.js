const Discord = require('discord.js');
const client = new Discord.Client();
const fs = require("fs");


// Config
var token = "token here";
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
var normalChat = "main-chat"; // Channel name where everybody writes
var waitingQueue = [];

var userRoleID = "339841406409375754"; // The Role ID for the User Group


// Do not modify
client.on("guildMemberAdd", (member) => {
	member.user.send({embed: {
		color: 0xffff00,
		description: "To verify yourself as a human, write `" + prefix + "receive` in the guild to receive your captcha"
	}});
});


client.on("ready", () => {
	console.log("Logged in!")
	client.user.setGame("DiscordCaptcha", "https://www.twitch.tv/doxicalswitch");
});

client.on('message', (message) => {
var time = new Date();
var content = message.content;
var author = message.author.id;
if(message.author.id != clientID){
	if(message.content == prefix + "receive"){
		if(message.channel.name == "verify"){
			if(message.member.roles.has(userRoleID)){
				message.author.send({embed: {
					color: 0xff0000,
					description: "Already verified on `" + message.guild.name + "`"
				}});
			}else{
				var captcha = Math.random().toString(36).substr(20);
				var floor = Math.floor(Math.random() * 10000) + 1;
				let webshot = require("webshot"); 
				var fontFace, fontSize, fontPosition;
				if(floor < 5000){
					fontFace = "Comic Sans MS";
				}else if(floor >= 5000){
					fontFace = "Arial";
				}
				var colors = [
					"red",
					"green",
					"blue"
				]
				var floorx = Math.floor(Math.random() * 10000) + 1;
				fontSize = Math.floor(Math.random() * 35) + 21;
				var height = Math.floor(Math.random() * 30) + 10 + "%";
				var width = Math.floor(Math.random() * 30) + 10 + "%";
				var fontColor = colors[Math.floor(Math.random() * 4) + 1];
				var bgColor = colors[Math.floor(Math.random() * 4) + 1];
				var rotate = Math.floor(Math.random() * 70) + 11;
				var letterSpacing = Math.floor(Math.random() * 30) + 10;
				var boxWidth = Math.floor(Math.random() * 30) + 30;
				var boxHeight = Math.floor(Math.random() * 30) + 30;
				var boxColor = colors[Math.floor(Math.random() * 4) + 1];
				var boxBorderSize = Math.floor(Math.random() * 7) + 1 + "px";
				var boxMarginTop = Math.floor(Math.random() * 70) + 10 + "%";
				var boxMarginLeft = Math.floor(Math.random() * 70) + 10 + "%";
				if(Math.random() > Math.random()){
					var rbackup = rotate;
					rotate -= rbackup;
					rotate -= rbackup;
				}
				if(bgColor == fontColor){
					fontColor = colors[Math.floor(Math.random() * 4) + 1];
				}
				webshot('<html><body style=\'background-image: url("http://b.reich.io/jjvoab.png");\'><h1 style="font-family:' + fontFace + '; color:' + fontColor + '; font-size:' + fontSize + 'px; position: absolute; top:' + height + ';left:' + width + '; -moz-transform: rotate(' + rotate + 'deg); -ms-transform: rotate(' + rotate + 'deg);-o-transform: rotate(' + rotate + 'deg);-webkit-transform: rotate(' + rotate + 'deg);letter-spacing: ' + letterSpacing + 'px;"><i><del>' + captcha + '</del></i></h1></body></html>', './captchas/' + floor + '.png', {siteType:'html',screenSize:{width:500, height:500}}, function(err) {message.author.send("",{files:['./captchas/' + floor + ".png"]}) });
				setTimeout(function(){fs.unlinkSync("./captchas/" + floor + ".png");}, 10000);
				message.author.send({embed: {
					color: 0x0000ff,
					description: "Write `!verify` <code> in the guild to write in all channel. \n\n**Verification Bot made by y21#0909**"
				}});
				message.delete();
				var author = message.author.id;
				queue.push(author + "x" + captcha);
				waitingQueue.push(message.author.id);
				console.log(queue);
			}
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
				client.channels.find('name', 'main-chat').send("<@" + message.author.id + "> was successfully verified.");
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
	if(message.content.startsWith(prefix + "clear") && message.content.indexOf("captcha") == "-1"){
		if(message.member.hasPermission('ADMINISTRATOR')){
			message.channel.bulkDelete(message.content.substr(7));
		}else{
			return message.channel.send("Missing Permissions");
		}
	}
	if(message.channel.name == "verify"){
		message.delete();
	}
	if(message.content == prefix + "dumpWaitingQueue"){
		if(message.member.hasPermission('ADMINISTRATOR')){
			message.author.send({embed: {
				color: 0x00ff00,
				description: "**Waiting Queue Dump**\n\n" + waitingQueue
			}});
			message.delete();
		}else{
			return message.channel.send("Missing Permissions");
		}
	}
	/* if(message.content == prefix + "dmClear" && !message.guild){
			message.channel.bulkDelete(100);
	} */ // not working
}else{
	message.author.send(":x: I only react in guilds!");
}
});
client.login(token);
