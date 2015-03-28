
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
Globals.GAME_EVENT_ANIM_LENGTH = 0.05; //0.35;
Globals.DELAY_BETWEEN_ACTIONS = 0.1; //0.25;

Globals.MAP_START_COL = 5;
Globals.MAP_START_ROW = 5;

Globals.MAP_WINDOW_WIDTH = 80;
Globals.MAP_WINDOW_HEIGHT = 36;

Globals.SCREEN_WIDTH = 120;
Globals.SCREEN_HEIGHT = 40;

Globals.FONT_SIZE = 18;

Globals.COLOUR_WHITE = "#FFF"
Globals.COLOUR_CYAN = "#1FF"

//===================================================
// Variables
//===================================================

//===================================================
// Public Methods
//===================================================

//===================================================
// Private Methods
//===================================================
