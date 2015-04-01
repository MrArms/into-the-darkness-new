
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

Game = function()
{
	this._init();
}

var p = Game.prototype;

//===================================================
// Variables
//===================================================

p._player = null;

p._doRenderMap = null;

// p._controlsLocked = null;
// p._currentActor = null;

p._levels = null;
p._currentLevelIndex = null;


p._renderer = null;

p.FPS = 60;

Game.CONTROL_MOVEMENT = "movement";
Game.CONTROL_NO_MOVE = "no_move";
Game.CONTROL_DOWN_STAIRS = "down_stairs";
Game.CONTROL_UP_STAIRS = "up_stairs";

p._keyMap = {};

p._keyMap[ROT.VK_NUMPAD8] = {controlType:Game.CONTROL_MOVEMENT, direction:0};
p._keyMap[ROT.VK_NUMPAD9] = {controlType:Game.CONTROL_MOVEMENT, direction:1};
p._keyMap[ROT.VK_NUMPAD6] = {controlType:Game.CONTROL_MOVEMENT, direction:2}; 
p._keyMap[ROT.VK_NUMPAD3] = {controlType:Game.CONTROL_MOVEMENT, direction:3};
p._keyMap[ROT.VK_NUMPAD2] = {controlType:Game.CONTROL_MOVEMENT, direction:4}; 
p._keyMap[ROT.VK_NUMPAD1] = {controlType:Game.CONTROL_MOVEMENT, direction:5};
p._keyMap[ROT.VK_NUMPAD4] = {controlType:Game.CONTROL_MOVEMENT, direction:6}; 
p._keyMap[ROT.VK_NUMPAD7] = {controlType:Game.CONTROL_MOVEMENT, direction:7}; 

p._keyMap[ROT.VK_D] = {controlType:Game.CONTROL_MOVEMENT, direction:Game.CONTROL_DOWN_STAIRS}; 
p._keyMap[ROT.VK_U] = {controlType:Game.CONTROL_MOVEMENT, direction:Game.CONTROL_UP_STAIRS}; 

//===================================================
// Public Methods
//===================================================

//===================================================
// Private Methods
//===================================================

p._init = function()
{	
	this._controlsLocked = true;
	
	this._doRenderMap = false;

	this._display = new ROT.Display({width: Globals.SCREEN_WIDTH, height: Globals.SCREEN_HEIGHT, fontSize:Globals.FONT_SIZE});
	document.body.appendChild(this._display.getContainer());
	
	this._UI = new UI(this._display);
	this._renderer = new Renderer(this._display);
			
	this._handle = this; // Why do we need this exactly?	
	window.addEventListener('keydown', function(e) { this._handle._keydownHandler(e); }.bind(this), false);
			
	// Initialise the player
	this._player = new Actor("@"); //500, Actor.NORMAL_SPEED, false, true)
	
	// Create first level
	this._currentLevelIndex = 1;
	this._levels = [];
	this._levels.push(new Level(1, this, this._playerLeavesLevel, this._playerDies));
	
	setInterval(this._onTimerTick.bind(this), 1000 / this.FPS); // 33 milliseconds = ~ 30 frames per sec
									
	// Start the game
	this._start();
}

p._start = function()
{
	this._getCurrentLevel().joinLevel(this._player, true);
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
		this._levels.push(new Level(this._currentLevelIndex, this, this._playerLeavesLevel, this._playerDies));	
		
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
	if(this._getCurrentLevel() !== null && this._getCurrentLevel().getControlLock() === false)
	{				
		var code = e.keyCode;		

		if ( (code in this._keyMap) )
		{						
			// Movement gets interpreted by the level
			if(this._keyMap[code].controlType === Game.CONTROL_MOVEMENT)
			{										
				this._getCurrentLevel().interpretPlayerInput(this._keyMap[code]);						
			}
		}			
	}				
}