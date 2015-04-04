
goog.provide( "tt.WinningScreen" );

goog.require( "tt.Screen" );

//===================================================
// Constructor
//===================================================

WinningScreen = function()
{
	this._init();
	Screen.call(this);
}

WinningScreen.prototype = Object.create(Screen.prototype );
WinningScreen.prototype.constructor = WinningScreen;

var p = WinningScreen.prototype;

//===================================================
// Variables
//===================================================

//===================================================
// Public Methods
//===================================================

p.enter = function()
{	
	Screen.prototype.enter.call(this);
}

p.exit = function()
{	
	//this.signalEndGame.removeAll();
	//this.signalEndGame = null;

	Screen.prototype.exit.call(this);	
}

p.render = function(_display)
{	
	_display.drawText(49,4, "%c{yellow}Congratulations!");
	_display.drawText(49,6, "%c{white}You won the game!");

	_display.drawText(32,12, "%c{white}Sorry I haven't had time to make a decent end screen, so you're just going to have to imagine it. \n\nThanks for playing, if you like the game or have any ideas for improvements then please let me know on the RogueTemple forums.", 60);
	
	_display.drawText(46,25, "%c{cyan}Press [Enter] to continue");  
	
	Screen.prototype.render.call(this);
}

p.handleInput = function(inputType, inputData)
{	

}

//===================================================
// Private Methods
//===================================================

p._init = function()
{
	//this.signalEndGame = new signals.Signal();
}

//===================================================
// Events
//===================================================

p._keydownHandler = function(e)
{
	//Utils.console("this._keydownHandler");
	
	if (e.keyCode === ROT.VK_RETURN) 
	{
		Utils.console("Game over screen clicked");	
		
		this.signalEndGame.dispatch();				
	}
}