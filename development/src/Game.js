
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

p._controlsLocked = null;
p._actors = null;
p._currentActor = null;

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

	this._renderer = new Renderer();
	
	this._actionGod = new ActionGod();
	
	this._handle = this; // Why do we need this exactly?
	
	window.addEventListener('keydown', function(e) { this._handle._keydownHandler(e); }.bind(this), false);
			
	this._actors = [];
	
	// Initialise the player
	this._player = new Actor(3,3, 500, Actor.NORMAL_SPEED, false, true)
	
	this._actors.push(this._player); 
	
	// Initialise test monsters
	this._actors.push(new Actor(2,4, 20, Actor.NORMAL_SPEED, true, false)); // counter	
	this._actors.push(new Actor(3,4, 15, Actor.FAST_SPEED, false, false)); 
	this._actors.push(new Actor(4,4, 10, Actor.SLOW_SPEED, false, false)); 
	
	// Here add the status effects to the player and monsters to test 
	this._actors[0].addStatus(Status.POISON, 3);
	this._actors[0].addStatus(Status.REGEN, 7);
	
	this._actors[1].addStatus(Status.POISON, 2);
	this._actors[1].addStatus(Status.REGEN, 1);
	//this._actors[2].addStatus(Status.REGEN, 3);
	//this._actors[3].addStatus(Status.REGEN, 5);
	
	setInterval(this._onTimerTick.bind(this), 1000 / this.FPS); // 33 milliseconds = ~ 30 frames per sec
			
	// TurnManager.getNextActor		
	
	// Starts the first monster to move
	this._startLevel();
			
	// this._controlsLocked = false;	
}

// Eventually we'll have an array of levels etc.
p._startLevel = function()
{
	// Set all monsters to the monster start timer and the player to the player start timer	
	for(var i=0; i<this._actors.length; i++)
	{
		if(this._actors[i].isPlayer())
			this._actors[i].setMoveTimerToPlayerStart();
		else	
			this._actors[i].setMoveTimerToMonsterStart();				
	}
	
	this._nextTurn();
	
}

p._nextTurn = function()
{		
	this._currentActor = TurnManager.getNextActor(this._player, this._actors);	
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
	this._controlsLocked = true;
	
	// Set the currentActor here - it is temporary for the moment as we don't have a proper game loop yet *******
	//this._currentActor = this._actors[0];			
				
	// Need to create an action here - temporary - will eventually poll the controls to determine this *****
	//this._actionGod.addAction(new Action(this._currentActor, Action.ATTACK, [[ this._actors[1], this._actors[2], this._actors[3] ]] ) );	
	this._actionGod.addAction(new Action(this._currentActor, Action.ATTACK, [[ this._actors[1]]] ) );	
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
	// Only need this really after the player turn
	// this._controlsLocked = true;

	this._currentActor.turnFinished();
	
	// Need to remove any actors killed this turn here
	this._removeDeadActors();
	
	// Slight delay before letting the next character move
	TweenMax.delayedCall(Globals.END_TURN_DELAY, this._nextTurn, [], this);
}

p._removeDeadActors = function()
{
	for(var i=this._actors.length - 1; i>= 0; i--)
	{
		if(this._actors[i].isActorAlive() === false)		
			this._actors.splice(i, 1);		
	}
}

//===================================================
// Events
//===================================================

p._onTimerTick = function(e)
{	
	this._renderer.update(this._actors);
}

p._keydownHandler = function(e)
{
	if(this._controlsLocked === false)
	{
		this._interpretPlayerMove();
	}
}