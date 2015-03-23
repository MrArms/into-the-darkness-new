
goog.provide( "tt.GameEvent" );

// These are events in game that are performed on an actor/when
// So for example damage, death (not currently implemented), poison damage etc.
// You could add a timer to them and add the timer functionality to the TurnGod if you wanted more complex animations 

//===================================================
// Constructor
//===================================================

// _args is an array of arguments
GameEvent = function(_actor, _eventType, _args)
{
	this._actor = _actor;
	this._eventType = _eventType;

	this._init(_eventType, _args);
}

var p = GameEvent.prototype;

//===================================================
// Variables
//===================================================

p._actor = null;
p._eventType = null;
p._damage = null;
// p._targets = null;

GameEvent.ATTACK = "attacks";
GameEvent.DAMAGE = "damage";
// GameEvent.DAMAGE_AND_DEATH = "damage_and_death"; // This is worked out in the actor/when resolving stuff

//===================================================
// Public Methods
//===================================================

p.getActor = function()
{
	return this._actor;
}

p.getEventType = function()
{
	return this._eventType;	
}

p.getDamage = function()
{
	return this._damage;
}

// This takes the actor involved and applies the GameEvent to them
p.resolveGameEvent = function()
{
	if(this._eventType === null)
		Utils.console("Error - gameEvent._eventType is null so cannot apply it");
	else if(this._eventType === GameEvent.ATTACK)
	{
		// Do nothing as the actor hasn't changed after attacking
	}
	else if(this._eventType === GameEvent.DAMAGE)
	{
		this._actor.damage( this.getDamage() );
	}
	
	this._actor.removeGameEvent();

}

//===================================================
// Private Methods
//===================================================

p._init = function(_eventType, _args)
{	
	if(_eventType === GameEvent.ATTACK)
	{
		// Don't need any variables for the attacker
	}
	else if(_eventType === GameEvent.DAMAGE)
	{
		this._damage = _args[0];
	}
}

//===================================================
// Events
//===================================================

