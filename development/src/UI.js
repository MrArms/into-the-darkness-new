
goog.provide( "tt.UI" );

//===================================================
// Constructor
//===================================================

// _args is an array of arguments
UI = function(_display)
{
	this._display = _display;

	this._init();
}

var p = UI.prototype;

//===================================================
// Variables
//===================================================

p.X_START = 60;
p.Y_START = 10;

//===================================================
// Public Methods
//===================================================

p.update = function(_player)
{
	//this._display.drawText(this.X_START, this.Y_START, Globals.TEXT_COLOUR_WHITE + "Attack Bonus " + _player.getCurrentAttackBonus() );
	this._display.drawText(this.X_START, this.Y_START, "Attack Bonus " + _player.getCurrentAttackBonus() );
}

//===================================================
// Private Methods
//===================================================

p._init = function()
{	

}

//===================================================
// Events
//===================================================

