
goog.provide( "tt.ActionGod" );

goog.require( "tt.Attack" );
goog.require( "tt.GameEvent" );

//===================================================
// Constructor
//===================================================


ActionGod = function(_level)
{
	this._level = _level;

	this._init();
}

var p = ActionGod.prototype;

//===================================================
// Variables
//===================================================

p._level = null;
// p._currentState = null;

// This stores whether to wait for an animation or not (if it is more than 0)
// If you just let it run to 0 frames then it takes an extra frame to process the next stage causing a nasty flicker
// p._waitForAnim = null;

// p._afterAnimWaitTime = null;

p._actionQueue = null;

p._actionRound = null;

// If it is a double move then duplicate the action queue for use at the end
p._doubleMove = null;
p._doubleActionQueue = null;

// A list of gameEvents which are things that happen to an actor that also can be grabbed by the renderer to animate
// When the animations have played on the actors then the actors get updated with the event
// Game events contain the actor that the event is on
p._gameEventList = null;

p.STATE_IDLE = "idle";
p.STATE_PROCESSING = "processing";
p.STATE_WAITING_FOR_ANIM = "waiting_for_anim";
p.STATE_WAITING_AFTER_ACTION = "waiting_after_action";

//===================================================
// Public Methods
//===================================================

p.startAction = function(_endCallback)
{
	// This stores which action round we're in and is used to prevent endless counter attack loops
	this._actionRound = 1;

	this._endCallback = _endCallback;
		
	this._gameEventList = [];		
	
	// Processes the first action in the list (there's only one at the moment)
	this._processAction();		
}

p.addAction = function(_action)
{
	// Add the action to the action queue
	this._actionQueue.push(_action);
}

p.update = function()
{
	// Check whether an action is ongoing
	if(this._gameEventList && this._gameEventList !== null && this._gameEventList.length > 0)
	{
		if(this._animationsActive())
		{					
			for(var i=0; i<this._gameEventList.length; i++)		
				this._gameEventList[i].updateAnimation();						
		}
		else
			this._resolveAction();		
	}
	

	/*if(this._currentState === this.STATE_IDLE || this._currentState === this.STATE_PROCESSING || this._currentState === this.STATE_WAITING_AFTER_ACTION)
		return;
		
	else if(this._currentState === this.STATE_WAITING_FOR_ANIM)
	{		
		var animRunning = false;
	
		for(var i=0; i<this._gameEventList.length; i++)
		{
			this._gameEventList[i].updateAnimation();
			
			if(this._gameEventList[i].animationActive())
				animRunning = true;
		}
		
		if(animRunning === false)
		{
			this._currentState = this.STATE_WAITING_AFTER_ACTION;
			this._resolveAction();
		}		
	}*/
}

p.addGameEvent = function(_gameEvent)
{
	this._gameEventList.push( _gameEvent );
	// this._setMaxAnimTime( _gameEvent );
}

//===================================================
// Private Methods
//===================================================

p._reset = function()
{
	//this._resetAnimTimers();

	this._actionQueue = [];
}

/*p._resetAnimTimers = function()
{
	this._currentState = this.STATE_IDLE;
	
	this._waitForAnim = false; // This tells us whether to wait for an animation
	this._afterAnimWaitTime = 0; // This tells us whether to pause at the end of the animation before another action or next turn is called
}*/

// Takes the maximum anim time from all the game events (they can all be different length animations)
/*p._setMaxAnimTime = function(_gameEvent)
{
	this._waitForAnim = this._waitForAnim || (_gameEvent.getTimer() > 0);	

	this._afterAnimWaitTime = Math.max(this._afterAnimWaitTime, _gameEvent.getAfterAnimWaitTime());	
}*/

p._animationsActive = function()
{
	for(var i=0; i<this._gameEventList.length; i++)
	{		
		if(this._gameEventList[i].animationActive())
			return true;
	}
			
	return false;
}

