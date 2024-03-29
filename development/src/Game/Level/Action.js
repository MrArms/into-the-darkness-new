
goog.provide( "tt.Action" );

//===================================================
// Constructor
//===================================================

// _args is an array of arguments, for an attack the first argument is an array of targets (so an array with an array at index 0)
Action = function(_actor, _actionType, _args)
{
	this._actor = _actor;
	this._actionType = _actionType;

	this._init(_actionType, _args);
}

var p = Action.prototype;

//===================================================
// Variables
//===================================================

p._actor = null;

p._targetCell = null;
//p._attackPattern = null;

p._targets = null;
p._delay = null;
p._value = null;

p._actionType = null;

p._status = null;

p._statusType = null;
p._statusTimer = null;

p._newPositions = null;
p._level = null;

Action.ATTACK = "attack";

Action.MOVE = "move";
Action.MOVE_WAIT = "move_wait"; // A movement that we want to wait to see the effect (eg. after knockback)
Action.DEATH = "death";
Action.DELAY = "delay";

Action.DAMAGE = "damage"; // This is for damage that isn't associated with an attack or status effect (eg. self sacrifice)

Action.STATUS = "status";
Action.STATUS_START = "status_start";

// Action.POISON_STATUS_START = "poison_status_start";
// Action.XP_GAIN = "xp_gain";

//===================================================
// Public Methods
//===================================================


//===================================================
// Private Methods
//===================================================

p._init = function(_actionType, _args)
{		
	if(_actionType === Action.ATTACK)
	{
		this._targetCell = _args[0];
		//this._attackPattern = _args[1];
	}	
	else if(_actionType === Action.DAMAGE)
	{
		this._targets = _args[0];
		this._value = _args[1];	
	}
	else if(_actionType === Action.STATUS)
	{		
		this._targets = _args[0];
		this._status = _args[1];
	}
	else if(_actionType === Action.STATUS_START)
	{	
		this._statusType = _args[0];
		this._statusTimer = _args[1];		
	}
	else if(_actionType === Action.MOVE || _actionType === Action.MOVE_WAIT)
	{		
		this._targets = _args[0];
		this._newPositions = _args[1];
		this._level = _args[2];
	}
	else if(_actionType === Action.DEATH)
	{
		this._targets = _args[0];
	}
	else if(_actionType === Action.DELAY)
	{
		this._delay = _args[0];
	}
	
	/*else if(_actionType === Action.XP_GAIN)
	{
		this._targetCell = _args[0];
	}*/
}

//===================================================
// Events
//===================================================

//===================================================
// GETTERS & SETTERS
//===================================================

p.getActionType = function() { return this._actionType;}

p.getActor = function() { return this._actor; }

p.getTargetCell = function() { return this._targetCell; }

// p.getAttackPattern = function() { return this._attackPattern; }

p.getTargets = function() { return this._targets; }

p.getStatus = function() { return this._status; }

p.getValue = function() { return this._value; }

p.getStatusType = function() { return this._statusType; }

p.getStatusTimer = function() { return this._statusTimer; }

p.getNewPositions = function() { return this._newPositions; }

p.getLevel = function() { return this._level; }

p.getDelay = function() { return this._delay; }
