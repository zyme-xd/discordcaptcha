# discordcaptcha
Captcha Verification Bot based on Discord.js



This bot is based on the discord library discord.js, that means you need to install node.js and install the git repository discord.js.

Node Download: https://nodejs.org/en/download/package-manager/

Discord.js Download Command: npm install --save discord.js


Additional Commands

!block <USERID> -> User will get kicked after writing something. 

!pop -> Removes the last blocked ID.

!clear <int 1-100> -> Deletes x messages



Make sure you've created a channel called verify

Disable Read Messages on the role @everyone and activate it for the created user role.


Ignore line 8,9,11,12,13.

At line 10 you can edit the prefix, if there is an other bot with the same prefix. Notice that the prefix shouldn't be longer than 1 Char.

At line 14 you can see an array, if you never heard of it, read this: https://www.w3schools.com/js/js_arrays.asp.

At line 6 you can see a variable called token. Enter the super secret token in the double quotes!

At line 7 you can see a variable called clientID. Enter the Client ID from the bot. You can get from the discord developer page.

You can add as much blocked accounts as you want.

At line 28 you can see a variable called userRoleID. Please create a new role (name doesnt matter) and get the role ID.

If you dont know how to get the ID, read this: https://www.reddit.com/r/discordapp/comments/5bezg2/role_id/.

Enter the role id in the double quotes and the bot should work.

This bot will be updated every 2nd week.

!! Make sure that the bot role is the first in the list, otherwise the bot doesn't have enough permissions to give the user a role. Example: http://i.imgur.com/HxcFys2.png !!
