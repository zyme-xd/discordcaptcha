exports.blockedID = function(file, message) {
    if (file.blockedIDs[message.author.id]) {
        if (file.blockedIDs[message.author.id].blocked == "true") {
            message.member.kick();
            console.log(message.member + " was kicked.");
        }
    }
}
exports.alreadyVerified = function(message){
    message.author.send({
        embed: {
            color: 0xff0000,
            description: "Already verified on `" + message.guild.name + "`"
        }
    });
}
exports.createCaptcha = function(webshot, message, colors, captcha){
    var floor = Math.floor(Math.random() * 10000) + 1;
    var fontFace, fontSize, fontPosition;
    if (floor < 5000) {
        fontFace = "Comic Sans MS";
    } else if (floor >= 5000) {
        fontFace = "Arial";
    }
    var floorx = Math.floor(Math.random() * 10000) + 1;
    fontSize = Math.floor(Math.random() * 20) + 35;
    var height = Math.floor(Math.random() * 20) + 10 + "%";
    var width = Math.floor(Math.random() * 20) + 10 + "%";
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
    if (Math.random() > Math.random()) {
        var rbackup = rotate;
        rotate -= rbackup;
        rotate -= rbackup;
    }
    if (bgColor === fontColor) {
        fontColor = colors[Math.floor(Math.random() * 4) + 1];
    }
    webshot('<html><body style=\'background-image: url("http://b.reich.io/jjvoab.png");\'><h1 style="font-family:' + fontFace + '; color:' + fontColor + '; font-size:' + fontSize + 'px; position: absolute; top:' + height + ';left:' + width + '; -moz-transform: rotate(' + rotate + 'deg); -ms-transform: rotate(' + rotate + 'deg);-o-transform: rotate(' + rotate + 'deg);-webkit-transform: rotate(' + rotate + 'deg);letter-spacing: ' + letterSpacing + 'px;"><i><del>' + captcha + '</del></i></h1></body></html>', './captchas/' + floor + '.png', {
        siteType: 'html',
        screenSize: {
            width: 500,
            height: 500
        }
    }, function (err) {
        message.author.send("", {
            files: ['./captchas/' + floor + ".png"]
        })
    });
}
exports.checkVerify = function(message, client, queue, prefix){
    var input = message.content.substr(8);
    for (i = 0; i < queue.length; i++) {
        var cpoint = queue[i].indexOf("x");
    }
    cpoint++;
    for (i = 0; i < queue.length; i++) {
        var oldcaptcha = queue[i].substr(cpoint);
    }
    if (input === oldcaptcha) {
        if (message.member.roles.has(userRoleID)) {
            message.author.send({
                embed: {
                    color: 0xff0000,
                    description: "Already verified on `" + message.guild.name + "`"
                }
            });
        } else {
            message.author.send({
                embed: {
                    color: 0x00ff00,
                    description: "Successfully verified on `" + message.guild.name + "`"
                }
            });
            client.channels.find('name', normalChat).send("<@" + message.author.id + "> was successfully verified.");
            queryFile.query[message.author.id + "x" + oldcaptcha].verified = "true";
            queue.pop();
            fs.appendFileSync("./verify_logs.txt", "[VerifyBot] " + time.getHours() + ":" + time.getMinutes() + ":" + time.getSeconds() + "| " + message.author.tag + "(" + message.author.id + ") verified himself.\n");
            message.member.addRole(userRoleID).catch(error => console.log(error));
        }

    } else {
        if (message.content.toLowerCase() != prefix + "verify") {
            message.author.send("You were kicked from " + message.guild.name + " (WRONG_CAPTCHA)");
            message.delete();
            message.member.kick();
        }
    }
}