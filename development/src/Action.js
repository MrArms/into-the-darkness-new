
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
p._targets = null;
p._actionType = null;
p._statusType = null;

Action.ATTACK = "attack";
Action.STATUS = "status";

//===================================================
// Public Methods
//===================================================

p.getActionType = function()
{
	return this._actionType;
}

p.getActor = function()
{
	return this._actor;
}

p.getTargets = function()
{
	return this._targets;
}

p.getStatusType = function()
{
	return this._statusType;
}

//===================================================
// Private Methods
//===================================================

p._init = function(_actionType, _args)
{		
	if(_actionType === Action.ATTACK)
	{
		this._targets = _args[0];
	}
	else if(_actionType === Action.STATUS)
	{
		this._statusType = _args[1];
	}
}

//===================================================
// Events
//===================================================

