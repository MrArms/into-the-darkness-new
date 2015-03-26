
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

p._controlsLocked = null;
// p._actors = null;
p._currentActor = null;

p._levels = null;
p._currentLevelIndex = null;

p._actionGod = null;
p._renderer = null;

p.FPS = 60;

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

	this._renderer = new Renderer();
	
	this._actionGod = new ActionGod();
	
	this._handle = this; // Why do we need this exactly?	
	window.addEventListener('keydown', function(e) { this._handle._keydownHandler(e); }.bind(this), false);
			
	// Initialise the player
	this._player = new Actor(500, Actor.NORMAL_SPEED, false, true)
	
	// Create first level
	this._currentLevelIndex = 1;
	this._levels = [];
	this._levels.push(new Level(1));
	
	setInterval(this._onTimerTick.bind(this), 1000 / this.FPS); // 33 milliseconds = ~ 30 frames per sec
									
	// Starts the first monster to move
	this._startLevel();
}

p._getCurrentLevel = function()
{
	return this._levels[this._currentLevelIndex - 1];
}

// Eventually we'll have an array of levels etc.
p._startLevel = function()
{
	// Add the player to the level
	this._getCurrentLevel().addPlayer(this._player);
	
	// Need to update the map viewable tiles from the player position
	this._getCurrentLevel().getMap().updateViewableTiles(this._player.getPosition()[0], this._player.getPosition()[1]);
	
	// Need to set the renderer camera position to the player position
	this._renderer.setMapCameraPosition(this._player.getPosition()[0], this._player.getPosition()[1]);
	
	// Set the initial actor times (player gets first move)
	this._getCurrentLevel().initialiseActorTimers();
						
	// Let the renderer draw the map
	this._doRenderMap = true;
		
	this._nextTurn();	
}

p._nextTurn = function()
{		
	// Considering putting this logic into the level *******
	this._currentActor = TurnManager.getNextActor(this._player, this._getCurrentLevel().getActors());	
	this._currentActor.turnStarted();
	
	// Unlock the controls for the player turn
	if(this._currentActor.isPlayer())
	{
		this._controlsLocked = false;
	}
	// Otherwise get the AI move and start to perform it
	else
	{
		this._actionGod.addAction(AI.getMove(this._currentActor, this._player));
		this._actionGod.startAction(this._turnActionFinished.bind(this) );		
	}					
}	

p._interpretPlayerMove = function()
{
	// Will need a test for this eventually
	this._controlsLocked = true;

	// Need to create an action here - temporary - will eventually poll the controls to determine this *****
	this._actionGod.addAction(new Action(this._currentActor, Action.ATTACK, [[ this._getCurrentLevel().getActors[1]]] ) );	
	this._actionGod.startAction(this._turnActionFinished.bind(this) );	
}

// This says the action the actor performed during their turn has finished
p._turnActionFinished = function()
{	
	var newActions = this._currentActor.getEndTurnStatusActions();
	
	for(var i=0; i<newActions.length; i++)	
		this._actionGod.addAction(newActions[i]);
	
	// If we have status actions to perform then do this here, otherwise just end the turn
	if(newActions.length > 0)	
		this._actionGod.startAction(this._turnFinished.bind(this));		
	else
		this._turnFinished();
}

// Here the turn has finished, but we need to update the actors status timers before we can finish completely
p._turnFinished = function()
{
	this._currentActor.turnFinished();
	
	// Need to remove any actors killed this turn here
	this._removeDeadActors();
	
	// Slight delay before letting the next character move
	TweenMax.delayedCall(Globals.END_TURN_DELAY, this._nextTurn, [], this);
}

p._removeDeadActors = function()
{
	for(var i=this._getCurrentLevel().getActors().length - 1; i>= 0; i--)
	{
		if(this._getCurrentLevel().getActors()[i].isActorAlive() === false)		
			this._getCurrentLevel().getActors().splice(i, 1);		
	}
}

//===================================================
// Events
//===================================================

p._onTimerTick = function(e)
{		
	if(this._doRenderMap === true)
	{
		// Make sure we aren't in the middle of recalculating fov 
		if(this._getCurrentLevel().getMap().canDraw() === true)
			this._renderer.update(this._getCurrentLevel().getMap(), this._getCurrentLevel().getActors());
	}
}

p._keydownHandler = function(e)
{
	if(this._controlsLocked === false)
	{
		this._interpretPlayerMove();
	}
}