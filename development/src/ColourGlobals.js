
goog.provide( "tt.ColourGlobals" );

goog.require( "tt.Colour" );

//===================================================
// Constructor
//===================================================

// _args is an array of arguments
ColourGlobals = function()
{
	//this._init();
}

var p = ColourGlobals.prototype;

//===================================================
// Constants
//===================================================

ColourGlobals.COLOUR_WHITE = "white";
ColourGlobals.COLOUR_CYAN = "cyan";

ColourGlobals.COLOUR_RED = "red";
ColourGlobals.COLOUR_BLACK = "black";
ColourGlobals.COLOUR_GREEN_HEAL = "green_heal";
ColourGlobals.COLOUR_GREEN_POISON = "green_poison";

ColourGlobals.colours = {};

ColourGlobals.colours[ColourGlobals.COLOUR_WHITE] = new Colour(ColourGlobals.COLOUR_WHITE, "#FFFFFF");
ColourGlobals.colours[ColourGlobals.COLOUR_CYAN] = new Colour(ColourGlobals.COLOUR_CYAN, "#11FFFF");

ColourGlobals.colours[ColourGlobals.COLOUR_RED] = new Colour(ColourGlobals.COLOUR_RED, "#FF0000");
ColourGlobals.colours[ColourGlobals.COLOUR_BLACK] = new Colour(ColourGlobals.COLOUR_BLACK, "#000000");

ColourGlobals.colours[ColourGlobals.COLOUR_GREEN_HEAL] = new Colour(ColourGlobals.COLOUR_GREEN_HEAL, "#88FF88");
ColourGlobals.colours[ColourGlobals.COLOUR_GREEN_POISON] = new Colour(ColourGlobals.COLOUR_GREEN_POISON, "#00BB00");

//===================================================
// Variables
//===================================================

//===================================================
// Public Methods
//===================================================

// Just a helper function that makes getting colours less typing
ColourGlobals.getColour = function(_colour, _index)
{
	return ColourGlobals.colours[_colour].getColour(_index);
}


//===================================================
// Private Methods
//===================================================
