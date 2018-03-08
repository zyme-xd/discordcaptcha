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
void showMenu(unsigned int&);
void setup();
void getCommands(vector<command>&);

int main(){
    ::filestream.open("config.json");
    showMenu(::input);
    if(::input == 3) return 0;
    switch(::input){
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
    getline(cin, ::token);
    cout << "$ Client ID: ";
    cin >> ::clientid;
    cout << "$ Prefix: ";
    cin >> ::prefix;
    cout << "$ Main channel (will be used for verification messages): ";
    cin >> ::chat;
    cout << "$ Userrole ID (role for verified users): ";
    cin >> ::userrole;
    cout << "$ Streaming Game Name (what the bot should play): ";
    cin.ignore();
    getline(cin, ::stream.name);
    cout << "$ Streaming Link (has to be a twitch url): ";
    cin >> ::stream.url;
    cout << "$ Allow 'eval' feature? (either true or false): ";
    cin >> ::evalAllowed;
    cout << "$ ID of owner (you): ";
    cin >> ::owner;
    cout << "$ Tag of owner (you): ";
    cin.ignore();
    getline(cin, ::tag);
    cout << "$ Log verifications? (either true or false): ";
    cin >> ::logging;
    ::filestream << "{\"token\": \"" << ::token << "\", "
    << "\"clientid\": \"" << ::clientid << "\", "
    << "\"prefix\": \"" << ::prefix << "\", "
    << "\"chat\": \"" << ::chat << "\", "
    << "\"userrole\": \"" << ::userrole << "\", "
    << "\"streamingGame\": \"" << ::stream.name << "\", "
    << "\"streamingLink\": \"" << ::stream.url << "\", "
    << "\"evalAllowed\": \"" << ::evalAllowed << "\", "
    << "\"ownerid\": \"" << ::owner << "\", "
    << "\"logging\": \"" << (::logging ? "true" : "false") << "\", \"commands\": { ";
    for(size_t i = 0; i < commands.size(); i++){
        ::filestream << "\"" << commands.at(i).name << "\": { \"contributors\": [\"" << ::tag <<"\"], \"enabled\": true }";
        if((i + 1) != commands.size()) ::filestream << ",";
    }
    ::filestream << "}}";
    ::filestream.close();
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
