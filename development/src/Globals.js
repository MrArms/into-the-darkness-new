
goog.provide( "tt.Globals" );

//===================================================
// Constructor
//===================================================

// _args is an array of arguments
Globals = function()
{
	//this._init();
}

var p = Globals.prototype;

//===================================================
// Constants
//===================================================

// Slight delay before letting the next character move - this is really only for debug purposes as it is too annoying otherwise 
Globals.END_TURN_DELAY = 0.0; //1.0;
Globals.GAME_EVENT_ANIM_LENGTH = 0.2; //0.05; //0.35;
Globals.DELAY_BETWEEN_ACTIONS = 0.2; //0.1; //0.25;
Globals.DELAY_AFTER_PLAYER_DEATH = 0.8; //0.25;
Globals.DELAY_BEFORE_AI_MOVE = 0.2; //0.25;
Globals.DELAY_BEFORE_COUNTER_ATTACK = 0.2; //0.2; //0.25;

Globals.MAP_START_COL = 5;
Globals.MAP_START_ROW = 5;

Globals.MAP_WINDOW_WIDTH = 40; //50;
Globals.MAP_WINDOW_HEIGHT = 36;

Globals.SCREEN_WIDTH = 105; //120;
Globals.SCREEN_HEIGHT = 50;

Globals.FONT_SIZE = 16; //16; //18;

Globals.FPS = 60;

/*Globals.COLOUR_WHITE = "#FFF"
Globals.COLOUR_CYAN = "#1FF"*/

// Globals.TEXT_COLOUR_WHITE =   "%c{" + Globals.COLOUR_WHITE + "}";

// This could be a variable eventually and called when loading in different files from the main menu (if we want that functionality)
Globals.SAVE_GAME_NAME = "SAVE1";

//===================================================
// Variables
//===================================================

//===================================================
// Public Methods
//===================================================

//===================================================
// Private Methods
//===================================================
