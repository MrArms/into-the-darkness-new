
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

Effect.BRAVERY = "bravery_effect";
Effect.ATTACK = "attack_effect";
Effect.DEFENCE = "defence_effect";

//===================================================
// Public Methods
//===================================================

p.reduceTimer = function()
{
	this._timer -= 1; 		
}

p.applyEffectToActor = function(_actor)
{
	if(this._effectType === Effect.ATTACK)
		_actor.setCurrentAttackBonus(_actor.getCurrentAttackBonus() + this._value);
		
	else if(this._effectType === Effect.DEFENCE)
		_actor.setCurrentDefenceBonus(_actor.getCurrentDefenceBonus() + this._value);

	else if(this._effectType === Effect.BRAVERY)
		_actor.setCurrentAttackBonus(_actor.getCurrentAttackBonus() + _actor.getNumberActorsAdjacent() );		
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
}

//===================================================
// Events
//===================================================

//===================================================
// GETTERS & SETTERS
//===================================================

p.getEffectType = function()
{
	return this._effectType;
}

p.isActive = function()
{
	return this._timer > 0;
}

p.getValue = function()
{	
	return this._value;
}
