#include <iostream>
#include <string>
#include <map>
#include <vector>
#include <fstream>
#include "cfg.h"

std::map<std::string, std::string> translations::en = {
    { "MENU_RUN_CFG", "Run config file generator" },
    { "MENU_CREDITS", "Credits" },
    { "MENU_CHANGE_LANG", "Change Language" },
    { "MENU_EXIT", "Exit program" },
    { "C_BOT_TOKEN", "Bot token (can be found on Discord's Developer page): " },
    { "C_CLIENT_ID", "Client ID: " },
    { "C_PREFIX", "Prefix (what the bot reacts to, e.g. the exclamation mark in !verify): " },
    { "C_LOGCHAT", "The channel name where verification logs should be sent to: " },
    { "C_VERIFIEDROLE", "ID of the verified role: " },
    { "C_STREAMNAME", "The streaming game name (playing status): " },
    { "C_STREAMURL", "The URL of the stream (needs to be a valid twitch.tv one): " },
    { "C_EVALALWD", "Allow JS evaluations? Answer with y or n. (ONLY enable if experienced with JavaScript): " },
    { "C_OWNER", "The ID of your Discord account: " },
    { "C_OWNERTAG", "The tag of your Discord account (e.g. User#1234): "},
    { "C_LOGTODB", "Log verifications to a dedicated database hosted locally? Answer with y or n: " },
    { "C_CAPTCHATYPE", "Use text messages or images as captchas? Text messages are way less secure than images. Answer with IMAGES or TEXT: " },
    { "C_CMDSTATUS", "Enable or disable the following command (Answer with y or n): {CMD}: " },
    { "C_AUTOADD", "Automatically allow you to execute all commands? (Answer with y or n): " }
};

std::string* cfg_util::dstream::getGameName() const
{
    return this->gameName;
}

void cfg_util::dstream::setGameName(std::string& name)
{
    this->gameName = &name;
}

std::string* cfg_util::dstream::getStreamURL() const
{
    return this->streamURL;
}

void cfg_util::dstream::setStreamURL(std::string& url)
{
    this->streamURL = &url;
}

std::string* cfg_util::dcommand::getCommandName() const
{
    return this->commandName;
}

void cfg_util::dcommand::setCommandName(std::string& name)
{
    this->commandName = &name;
}

std::string* cfg_util::dcommand::getExecutionName() const
{
    return this->execName;
}

void cfg_util::dcommand::setExecutionName(std::string& name)
{
	this->execName = &name;
}

std::vector<std::string>* cfg_util::dcommand::getContributors() const
{
	return this->contributors;
}

void cfg_util::dcommand::setContributors(std::vector<std::string>& contributors)
{
	this->contributors = &contributors;
}

std::string cfg_util::dcommand::addContributor(std::string new_contrib)
{
	(this->contributors)->push_back(new_contrib);
}

bool cfg_util::dcommand::isEnabled() const
{
	return this->enabled;
}

void cfg_util::dcommand::setStatus(bool& status)
{
	this->enabled = &status;
}

int main()
{
    translations::LANG lang = translations::LANG::EN;
    cfg_util::dstream* stream = new cfg_util::dstream;
    std::ofstream file("config.json");
    if(lang == translations::LANG::EN)
    {
        std::cout << "-------------------------------" << std::endl
        << "1.) " << translations::en["MENU_RUN_CFG"] << std::endl
        << "2.) " << translations::en["MENU_CREDITS"] << std::endl
        << "3.) " << translations::en["MENU_CHANGE_LANG"] << std::endl
        << "4.) " << translations::en["MENU_EXIT"] << std::endl
        << "-------------------------------" << std::endl
        << "> ";
    }
    int input;
    std::cin >> input;
    std::cout << std::endl;

    switch(input)
    {
        case 1:
            if(lang == translations::LANG::EN)
            {
                file.close();
                std::cout << translations::en["C_BOT_TOKEN"];
                std::cin >> cfg_input::token;

                std::cout << translations::en["C_CLIENT_ID"];
                std::cin >> cfg_input::clientid;

                std::cout << translations::en["C_PREFIX"];
                std::cin >> cfg_input::prefix;

                std::cout << translations::en["C_LOGCHAT"];
                std::cin >> cfg_input::logChannel;

                std::cout << translations::en["C_VERIFIEDROLE"];
                std::cin >> cfg_input::logChannel;

                std::string strname, strurl;
                std::cout << translations::en["C_STREAMNAME"];
                std::cin >> strname;

                std::cout << translations::en["C_STREAMURL"];
                std::cin >> strurl;

		stream->setGameName(strname);
		stream->setStreamURL(strurl);
				
		std::string* logging = new std::string;
                std::cout << translations::en["C_EVALALWD"];
                std::cin >> *logging;
                cfg_input::eval = *logging == "y";
                delete logging;

                std::cout << translations::en["C_OWNER"];
                std::cin >> cfg_input::logChannel;

                std::cout << translations::en["C_OWNERTAG"];
                std::cin >> cfg_input::logChannel;

                std::cout << translations::en["C_LOGTODB"];
                std::cin >> cfg_input::logChannel;

                std::cout << translations::en["C_CAPTCHATYPE"];
                std::cin >> cfg_input::logChannel;
                
                file.close();
            }
            break;
        case 4:
            return 0;
            break;
    }
    delete stream;
    return 0;
}
