
goog.provide( "tt.GameEvent" );

// These are events in game that are performed on an actor
// So for example damage, death (not currently implemented), poison damage etc.
// They are grabbed by the renderer to show animations, actor states etc.
// There is a timer on them that shows how long they last 

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
p._healAmount = null;
p._newPosition = null;
p._level = null;

p._timer = null;
p._afterAnimWaitTime = null;

GameEvent.ATTACK = "attack";
GameEvent.DAMAGE = "damage";
GameEvent.HEAL = "heal";
GameEvent.POISON_DAMAGE = "poison_damage";
GameEvent.MOVEMENT = "movement";
GameEvent.MOVEMENT_WAIT = "movement_wait"; // A movement that we want to wait to see the effect (eg. after knockback)

GameEvent.ANIM_ATTACK = 5;
GameEvent.ANIM_TIME_DAMAGE = 20; //20;

GameEvent.ANIM_TIME_HEAL = 20;
GameEvent.ANIM_TIME_POISON_DAMAGE = 20;
GameEvent.ANIM_TIME_MOVEMENT = 0; //5;

GameEvent.ANIM_AFTER_ACTION_WAIT_TIME = 20;

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

p.getHealAmount = function()
{
	return this._healAmount;
}

p.getNewPosition = function()
{
	return this._newPosition;
}

p.getLevel = function()
{
	return this._level;
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
	// The difference between this and normal damage is purely graphical
	else if(this._eventType === GameEvent.POISON_DAMAGE)
	{
		this._actor.damage( this.getDamage() );
	}
	else if(this._eventType === GameEvent.HEAl)
	{
		this._actor.heal( this.getHealAmount() );
	}
	else if(this._eventType === GameEvent.MOVEMENT || this._eventType === GameEvent.MOVEMENT_WAIT)
	{
		this._level.moveActor(this._actor, this._newPosition);
	}
	
	this._actor.removeGameEvent();
}

p.getTimer = function()
{
	return this._timer;
}

p.updateAnimation = function()
{
	this._timer = Math.max(0, this._timer - 1);
}

p.animationActive = function()
{
	return (this._timer && this._timer >= 0);
}

p.getAfterAnimWaitTime = function()
{
	return this._afterAnimWaitTime;
}

//===================================================
// Private Methods
//===================================================

p._init = function(_eventType, _args)
{	
	if(_eventType === GameEvent.ATTACK)
	{
		// Don't need any variables for the these events
		
		// Set anim timer
		this._timer = GameEvent.ANIM_ATTACK;
		this._afterAnimWaitTime = GameEvent.ANIM_AFTER_ACTION_WAIT_TIME;
	}
	else if(_eventType === GameEvent.POISON_DAMAGE)
	{	
		this._timer = GameEvent.ANIM_TIME_POISON_DAMAGE;
		this._afterAnimWaitTime = GameEvent.ANIM_AFTER_ACTION_WAIT_TIME;
	
		// Shouldn't be hard coded really		
		this._damage = 1;
	}
	else if(_eventType === GameEvent.DAMAGE)
	{
		this._timer = GameEvent.ANIM_TIME_DAMAGE;
		this._afterAnimWaitTime = GameEvent.ANIM_AFTER_ACTION_WAIT_TIME;
		this._damage = _args[0];
	}
	else if(_eventType === GameEvent.HEAL)
	{
		this._timer = GameEvent.ANIM_TIME_HEAL;
		this._afterAnimWaitTime = GameEvent.ANIM_AFTER_ACTION_WAIT_TIME;
		this._healAmount = _args[0];
	}
	else if(_eventType === GameEvent.MOVEMENT)
	{
		this._timer = GameEvent.ANIM_TIME_MOVEMENT;
		this._afterAnimWaitTime = 0; // Don't want to wait after the turn has finished (too annoying)
		this._newPosition = _args[0];
		this._level = _args[1];
	}
	// This is the same as a movement gameEvent except we want to wait at the end
	else if(_eventType === GameEvent.MOVEMENT_WAIT)
	{
		this._timer = GameEvent.ANIM_TIME_MOVEMENT;
		this._afterAnimWaitTime = GameEvent.ANIM_AFTER_ACTION_WAIT_TIME; 
		this._newPosition = _args[0];
		this._level = _args[1];
	}
}

//===================================================
// Events
//===================================================

