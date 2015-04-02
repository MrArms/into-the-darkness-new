
goog.provide( "tt.Game" );

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

Game = function(_display)
{
	this._init(_display);
}

var p = Game.prototype;

//===================================================
// Variables
//===================================================

p._inGame = null;

p._player = null;

p._doRenderMap = null;

p._levels = null;
p._currentLevelIndex = null;

p._renderer = null;

p.FPS = 60;

p._saveGameObject = null;

Game.CONTROL_MOVEMENT = "movement";
Game.CONTROL_NO_MOVE = "no_move";
Game.CONTROL_DOWN_STAIRS = "down_stairs";
Game.CONTROL_UP_STAIRS = "up_stairs";

Game.UTIL_SAVE = "save";
Game.UTIL_LOAD = "load";

p._keyMap = {};

p._keyMap[ROT.VK_NUMPAD8] = {controlType:Game.CONTROL_MOVEMENT, direction:0};
p._keyMap[ROT.VK_NUMPAD9] = {controlType:Game.CONTROL_MOVEMENT, direction:1};
p._keyMap[ROT.VK_NUMPAD6] = {controlType:Game.CONTROL_MOVEMENT, direction:2}; 
p._keyMap[ROT.VK_NUMPAD3] = {controlType:Game.CONTROL_MOVEMENT, direction:3};
p._keyMap[ROT.VK_NUMPAD2] = {controlType:Game.CONTROL_MOVEMENT, direction:4}; 
p._keyMap[ROT.VK_NUMPAD1] = {controlType:Game.CONTROL_MOVEMENT, direction:5};
p._keyMap[ROT.VK_NUMPAD4] = {controlType:Game.CONTROL_MOVEMENT, direction:6}; 
p._keyMap[ROT.VK_NUMPAD7] = {controlType:Game.CONTROL_MOVEMENT, direction:7}; 

p._keyMap[ROT.VK_NUMPAD5] = {controlType:Game.CONTROL_MOVEMENT, direction:Game.CONTROL_NO_MOVE}; 

p._keyMap[ROT.VK_D] = {controlType:Game.CONTROL_MOVEMENT, direction:Game.CONTROL_DOWN_STAIRS}; 
p._keyMap[ROT.VK_U] = {controlType:Game.CONTROL_MOVEMENT, direction:Game.CONTROL_UP_STAIRS}; 

// Load/Save
p._keyMap[ROT.VK_S] = {controlType:Game.UTIL_SAVE}; 
p._keyMap[ROT.VK_L] = {controlType:Game.UTIL_LOAD}; 

//===================================================
// Public Methods
//===================================================

p.create = function()
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

p.start = function()
{
	this._getCurrentLevel().joinLevel(this._player, true);
	this._getCurrentLevel().startLevel();
	
	this._inGame = true;				
}

p.destroy = function()
{
	while(this._levels.length > 0)
	{
		var tempLevel = this._levels.pop();
		tempLevel.destroy();
		tempLevel = null;
	}

	this._levels = null;
		 	
	//this._player.destroy();
	this._player = null;	
}

//===================================================
// Private Methods
//===================================================

p._init = function(_display)
{	
	
	this._resetVariables();
	
	this._display = _display;
		
	this._UI = new UI(this._display);
	this._renderer = new Renderer(this._display);
			
	this._handle = this; // Why do we need this exactly?	
	window.addEventListener('keydown', function(e) { this._handle._keydownHandler(e); }.bind(this), false);
								
	setInterval(this._onTimerTick.bind(this), 1000 / this.FPS); // 33 milliseconds = ~ 30 frames per sec
								
	// Start the game
	// this._start();
}

p._resetVariables = function()
{
	this._inGame = false;

	this._controlsLocked = true;
	
	this._doRenderMap = false;
	
	this._levels = [];
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
	Utils.console("Player dies!!!");
}

//===================================================
// Events
//===================================================

p._onTimerTick = function(e)
{		
	if(this._inGame === false)
		return;

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
	
	if( this._getCurrentLevel() !== null && this._getCurrentLevel().isLevelActive() )		
		this._getCurrentLevel().update();			
}

p._keydownHandler = function(e)
{
	// Check the level exists, is active and the controls are waiting for player input (not locked)
	if(this._inGame === true && this._getCurrentLevel() !== null && this._getCurrentLevel().getControlLock() === false)
	{				
		var code = e.keyCode;		

		if ( (code in this._keyMap) )
		{						
			// Movement gets interpreted by the level
			if(this._keyMap[code].controlType === Game.CONTROL_MOVEMENT)
			{										
				this._getCurrentLevel().interpretPlayerInput(this._keyMap[code]);						
			}
			else if(this._keyMap[code].controlType === Game.UTIL_SAVE)
			{
				this._inGame = false;
				
				this._saveGameObject = this.getSaveObject();
				
				this._inGame = true;
			}
			else if(this._saveGameObject !== null && this._keyMap[code].controlType === Game.UTIL_LOAD)
			{
				this._inGame = false;
				
				this.destroy();
				this._resetVariables();
				this.restoreFromSaveObject(this._saveGameObject);
				
				this._getCurrentLevel().startLevel();
				
				this._inGame = true;
			}
		}			
	}				
}

//===================================================
// LOADING & SAVING
//===================================================

p.getSaveObject = function()
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
	
	// _saveObject._player.getSaveObject();
}