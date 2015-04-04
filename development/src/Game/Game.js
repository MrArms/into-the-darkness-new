
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

// p._saveGameObject = null;

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

// Start after a newly created level has been made
p.start = function()
{
	this._getCurrentLevel().joinLevel(this._player, true);
	this._getCurrentLevel().startLevel();
	
	this._inGame = true;				
}

// Restart from a saved game after initialisation
p.restart = function(_saveGameObject)
{
	this.restoreFromSaveObject(_saveGameObject);
				
	this._getCurrentLevel().startLevel();
	
	this._inGame = true;
}

p.update = function(e)
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

p.keyDown = function(_keyCode)
{
	if(this._inGame === false)
		return;

	// Check the level exists, is active and the controls are waiting for player input (not locked)
	if(this._inGame === true && this._getCurrentLevel() !== null && this._getCurrentLevel().getControlLock() === false)
	{					
		// Movement gets interpreted by the level
		if(_keyCode.controlType === GameScreen.CONTROL_MOVEMENT)
		{										
			this._getCurrentLevel().interpretPlayerInput(_keyCode);						
		}							
	}				
}

p.destroy = function()
{
	// Stops stuff from happening
	this._inGame = false;

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

p._init = function(_display)
{		
	this._inGame = false;

	this._controlsLocked = true;
	
	this._doRenderMap = false;
	
	this._levels = [];
	
	this._display = _display;
		
	this._UI = new UI(this._display);
	this._renderer = new Renderer(this._display);		
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


//===================================================
// LOADING & SAVING
//===================================================

p.getSaveObject = function()
{
	// Stop the game moving for the moment
	this._inGame = false;

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
				
	this._inGame = true;			
				
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