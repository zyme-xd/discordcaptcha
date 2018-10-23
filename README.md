￼

A Captcha verification bot based on Discord.js.

￼

You can find a detailed tutorial here .
Feel free to join our discord server for support.

Setup procedure

DiscordCaptcha requires NodeJS 8.0+. Install it here .
To install all required NPM-Modules, run the install script in ~/setup/ (or npm install in bots' directory ) (Click here for a detailed installation tutorial on how to install Node.JS)

For now, make sure the bot is only in one server. The config file is located in ~/src/ . Get your Token from here .

Config-file generator

Newer versions of DiscordCaptcha have a config-file generator. It is written in C++ and needs to be compiled if you want to run it. If you don't have a compiler, I recommend the g++ compiler. The file is located in ~/cfg_gen/ .
Make sure to compile cfg.cc and set the std option to atleast c++14 .
Example compilation (ignore $; supposed to represent bash)


$ cd cfg_gen
$ g++ cfg.cc -o cfg -std=c++14
$ ./cfg



Additional commands

Command names can be changed in the config file.



/**
* Snowflake: ID
**/
!blockUser <Snowflake> // Blocks a User ID. If the User sends a message to the guild, he'll get kicked.
!removeBlock <Snowflake> // Removes a User ID from the blacklist. User can write again without getting kicked.
!clear <Amount of messages> // Clears an amount of messages, up to 100
!version // The current version and the latest version
!create-role // Creates the verification role



Changing captcha type

DiscordCaptcha offers you two captcha types: first, images as captchas and second, normal text messages. It's up on you whether you want images or text. Notice, that images are way harder to bypass than normal text messages.
The default type is image . To edit the type, you change the value of key captchaType in ~/src/config.json to either image or text .

API related commands

The command is - as mentioned above - changable. These are the default command names. Also commands can be turned off by changing enabled to false .



!queries // Current query
!querydelete // Deletes the query (should be executed every 2 or 3 weeks)
!purgelogs // Purges the logs
!logs // Get logs
!makerole // Creates a 'verified' role
!unverify // Lets the user unverify



Note: If you want to use these commands, you have to put your tag into the contributors array.
￼

Dealing with SQL(ite)

Blocked users, logs and queries are stored in a database which is located in ~/src/db.sqlite . If you want to read data from it, I recommend SQLite DB Browser ( Nightly ). After the installation, you're able to open the database by clicking 'open database' in the program.

Using the minified file

Note: Minified file might be behind the main index file. If that's the case, simply minify it yourself by using an online JS minifier.

In case you don't want to edit the main code, you can delete the index.js file locally and rename index.min.js to index.js . An other option is to change the value of main key of the package.json file from index.js to index.min.js . What this does is letting you to type node . in the command prompt instead of node <path> 

Tips

• Look at the wiki for some fixes.
• Contact me via Discord. (y21#0909 | ID: 312715611413413889)
• Open a Pull Request/Issue