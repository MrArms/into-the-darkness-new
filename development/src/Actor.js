
goog.provide( "tt.Actor" );

//===================================================
// Constructor
//===================================================

Actor = function(_col, _row, _health, _hasCounterAttack)
{
	this._col = _col;
	this._row = _row;
	
	this._maxHP = _health;
	this._currentHP = _health;
	
	this._hasCounterAttack = _hasCounterAttack;

	this._init();
}

var p = Actor.prototype;

//===================================================
// Variables
//===================================================

p._col = null;
p._row = null;

p._maxHP = null;
p._currentHP = null;
p._isAlive = null;
p._hasCounterAttack = null;

p._statusArray = null;

p._currentGameEvent = null;

//===================================================
// Public Methods
//===================================================

p.addStatus = function(_statusType, _timer)
{
	// Need to search to see if the status is already active and if so add it to the timer	
	var alreadyActive = false;
	
	for(var i=0; i<this._statusArray.length; i++)
	{
		if(this._statusArray[i].getStatusType() === _statusType)
		{
			this._statusArray[i].increaseTimer(_timer);
			
			alreadyActive = true;		
		}
	}
	
	// We eon't already have the status active so add it to the status array here
	if(alreadyActive === false)
	{
		this._statusArray.push(new Status(_statusType, _timer));
	}	
}

// Get the current actions associated with active status' and return them all in order to be processed
p.getEndTurnStatusActions = function()
{
	var returnActionArray = [];
		
	for(var i=0; i<this._statusArray.length; i++)
	{	
		var newAction = this._statusArray[i].getAction(this);
	
		// Regen should always be before poison etc.
		if(this._statusArray[i] === Status.REGEN)		
			returnActionArray.unshift(newAction);
		// Other status' go on at the end
		else
		{
			returnActionArray.push(newAction);	
		}		
	}

	return returnActionArray;
}

p.turnStarted = function()
{
	// Update one turn status and anything else that needs to be done before the turn
	for(var i=this._statusArray.length - 1; i>=0; i--)
	{
		this._statusArray[i].reduceTimer(true);
		
		if(this._statusArray[i].isActive() === false)
			this._statusArray[i].splice(i, 1);
	}
}

p.turnFinished = function()
{
	this._currentGameEvent = null;

	// Update status and anything else that needs to be done after the turn
	for(var i=this._statusArray.length - 1; i>=0; i--)
	{
		this._statusArray[i].reduceTimer(false);
		
		if(this._statusArray[i].isActive() === false)
			this._statusArray.splice(i, 1);		
	}		
}

p.isHasCounterAttack = function()
{
	return this._hasCounterAttack;
}

// This adds a game event to the actor, but doesn't yet apply it
//		it is used by the renderer to show an animation
// 	
p.addGameEvent = function(_gameEvent)
{
	if(this._currentGameEvent !== null)
	{
		if(this._currentGameEvent.getEventType() !== _gameEvent.getEventType())
		{		
			Utils.console("Error - adding gameEvent of different type to actor, but it already has one - see below to details");
			Utils.console("Old gameEvent type: " + this._currentGameEvent.getEventType() + "   new gameEvent type: " + _gameEvent.getEventType());			
		}
		else
		{
			// So we have a gameEvent that is the same as the gameEvent already on an actor
			// This is ok because an actor can say hit more than one enemy on the same turn so will get multiple attack gameEvents called on it
		}
	}

	this._currentGameEvent = _gameEvent;
}

// The renderer looks for this to see whether there is any gameEvents to render (eg. damage etc.)
p.getGameEvent = function()
{
	return this._currentGameEvent;
}

p.removeGameEvent = function()
{
	this._currentGameEvent = null;
}

p.isActorAlive = function()
{
	return this._isAlive;
}

p.getPosition = function()
{		
	return [this._col, this._row];
}

// Called by using a gameEvent from ActionGod
p.damage = function(_amount)
{
	this._currentHP = Math.max(0, this._currentHP - _amount);
	
	if(this._currentHP <= 0)
		this._kill();
}

// Called by using a gameEvent from ActionGod
p.heal = function(_amount)
{
	this._currentHP = Math.min(this._maxHP, this._currentHP + _amount);
}

//===================================================
// Private Methods
//===================================================

p._kill = function()
{
	this._isAlive = false;
}

p._init = function()
{		
	this._isAlive = true;
	
	this._statusArray = [];
}

//===================================================
// Events
//===================================================
