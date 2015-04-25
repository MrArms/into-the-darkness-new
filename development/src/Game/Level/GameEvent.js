
goog.provide( "tt.GameEvent" );

goog.require( "tt.Animation" );

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

p._statusType = null;
p._statusTimer = null;

p._timer = null;
p._endTimer = null;
p._afterAnimWaitTime = null;

p._animation = null;

GameEvent.ATTACK = "attack";
GameEvent.DAMAGE = "damage";
GameEvent.HEAL = "heal";
GameEvent.POISON_STATUS_DAMAGE = "poison_status_damage";
GameEvent.MOVEMENT = "movement";
GameEvent.MOVEMENT_WAIT = "movement_wait"; // A movement that we want to wait to see the effect (eg. after knockback)
GameEvent.DEATH = "death"; 
GameEvent.XP_GAIN = "xp_gain"; 
GameEvent.DELAY = "delay"; 
GameEvent.STATUS_START = "status_start"; 

GameEvent.ANIM_TIME_MOVEMENT = 0; //5;
GameEvent.ANIM_TIME_MOVEMENT_WAIT = 20; //5;


//===================================================
// Public Methods
//===================================================

// This takes the actor involved and applies the GameEvent to them
p.resolveGameEvent = function()
{
	if(this._eventType === null)
	
		Utils.console("Error - gameEvent._eventType is null so cannot apply it");
		
	else if(this._eventType === GameEvent.ATTACK)
	{
		this._actor.dealsDamage(this._damage);
	}
	else if(this._eventType === GameEvent.DAMAGE)
	{					
		this._actor.damage( this._damage );
	}
	// The difference between this and normal damage is purely graphical
	else if(this._eventType === GameEvent.POISON_STATUS_DAMAGE)
	{
		this._actor.damage( this._damage );
	}
	else if(this._eventType === GameEvent.HEAl)
	{
		// this._actor.heal( this.getHealAmount() );
		this._actor.heal( this._healAmount );
	}
	// GameEvent.MOVEMENT_WAIT actor moved before animation plays so no need to move it here
	else if(this._eventType === GameEvent.MOVEMENT) // || this._eventType === GameEvent.MOVEMENT_WAIT)
	{
		this._level.moveActor(this._actor, this._newPosition);
	}
	else if(this._eventType === GameEvent.DEATH)
	{
		this._actor.kill();
	}
	else if(this._eventType === GameEvent.DELAY)
	{
		// No need to do anything with delay
	}
	else if(this._eventType === GameEvent.STATUS_START)
	{
		this._actor.addStatus(this._statusType, this._statusTimer);	
	}
	
	this._actor.removeGameEvent();
}

p.updateAnimation = function()
{
	// this._timer = Math.max(0, this._timer - 1);
	this._timer += 1;
}

p.animationOrTimerActive = function()
{
	if(this._animation && this._animation !== null)
		return this._animation.isAnimationActive(this._timer);

	return (this._timer !== null && this._timer < this._endTimer);
}

p.getChar = function()
{
	if(this._animation.getCharFromFrame(this._timer) !== null)
		return this._animation.getCharFromFrame(this._timer)
	else
	{	
		if(this._eventType === GameEvent.DAMAGE || this._eventType === GameEvent.POISON_STATUS_DAMAGE)		
			return this._damage;
		else if(this._eventType === GameEvent.HEAl)
			return this._healAmount;
		else		
			return this._actor.getChar();
	}	
		
	// return this._animation.getCharFromFrame(this._timer);
}

p.getBackgroundColour = function()
{
	return this._animation.getBackgroundColourFromFrame(this._timer)	
}

p.getForegroundColour = function()
{
	return this._animation.getForegroundColourFromFrame(this._timer);
}

/*p.doesDamage = function()
{
	return (this.getEventType() === GameEvent.POISON_STATUS_DAMAGE || this.getEventType() === GameEvent.DAMAGE);
}*/

//===================================================
// Private Methods
//===================================================

p._init = function(_eventType, _args)
{	
	this._timer = 0;

	if(_eventType === GameEvent.ATTACK)
	{	
		this._damage = _args[0];
	
		// Set anim timer								
		this._animation = new Animation(Anim.ATTACK);	
		this._endTimer = this._animation.getAnimationLength(); 
	}
	else if(_eventType === GameEvent.POISON_STATUS_DAMAGE)
	{	
		this._animation = new Animation(Anim.POISON_STATUS_DAMAGE);	
		this._endTimer = this._animation.getAnimationLength();
	
		// Shouldn't be hard coded really		
		this._damage = 1;
	}
	else if(_eventType === GameEvent.DAMAGE)
	{
		this._animation = new Animation(Anim.DAMAGE);	
		this._endTimer = this._animation.getAnimationLength(); 

		this._damage = _args[0];
	}
	else if(_eventType === GameEvent.HEAL)
	{
		this._healAmount = _args[0];
	
		this._animation = new Animation(Anim.HEAL);	
		this._endTimer = this._animation.getAnimationLength();		
	}
	else if(_eventType === GameEvent.MOVEMENT)
	{
		this._newPosition = _args[0];
		this._level = _args[1];
		this._endTimer = GameEvent.ANIM_TIME_MOVEMENT;				
	}
	// This is the same as a movement gameEvent except we move the actor before the wait in ActionGod
	else if(_eventType === GameEvent.MOVEMENT_WAIT)
	{
		this._newPosition = _args[0];
		this._level = _args[1];
		this._endTimer = GameEvent.ANIM_TIME_MOVEMENT_WAIT;		
	}
	else if(_eventType === GameEvent.DEATH)
	{
		this._animation = new Animation(Anim.DEATH);	
		this._endTimer = this._animation.getAnimationLength();	
	}
	else if(_eventType === GameEvent.XP_GAIN)
	{
		this._animation = new Animation(Anim.XP_GAIN);	
		this._endTimer = this._animation.getAnimationLength();	
	}
	else if(_eventType === GameEvent.DELAY)
	{
		this._animation = null;	
		this._endTimer = _args[0] * Globals.FPS;	
	}
	else if(_eventType === GameEvent.STATUS_START)
	{
		this._statusType = _args[0];
		this._statusTimer = _args[1];	
		
		// Add any other status types and animations here
		if(this._statusType === Status.POISON)		
			this._animation = new Animation(Anim.POISON_STATUS_START);	
		
		
		this._endTimer = this._animation.getAnimationLength();	
	}
}

//===================================================
// Events
//===================================================

//===================================================
// GETTERS & SETTERS
//===================================================

p.getActor = function() { return this._actor;}

p.hasAnimation = function() { return (this._animation !== null);}

p.getEventType = function() { return this._eventType;	}

// p._getDamage = function() {	return this._damage; }

// p.getHealAmount = function() {	return this._healAmount; }

p.getNewPosition = function() {	return this._newPosition; }

p.getLevel = function() { return this._level; }

p.getTimer = function() { return this._timer; }

//p.getAfterAnimWaitTime = function() { return this._afterAnimWaitTime; }