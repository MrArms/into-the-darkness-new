
goog.provide( "tt.GameScreen" );

goog.require( "tt.Actor" );
goog.require( "tt.Action" );
goog.require( "tt.ActionGod" );
goog.require( "tt.Renderer" );
goog.require( "tt.Utils" );
goog.require( "tt.Status" );
goog.require( "tt.AI" );
goog.require( "tt.TurnManager" );
goog.require( "tt.Globals" );
goog.require( "tt.GameGlobals" );
goog.require( "tt.Level" );
goog.require( "tt.LevelMap" );
goog.require( "tt.UI" );

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

// p._inGame = null;
p._player = null;
p._doRenderMap = null;
p._levels = null;
p._currentLevelIndex = null;
p._renderer = null;
 
//===================================================
// Public Methods
//===================================================

p.enter = function()
{
	Screen.prototype.enter.call(this);
}

p.exit = function()
{
	this._controlsLocked = true;

	this.destroy();
	
	Screen.prototype.exit.call(this);	
	// this._game = null;
}

p.destroy = function()
{
	// Stops stuff from happening
	// this._inGame = false;
	this._controlsLocked = true;

	while(this._levels.length > 0)
	{
		var tempLevel = this._levels.pop();
		tempLevel.destroy();
		tempLevel = null;
	}

	this._levels = null;
		 	
	this._player = null;	
	
	this._renderer = null;
	this._UI = null;
}

//===================================================
// Private Methods
//===================================================

p._create = function()
{
	// Initialise the player
	this._player = new Actor();
	this._player.create("@");
	
	// Create first level
	this._currentLevelIndex = 1;
		
	// Create the first level
	var newLevel = new Level(this, this._playerLeavesLevel, this._playerDies);
	newLevel.create(1);	
	this._levels.push(newLevel);	
}

// Start after a newly created level has been made
p._start = function()
{
	this._getCurrentLevel().joinLevel(this._player, true);
	this._getCurrentLevel().startLevel();	
}

// Restart from a saved game after initialisation
p._restart = function(_saveGameObject)
{
	this.restoreFromSaveObject(_saveGameObject);
				
	this._getCurrentLevel().startLevel();
}


// This is purely to be able to load/save in game for debug purposes
p._saveGameCheat = function()
{
	this._controlsLocked = true;
				
	this._saveGameObject = this._getSaveObject();
	
	this._controlsLocked = false;
}

// This is purely to be able to load/save in game for debug purposes
p._loadGameCheat = function()
{	
	this._controlsLocked = true;
		
	if(this._saveGameObject && this._saveGameObject !== null)			
	{
		this.destroy();
		this._init(this._display, this._saveGameObject);
	}
	else
		this._controlsLocked = false;				
}

p._saveAndQuitGame = function()
{
	// Game is destroyed on exit so no need to do it here

	this._controlsLocked = true;
	
	this._saveGameObject = this._getSaveObject();	
			
	this._callbackFunction(ScreenManager.SAVE_GAME, [this._saveGameObject]);
	this._callbackFunction(ScreenManager.QUIT_GAME, []);
}

p._init = function(_display, _saveGameObject)
{		
	if(_display && _display !== null)
		this._display = _display;

	this._controlsLocked = true;
	
	this._doRenderMap = false;
	
	this._levels = [];
			
	this._UI = new UI(this._display);
	this._renderer = new Renderer(this._display);
		
	if(_saveGameObject && _saveGameObject !== null)
	{			
		this._saveGameObject = _saveGameObject;
	
		this._restart(_saveGameObject);		
	}
	else
	{			
		this._create();	
		this._start();	
	}	
	
	this._controlsLocked = false;
}

p._render = function(e)
{
	// Make sure we aren't in the middle of recalculating fov 
	if(this._getCurrentLevel().getMap().canDraw() === true)		
	{
		this._display.clear();
		this._UI.update(this._player);
		
		// Set the camera to point at the player here
		this._renderer.setMapCameraPosition(this._player.getPosition()[0], this._player.getPosition()[1]);
		
		// Need to tidy this up a bit THIS COULD BE IMPROVED SOMETIME
		this._renderer.update(this._getCurrentLevel().getMap(), this._getCurrentLevel().getActors());
	}

}

