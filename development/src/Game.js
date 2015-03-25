
goog.provide( "tt.Game" );

goog.require( "tt.Actor" );
goog.require( "tt.Action" );
goog.require( "tt.ActionGod" );
goog.require( "tt.Renderer" );
goog.require( "tt.Utils" );
goog.require( "tt.Status" );

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

p._controlsLocked = null;
p._actorList = null;
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
			
	this._actorList = [];
	
	this._actorList.push(new Actor(3,3, 100, false)); // player
	this._actorList.push(new Actor(2,4, 2, true)); // counter
	this._actorList.push(new Actor(3,4, 7, true)); // damaged
	this._actorList.push(new Actor(4,4, 7, true)); // dies
	
	// Here add the status effects to the player and later monsters to test them (monsters won't work yet ***)	
	this._actorList[0].addStatus(Status.POISON, 3);
	this._actorList[0].addStatus(Status.REGEN, 2);
	
	setInterval(this._onTimerTick.bind(this), 1000 / this.FPS); // 33 milliseconds = ~ 30 frames per sec
			
	this._controlsLocked = false;	
}

p._startPlayerMove = function()
{
	this._controlsLocked = true;
	
	// Set the currentActor here - it is temporary for the moment as we don't have a proper game loop yet *******
	this._currentActor = this._actorList[0];			
	this.turnActorStarted();		
			
	// Need to create an action here - temporary - will eventually poll the controls to determine this *****
	this._actionGod.addAction(new Action(this._currentActor, Action.ATTACK, [[ this._actorList[1], this._actorList[2], this._actorList[3] ]] ) );	
	this._actionGod.startAction(this._turnActionFinished.bind(this) );	
}

p.turnActorStarted = function()
{
	this._currentActor.turnStarted();
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
	
	// Only do this for this DEMO - eventually need the proper turn manager stuff to work
	this._controlsLocked = false;
}

//===================================================
// Events
//===================================================

p._onTimerTick = function(e)
{	
	this._renderer.update(this._actorList);
}

p._keydownHandler = function(e)
{
	if(this._controlsLocked === false)
	{
		this._startPlayerMove();
	}
}