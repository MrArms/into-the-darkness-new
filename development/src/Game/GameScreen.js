
goog.provide( "tt.GameScreen" );

goog.require( "tt.Game" );

//===================================================
// Constructor
//===================================================

GameScreen = function(_display, _saveGameObject)
{
	this._init(_display, _saveGameObject);
	Screen.call(this);
}

GameScreen.prototype = Object.create(Screen.prototype );
GameScreen.prototype.constructor = GameScreen;

var p = GameScreen.prototype;

//===================================================
// Variables
//===================================================

p._display = null; 
p._game = null;
p._controlsLocked = null;
p._saveGameObject = null;

GameScreen.CONTROL_MOVEMENT = "movement";
GameScreen.CONTROL_NO_MOVE = "no_move";
GameScreen.CONTROL_DOWN_STAIRS = "down_stairs";
GameScreen.CONTROL_UP_STAIRS = "up_stairs";

GameScreen.UTIL_SAVE = "save";
GameScreen.UTIL_LOAD = "load";

p._keyMap = {};

p._keyMap[ROT.VK_NUMPAD8] = {controlType:GameScreen.CONTROL_MOVEMENT, direction:0};
p._keyMap[ROT.VK_NUMPAD9] = {controlType:GameScreen.CONTROL_MOVEMENT, direction:1};
p._keyMap[ROT.VK_NUMPAD6] = {controlType:GameScreen.CONTROL_MOVEMENT, direction:2}; 
p._keyMap[ROT.VK_NUMPAD3] = {controlType:GameScreen.CONTROL_MOVEMENT, direction:3};
p._keyMap[ROT.VK_NUMPAD2] = {controlType:GameScreen.CONTROL_MOVEMENT, direction:4}; 
p._keyMap[ROT.VK_NUMPAD1] = {controlType:GameScreen.CONTROL_MOVEMENT, direction:5};
p._keyMap[ROT.VK_NUMPAD4] = {controlType:GameScreen.CONTROL_MOVEMENT, direction:6}; 
p._keyMap[ROT.VK_NUMPAD7] = {controlType:GameScreen.CONTROL_MOVEMENT, direction:7}; 

p._keyMap[ROT.VK_NUMPAD5] = {controlType:GameScreen.CONTROL_MOVEMENT, direction:GameScreen.CONTROL_NO_MOVE}; 

p._keyMap[ROT.VK_D] = {controlType:GameScreen.CONTROL_MOVEMENT, direction:GameScreen.CONTROL_DOWN_STAIRS}; 
p._keyMap[ROT.VK_U] = {controlType:GameScreen.CONTROL_MOVEMENT, direction:GameScreen.CONTROL_UP_STAIRS}; 

// Load/Save
p._keyMap[ROT.VK_S] = {controlType:GameScreen.UTIL_SAVE}; 
p._keyMap[ROT.VK_L] = {controlType:GameScreen.UTIL_LOAD}; 

// This quits to the main menu
p._keyMap[ROT.VK_Q] = {controlType:GameScreen.UTIL_QUIT}; 
 
//===================================================
// Public Methods
//===================================================

p.enter = function()
{

}

p.exit = function()
{
	this._controlsLocked = true;

	this._game.destroy();
	this._game = null;
}

//===================================================
// Private Methods
//===================================================

// This is purely to be able to load/save in game for debug purposes
p._saveGameCheat = function()
{
	this._controlsLocked = true;
				
	this._saveGameObject = this._game.getSaveObject();
	
	this._controlsLocked = false;
}

// This is purely to be able to load/save in game for debug purposes
p._loadGameCheat = function()
{	
	this._controlsLocked = true;
		
	this._game.destroy();
	this._game = null;
	
	this._game = new Game(this._display);
	this._game.restart(this._saveGameObject);
			
	this._controlsLocked = false;
}

p._saveAndQuitGame = function()
{
	// Game is destroyed on exit so no need to do it here

	this._saveGameObject = this._game.getSaveObject();	
	
	this._callbackFunction(ScreenManager.SAVE_GAME, [this._saveGameObject]);
	this._callbackFunction(ScreenManager.QUIT_GAME, []);
}

p._init = function(_display, _saveGameObject)
{		
	this._controlsLocked = true;

	this._display = _display;
	
	// Create a game class here ready to create a new game or restart an old one
	this._game = new Game(this._display);
	
	if(_saveGameObject && _saveGameObject !== null)
	{			
		this._saveGameObject = _saveGameObject;
	
		this._game.restart(_saveGameObject);		
	}
	else
	{			
		this._game.create();	
		this._game.start();	
	}	
	
	this._controlsLocked = false;
}

p._gameOver = function()
{
	this._callbackFunction(ScreenManager.GAME_OVER, []);
}

p._gamWon = function()
{
	this._callbackFunction(ScreenManager.GAME_WON, []);
}

//===================================================
// Events
//===================================================

p.onTimerTick = function(e)
{		
	if(this._controlsLocked === true)
		return;
		
	if(this._game && this._game !== null)	
		this._game.update(e);	
}

p.keydownHandler = function(e)
{
	if(this._controlsLocked === true)
		return;
		
	// If the game doesn't exist then return	
	if(!this._game || this._game === null)
		return;

	var code = e.keyCode;	
		
	// This saves the game to the screenManager, but also saves "in game" if we want to reload in game for debug purposes
	if(this._keyMap[code].controlType === GameScreen.UTIL_SAVE)
	{
		this._saveGameCheat(); 
		
		// This is purely to be able to load/save in game for debug purposes
		this._callbackFunction(ScreenManager.SAVE_GAME, [this._game.getSaveObject()]);
	}
	// This is purely to be able to load/save in game for debug purposes
	else if(this._saveGameObject !== null && this._keyMap[code].controlType === GameScreen.UTIL_LOAD)
	{
		this._loadGameCheat();
	}		
	else if(this._keyMap[code].controlType === GameScreen.UTIL_QUIT)
	{
		this._saveAndQuitGame();
	}
	else
		this._game.keyDown(this._keyMap[code]);
}

//===================================================
// LOADING & SAVING
//===================================================