p._updateLevel = function(e)
{				
	if( this._getCurrentLevel() !== null && this._getCurrentLevel().isLevelActive() )		
		this._getCurrentLevel().update();			
}

p._testUpdateConditions = function()
{
	// return (this._controlsLocked === false && this._inGame === true);
	return (this._controlsLocked === false);
}

p._inGameControls = function(_keyCode)
{
	// Check the level exists, is active and the controls are waiting for player input (not locked)
	if(this._getCurrentLevel() !== null && this._getCurrentLevel().getControlLock() === false)
	{					
		// Movement gets interpreted by the level
		if(_keyCode.controlType === GameScreen.CONTROL_MOVEMENT)
		{										
			this._getCurrentLevel().interpretPlayerInput(_keyCode);						
		}							
	}	
}

p._getCurrentLevel = function()
{
	if(this._levels[this._currentLevelIndex - 1] && this._levels[this._currentLevelIndex - 1] !== null)
		return this._levels[this._currentLevelIndex - 1]
	else
		return null;	
}

p._playerLeavesLevel = function(_up)
{	
	if(_up === true)	
		this._currentLevelIndex += 1;
	else 
		this._currentLevelIndex -= 1;
		
	if(	this._currentLevelIndex <= 0)
		Utils.console("Error, level index too low: " + this._currentLevelIndex);
		
	// If the level doesn't exist then create it here
	if(this._getCurrentLevel() === null)		
	{
		var newLevel = new Level(this, this._playerLeavesLevel, this._playerDies);
		newLevel.create(this._currentLevelIndex);
		this._levels.push(newLevel);
	}
		
	this._getCurrentLevel().joinLevel(this._player, _up);
}

p._playerDies = function()
{
	this._controlsLocked = true;
	
	TweenMax.delayedCall(Globals.DELAY_AFTER_PLAYER_DEATH, this._gameOver, [], this);
}

p._gameOver = function()
{
	this._callbackFunction(ScreenManager.GAME_OVER, []);
}

p._gameWon = function()
{
	this._callbackFunction(ScreenManager.GAME_WON, []);
}

//===================================================
// Events
//===================================================

p.onTimerTick = function(e)
{		
	if(this._getCurrentLevel() && this._getCurrentLevel() !== null)
		this._render();

	if( this._controlsLocked === false )
		this._updateLevel(e);
			
		
}

p.keydownHandler = function(e)
{
	if( this._controlsLocked === true )
		return;
		
	var code = e.keyCode;	
		
	// This saves the game to the screenManager, but also saves "in game" if we want to reload in game for debug purposes
	if(this._keyMap[code].controlType === GameScreen.UTIL_SAVE)
	{
		this._saveGameCheat(); 
		
		// This is purely to be able to load/save in game for debug purposes
		this._callbackFunction(ScreenManager.SAVE_GAME, [this._getSaveObject()]);
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
		this._inGameControls(this._keyMap[code]);					
}

//===================================================
// LOADING & SAVING
//===================================================

p._getSaveObject = function()
{
	var saveObject = {};
	
	// Save the current RNG seed
	saveObject._rngState = ROT.RNG.getState();
	
	saveObject._currentLevelIndex = this._currentLevelIndex;
	
	saveObject._player = this._player.getSaveObject();
	
	saveObject._levels = [];
	
	for(var i=0; i<this._levels.length; i++)
	{	
		 saveObject._levels.push( this._levels[i].getSaveObject() );
	}
				
	return saveObject;
}

p.restoreFromSaveObject = function(_saveObject)
{
	// Restore the current RNG seed
	ROT.RNG.setState(_saveObject._rngState);

	this._currentLevelIndex = _saveObject._currentLevelIndex;
	
	this._player = new Actor();	
	this._player.restoreFromSaveObject(_saveObject._player);
	
	for(var i=0; i<_saveObject._levels.length; i++)
	{
		var newLevel = new Level(this, this._playerLeavesLevel, this._playerDies);
		newLevel.restoreFromSaveObject(_saveObject._levels[i], this._player);
		this._levels.push(newLevel);
	}
}