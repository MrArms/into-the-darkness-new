
goog.provide( "tt.GameOverScreen" );

goog.require( "tt.Screen" );

//===================================================
// Constructor
//===================================================

GameOverScreen = function()
{
	this._init();
	Screen.call(this);
}

GameOverScreen.prototype = Object.create(Screen.prototype );
GameOverScreen.prototype.constructor = GameOverScreen;

var p = GameOverScreen.prototype;

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
	this.signalEndGame.removeAll();
	this.signalEndGame = null;		

	Screen.prototype.exit.call(this);	
}

p.render = function(_display)
{	
	_display.drawText(54,4, "%c{yellow}Game Over!");
	_display.drawText(51,6, "%c{white}Bad luck old bean!");

	_display.drawText(37,12, "%c{white}Have another bash at it there's a good chap.", 60);
	
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
	this.signalEndGame = new signals.Signal();
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
		
		this._callbackFunction(ScreenManager.RETURN_TO_MENU, []);			
	}
}