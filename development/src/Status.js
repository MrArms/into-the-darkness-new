
goog.provide( "tt.Status" );

//===================================================
// Constructor
//===================================================

Status = function(_statusType, _timer)
{
	this._init(_statusType, _timer)
}

var p = Status.prototype;

//===================================================
// Variables
//===================================================

p._statusType = null;
p._timer = null;
p._oneTurn = null;

Status.POISON = "poison";
Status.REGEN = "regen";
// Status.ATTACK_PLUS = "attack_plus";
// Status.BRAVERY = "bravery";

//===================================================
// Public Methods
//===================================================

p.getStatusType = function()
{
	return this._statusType;
}

p.isActive = function()
{
	return this._timer > 0;
}

p.reduceTimer = function(_beforeTurn)
{
	if(_beforeTurn === false || this._oneTurn === true)
	{
		this._timer -= 1; 	
	}
}

p.increaseTimer = function(_timer)
{
	if(this._oneTurn)
		_timer = 2;
	else
	{
		// Make sure the timer isn't negative first as a failsafe
		this._timer = Math.max(0, this._timer);	
		this._timer += _timer;	
	}
}

// This an action for the status - actions are things that happen with a set time that gameEvents can be applied to
p.getAction = function(_actor)
{		
	// return (new Action(_actor, Action.STATUS, [[_actor], this._statusType]));	
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

p._init = function(_statusType, _timer)
{		
	this._statusType = _statusType;
	this._oneTurn = false;

	if(_statusType === Status.POISON)
	{
		this._timer = _timer;
	}
	else if(_statusType === Status.REGEN)
	{
		this._timer = _timer;
	}
	else if(_statusType === Status.ATTACK_PLUS)
	{		
		this._oneTurn = true;
		this._timer = 2; // Timer set to 2 which will be reduced at the end of the turn and at the beginning of the next one
	}

}

//===================================================
// Events
//===================================================

