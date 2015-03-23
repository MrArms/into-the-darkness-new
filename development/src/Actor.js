
goog.provide( "tt.Actor" );

//===================================================
// Constructor
//===================================================

Actor = function(_col, _row, _health, _hasCounterAttack)
{
	this._col = _col;
	this._row = _row;
	
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

p._currentHP = null;
p._isAlive = null;
p._hasCounterAttack = null;

p._currentGameEvent = null;

//===================================================
// Public Methods
//===================================================

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
		Utils.console("Error - adding gameEvent to actor, but it already has one");

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

// Called by the game event
p.damage = function(_amount)
{
	this._currentHP = Math.max(0, this._currentHP - _amount);
	
	if(this._currentHP <= 0)
		this._kill();
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
}

//===================================================
// Events
//===================================================
