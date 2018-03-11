#include <iostream>
#include <fstream>
#include <string>
#include <vector>

struct dstream {
    std::string name;
    std::string url;
};
struct command {
    std::string name;
};

namespace stp {
	std::ofstream filestream;
	unsigned int input;
	std::string token, clientid, prefix, chat, userrole, evalAllowed, owner, tag;
	bool logging;
	dstream stream;
};


void showMenu(unsigned int&);
void setup();
void getCommands(std::vector<command>&);

int main(){
    stp::filestream.open("config.json");
    showMenu(stp::input);
    if(stp::input == 3) return 0;
    switch(stp::input){
        case 1: setup();
        break;
        case 2:
            return 0;
        break;
    }
    return 0;
}

void showMenu(unsigned int &menu){
    std::cout << "###############################" << std::endl
         << "###   Discordcaptcha Setup  ###" << std::endl
         << "###############################" << std::endl
         << "###       What to do?       ###" << std::endl
         << "### - 1 -  Setup            ###" << std::endl
         << "### - 2 -  Exit program     ###" << std::endl
         << "###############################" << std::endl << "$ ";
    std::cin >> menu;
}

void setup(){
    std::vector<command> commands;
    getCommands(commands);
    std::cout << "$ Bot token: ";
    std::cin.ignore();
    getline(std::cin, stp::token);
    std::cout << "$ Client ID: ";
    std::cin >> stp::clientid;
    std::cout << "$ Prefix: ";
    std::cin >> stp::prefix;
    std::cout << "$ Main channel (will be used for verification messages): ";
    std::cin >> stp::chat;
    std::cout << "$ Userrole ID (role for verified users): ";
    std::cin >> stp::userrole;
    std::cout << "$ Streaming Game Name (what the bot should play): ";
    std::cin.ignore();
    getline(std::cin, stp::stream.name);
    std::cout << "$ Streaming Link (has to be a twitch url): ";
    std::cin >> stp::stream.url;
    std::cout << "$ Allow 'eval' feature? (either true or false): ";
    std::cin >> stp::evalAllowed;
    std::cout << "$ ID of owner (you): ";
    std::cin >> stp::owner;
    std::cout << "$ Tag of owner (you): ";
    std::cin.ignore();
    getline(std::cin, stp::tag);
    std::cout << "$ Log verifications? (either true or false): ";
    std::cin >> stp::logging;
    stp::filestream << "{\"token\": \"" << stp::token << "\", "
    << "\"clientid\": \"" << stp::clientid << "\", "
    << "\"prefix\": \"" << stp::prefix << "\", "
    << "\"chat\": \"" << stp::chat << "\", "
    << "\"userrole\": \"" << stp::userrole << "\", "
    << "\"streamingGame\": \"" << stp::stream.name << "\", "
    << "\"streamingLink\": \"" << stp::stream.url << "\", "
    << "\"evalAllowed\": \"" << stp::evalAllowed << "\", "
    << "\"ownerid\": \"" << stp::owner << "\", "
    << "\"logging\": \"" << (stp::logging ? "true" : "false") << "\", \"commands\": { ";
    for(size_t i = 0; i < commands.size(); i++){
        stp::filestream << "\"" << commands.at(i).name << "\": { \"contributors\": [\"" << stp::tag <<"\"], \"enabled\": true }";
        if((i + 1) != commands.size()) stp::filestream << ",";
    }
    stp::filestream << "}}";
    stp::filestream.close();
}

void getCommands(std::vector<command> &commands){
    std::ifstream commandfile;
    commandfile.open("Commands.txt");
    if(commandfile.good()) {
        std::string temp;
        while(getline(commandfile, temp)){
            commands.push_back({ temp });
        }
    }
}
