
goog.provide( "tt.MenuScreen" );

goog.require( 'tt.Screen' );


//===================================================
// Constructor
//===================================================

MenuScreen = function(_display, _saveGameAvailable)
{
	this._saveGameAvailable = _saveGameAvailable;

	this._init(_display); 
	Screen.call(this);
}

MenuScreen.prototype = Object.create(Screen.prototype );
MenuScreen.prototype.constructor = MenuScreen;

var p = MenuScreen.prototype;


//===================================================
// Variables
//===================================================

p._display = null;

p._saveGameAvailable = null;

//===================================================
// Public Methods
//===================================================

p.enter = function()
{	
	Utils.console("Entered menu screen");
			
	Screen.prototype.enter.call(this);	
}

p.exit = function()
{	
	Utils.console("Exited menu screen");	
		
	Screen.prototype.exit.call(this);	
}

p.render = function() 
{	
	this._drawScreen();
	
	Screen.prototype.render.call(this);
}

p._drawScreen = function()
{
	this._display.clear();
		
	this._display.drawText(49,4, "%c{yellow}Into the Darkness");
	this._display.drawText(41,6, "%c{white}Where your nightmares will come true");
	this._display.drawText(50,10, "%c{cyan}By Tim Saunders");
	//this._display.drawText(43,11, "%c{cyan}For the 2015 7DRL competition");
    	
	this._display.drawText(33,16, "%c{white}A tactical roguelike where the moves you can make are limited to the cards you currently hold in your hand", 60);
	
	this._display.drawText(46,25, "%c{cyan}Press [S] to start new game");
	
	if(this._saveGameAvailable === true)	
		this._display.drawText(44,27, "%c{cyan}Press [R] to restore old game");		
    //this._display.drawText(44,27, "%c{cyan}Press [I] for instructions");		
}


//===================================================
// Private Methods
//===================================================

p._init = function(_display)
{
	this._display = _display;
}

//===================================================
// Events
//===================================================

p.onTimerTick = function(e)
{
	this.render();
	// this._drawScreen();
}

p.keydownHandler = function(e)
{
	if (e.keyCode === ROT.VK_S) 
		this._callbackFunction(ScreenManager.START_GAME, []); 
	else
	{
		if(e.keyCode === ROT.VK_R && this._saveGameAvailable)
		{
			this._callbackFunction(ScreenManager.RESTORE_GAME, []);
		}	
	}
}

p.keypressupHandler = function(e)
{

}

p.keypressHandler = function(e)
{
	
}