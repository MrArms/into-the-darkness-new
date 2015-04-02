
goog.provide( "tt.Status" );

//===================================================
// Constructor
//===================================================

Status = function() //_statusType, _timer)
{
	//this.init(_statusType, _timer)
}

var p = Status.prototype;

//===================================================
// Variables
//===================================================

p._statusType = null;
p._timer = null;

Status.POISON = "poison";
Status.REGEN = "regen";

//===================================================
// Public Methods
//===================================================

p.create = function(_statusType, _timer)
{		
	this._statusType = _statusType;

	if(_statusType === Status.POISON)
	{
		this._timer = _timer;
	}
	else if(_statusType === Status.REGEN)
	{
		this._timer = _timer;
	}
}

p.getStatusType = function()
{
	return this._statusType;
}

p.isActive = function()
{
	return this._timer > 0;
}

p.reduceTimer = function()
{
	this._timer = Math.max(0, this._timer - 1); 		
}

p.increaseTimer = function(_timer)
{	
	// Make sure the timer isn't negative first as a failsafe
	this._timer = Math.max(0, this._timer);	
	this._timer += _timer;		
}

// This returns an action for the status - actions are things that happen with a set time that gameEvents can be applied to
p.getAction = function(_actor)
{		
	return (new Action(_actor, Action.STATUS, [[_actor], this]));	
}

// Gets the gameEvent associated with the action
p.getGameEventFromStatus = function(_actor)
{
	if(this._statusType === Status.REGEN)
	{
		return (new GameEvent(_actor, GameEvent.HEAL, [this._getRegenAmount()]));
	}
	else if(this._statusType === Status.POISON)
	{		
		return (new GameEvent(_actor, GameEvent.POISON_DAMAGE, [this._getPoisonDamage()]));
	}
	else
	{
		Utils.console("Error! Status type not defined yet: " + this._statusType);	
	}
}

//===================================================
// Private Methods
//===================================================

p._getRegenAmount = function()
{
	return 2;
}

p._getPoisonDamage = function()
{
	return 1;
}

//===================================================
// Events
//===================================================

//===================================================
// LOADING & SAVING
//===================================================

p.getSaveObject = function()
{
	var saveObject = {};
	
	saveObject._statusType = this._statusType;
	saveObject._timer = this._timer;	
	
	return saveObject;
}

p.restoreFromSaveObject = function(_saveObject)
{
	this._statusType = _saveObject._statusType;
	this._timer = _saveObject._timer;	
}