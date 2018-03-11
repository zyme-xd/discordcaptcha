#include <iostream>
#include <string>
#include <fstream>
#include <vector>

using namespace std;

struct dstream {
    string name;
    string url;
};
struct command {
    string name;
};

namespace stp {
	ofstream filestream;
	unsigned int input;
	string token,
    clientid,
    prefix,
    chat,
    userrole,
    evalAllowed,
    owner,
    tag;
bool logging;
dstream stream;
};


void showMenu(unsigned int&);
void setup();
void getCommands(vector<command>&);

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
    cout << "###############################" << endl
         << "###   Discordcaptcha Setup  ###" << endl
         << "###############################" << endl
         << "###       What to do?       ###" << endl
         << "### - 1 -  Setup            ###" << endl
         << "### - 2 -  Exit program     ###" << endl
         << "###############################" << endl << "$ ";
    cin >> menu;
}

void setup(){
    vector<command> commands;
    getCommands(commands);
    cout << "$ Bot token: ";
    cin.ignore();
    getline(cin, stp::token);
    cout << "$ Client ID: ";
    cin >> stp::clientid;
    cout << "$ Prefix: ";
    cin >> stp::prefix;
    cout << "$ Main channel (will be used for verification messages): ";
    cin >> stp::chat;
    cout << "$ Userrole ID (role for verified users): ";
    cin >> stp::userrole;
    cout << "$ Streaming Game Name (what the bot should play): ";
    cin.ignore();
    getline(cin, stp::stream.name);
    cout << "$ Streaming Link (has to be a twitch url): ";
    cin >> stp::stream.url;
    cout << "$ Allow 'eval' feature? (either true or false): ";
    cin >> stp::evalAllowed;
    cout << "$ ID of owner (you): ";
    cin >> stp::owner;
    cout << "$ Tag of owner (you): ";
    cin.ignore();
    getline(cin, stp::tag);
    cout << "$ Log verifications? (either true or false): ";
    cin >> stp::logging;
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

void getCommands(vector<command> &commands){
    ifstream commandfile;
    commandfile.open("Commands.txt");
    if(commandfile.good()) {
        string temp;
        while(getline(commandfile, temp)){
            commands.push_back({ temp });
        }
    }
}
