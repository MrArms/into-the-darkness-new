
goog.provide( "tt.Effect" );

//===================================================
// Constructor
//===================================================

Effect = function(_effectType, _timer)
{
	this._init(_effectType, _timer)
}

var p = Effect.prototype;

//===================================================
// Variables
//===================================================

p._effectType = null;
p._timer = null;
p._value = null;

Effect.BRAVERY = "bravery";
Effect.ATTACK = "attack";
Effect.DEFENCE = "defence";

//===================================================
// Public Methods
//===================================================

p.getEffectType = function()
{
	return this._effectType;
}

p.isActive = function()
{
	return this._timer > 0;
}

p.reduceTimer = function(_beforeTurn)
{
	this._timer -= 1; 		
}

/*p.increaseTimer = function(_timer)
{	
	// Make sure the timer isn't negative first as a failsafe
	this._timer = Math.max(0, this._timer);	
	this._timer += _timer;	
}*/

p.getValue = function()
{	
	return this._value;
}

//===================================================
// Private Methods
//===================================================

p._init = function(_effectData, _timer)
{		
	this._effectType = _effectData.name;
	
	if(_effectData.value && _effectData.value !== null)
		this._value = _effectData.value;
	
	if(_timer && _timer !== null)
		_timer = _timer
	else
		_timer = 1;
		
	//if(this._effectType === Effect.ATTACK)
	//	this._value = 
}

//===================================================
// Events
//===================================================

