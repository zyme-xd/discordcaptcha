#include <iostream>
#include <string>
#include <map>
#include <vector>
#include <fstream>
#include "cfg.h"

const std::string cfg_input::version = "3.0.1";
std::vector<std::string> commands {
	"blockUser",
	"removeBlockFromUser",
	"banGuildMember",
	"clear",
	"version",
	"queries",
	"querydelete",
	"purgelogs",
	"logs",
	"captchas",
	"makerole",
	"unverify"
};

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

std::vector<std::string> cfg_dcmd_dec::cmdnames = commands;

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
	return new_contrib;
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
                std::cout << translations::en["C_BOT_TOKEN"];
				std::cin.ignore();
                getline(std::cin, cfg_input::token);
				
                std::cout << translations::en["C_CLIENT_ID"];
                std::cin >> cfg_input::clientid;

                std::cout << translations::en["C_PREFIX"];
                std::cin >> cfg_input::prefix;

                std::cout << translations::en["C_LOGCHAT"];
                std::cin >> cfg_input::logChannel;

                std::cout << translations::en["C_VERIFIEDROLE"];
                std::cin >> cfg_input::verifiedRole;

                std::string strname, strurl;
                std::cout << translations::en["C_STREAMNAME"];
                std::cin.ignore();
                getline(std::cin, strname);

                std::cout << translations::en["C_STREAMURL"];
                std::cin >> strurl;

				stream->setGameName(strname);
				stream->setStreamURL(strurl);
				
				std::string* evalALWDs = new std::string;
                std::cout << translations::en["C_EVALALWD"];
                std::cin >> *evalALWDs;
                cfg_input::eval = *evalALWDs == "y";
                delete evalALWDs;

                std::cout << translations::en["C_OWNER"];
                std::cin >> cfg_input::owner;

                std::cout << translations::en["C_OWNERTAG"];
                std::cin.ignore();
                getline(std::cin, cfg_input::ownerTag);

				std::string* logging = new std::string;
                std::cout << translations::en["C_LOGTODB"];
                std::cin >> *logging;
                cfg_input::logToDB = *logging == "y";
                delete logging;

				std::string* ctype = new std::string;
                std::cout << translations::en["C_CAPTCHATYPE"];
                std::cin >> *ctype;
                cfg_input::ctype = (*ctype == "IMAGES") ? cfg_util::captchaType::IMAGE : cfg_util::captchaType::TEXT;
                delete ctype;
                
                file << "{" << std::endl
                << "\t\"token\": \"" << cfg_input::token << "\"," << std::endl
                << "\t\"clientid\": \"" << cfg_input::clientid << "\"," << std::endl
				<< "\t\"prefix\": \"" << cfg_input::prefix << "\"," << std::endl
				<< "\t\"version\": \"" << cfg_input::version << "\"," << std::endl
				<< "\t\"chat\": \"" << cfg_input::logChannel << "\"," << std::endl
				<< "\t\"userrole\": \"" << cfg_input::verifiedRole << "\"," << std::endl
				<< "\t\"streamingGame\": \"" << stream->getGameName() << "\"," << std::endl
				<< "\t\"streamingLink\": \"" << stream->getStreamURL() << "\"," << std::endl
				<< "\t\"evalAllowed\": \"" << cfg_input::eval << "\"," << std::endl
				<< "\t\"captchaType\": \"" << (cfg_input::ctype == cfg_util::captchaType::IMAGE ? "image" : "text") << "\"," << std::endl
				<< "\t\"commands\": {" << std::endl;
					
				std::cout << "------------------------------" << std::endl
				<< "Commands" << std::endl
				<< "------------------------------" << std::endl;
				int index = 0;
                for(std::string& cmd : cfg_dcmd_dec::cmdnames)
                {
                	std::string* input = new std::string{""};
                	std::cout << "Command '" << cmd << "' | Alias (leave blank if it should stay): ";
                	std::cin >> *input;
                	cfg_dcmd_dec::execnames.push_back(*input == "" ? cmd : *input);
                	std::cout << "Command '" << cmd << "' | Automatically allow you to use this command? (Answer with y or n): ";
                	std::cin.ignore();
					getline(std::cin, *input);
                	if (*input == "y") cfg_dcmd_dec::allowSelf.push_back(true);
                	std::cout << "Command '" << cmd << "' | Enable this command? (Answer with y or n): ";
                	std::cin >> *input;
                	cfg_dcmd_dec::cmdstatuses.push_back(*input == "y");
                	file << "\t\t\"" << commands.at(index) << "\": {" << std::endl
                	<< "\t\t\t\"command\": \"" << cfg_dcmd_dec::execnames.at(index) << "\"," << std::endl
                	<< "\t\t\t\"contributors\": [ \"" << (cfg_dcmd_dec::allowSelf.at(index) ? cfg_input::ownerTag : "") << "\" ]" << std::endl;
                	
                	delete input;
                	index++;
				}
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