// This needs breaking up into different functions *****
p._processAction = function()
{
	// Reset any anim delay etc. here
	//this._resetAnimTimers();

	// Get the action and remove it from the queue
	var currentAction = this._actionQueue.splice(0, 1)[0];
	
	// Need to get the event list for the action and any subsequent actions need to be added to the action queue	
	if(currentAction.getActionType() === Action.ATTACK)
	{				
		Attack.processAttack(this._level, this, currentAction);
	}
	else if(currentAction.getActionType() === Action.STATUS)
	{			
		var newGameEvent = currentAction.getStatus().getGameEventFromStatus(currentAction.getActor());
		currentAction.getActor().addGameEvent(newGameEvent);
		this.addGameEvent( newGameEvent );
	}
	// The targets are what moves here and not the actor making the action (it could be knockback for example)
	else if(currentAction.getActionType() === Action.MOVE || currentAction.getActionType() === Action.MOVE_WAIT)
	{
		for(var i=0; i<currentAction.getTargets().length; i++)
		{
			var currentTarget = currentAction.getTargets()[i];
			var newPosition = currentAction.getNewPositions()[i];
					
			var gameEventType = currentAction.getActionType() === Action.MOVE ? GameEvent.MOVEMENT : GameEvent.MOVEMENT_WAIT;
			
			// For knockback etc. move the actor before the animation plays
			// A little hacky, but it should be ok hopefully
			if(currentAction.getActionType() === Action.MOVE_WAIT)
				this._level.moveActor(currentTarget, newPosition);
			
			// We should have already checked that the destination position is vacant before we even created the action, so no need to check it here
			var newMovementGameEvent = new GameEvent(currentTarget, gameEventType, [newPosition, currentAction.getLevel()]);
			
			// Add it to the actor so the renderer can display the gameEvent
			currentTarget.addGameEvent(newMovementGameEvent);							
			this.addGameEvent( newMovementGameEvent );	
		}	
	}
			
	if(!this._animationsActive())
		this._resolveAction();	
	
	// If we need to wait for an animation then do it here
	/*if(this._waitForAnim === true)	
		this._currentState = this.STATE_WAITING_FOR_ANIM;
	
	// Otherwise go straight to the next part
	else	
		this._resolveAction();*/
}

// This applies the action to the actors after the animation has been completed
p._resolveAction = function()
{
	for(var i=0; i<this._gameEventList.length; i++)
	{		
		this._gameEventList[i].resolveGameEvent();	
	}
	
	this._gameEventList = [];

	// Need to check the remaining actors in the actionQueue events are still alive (the previous action may have killed them)	
	// If we ever want to add an action that is performed after the death of an actor (eg. resurrect, explode) then we'll need to change this part here
	for(var j=this._actionQueue.length - 1; j>=0; j--)
	{
		if(this._actionQueue[j].getActor().isActorAlive() === false)		
			this._actionQueue.splice(j, 1);					
	}
	
	// We need to update the actors here again as the situation may have changed (if knockback moves an actor or more enemies killed this turn etc.)	
	if(this._actionQueue.length > 0)
		this._level.updateActors();
						
	// if we have any actions left then we need to start the next one in the queue
	// Check the actor to perform the action is still alive too
	if(this._actionQueue.length > 0)
	{						
		this._actionRound += 1;
	
		var tempWaitTime = Globals.DELAY_BETWEEN_ACTIONS; // + this._afterAnimWaitTime / Globals.FPS;
	
		// We put a slight delay between actions
		TweenMax.delayedCall(tempWaitTime, this._processAction, [], this);				
	}
	// Otherwise tell the game that the "turn" that contained all the actions in the actionQueue (and any ones subsequently added to it) has completely finished
	else
	{
		this._reset();
		this._endCallback();
	}
	/*{
		var tempWaitTime = this._afterAnimWaitTime / Globals.FPS;
	
		this._reset();
		
		if(tempWaitTime && tempWaitTime > 0)			
			TweenMax.delayedCall(tempWaitTime, this._endCallback, [], this);
		else
			this._endCallback();							
	}*/
}

p._init = function()
{	
	this._reset();
}

//===================================================
// Events
//===================================================

//===================================================
// GETTERS & SETTERS
//===================================================

//p.getAfterAnimWaitTime = function() {return this._afterAnimWaitTime;}

p.getActionRound = function() {return this._actionRound;}
