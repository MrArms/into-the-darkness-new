
goog.provide( "tt.Effect" );

//===================================================
// Constructor
//===================================================

Effect = function()
{
	// this._init(_effectType, _timer)
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
Effect.KNOCKBACK = "knockback";
Effect.COUNTER_ATTACK = "counter_attack";
Effect.DEFENCE = "defence_effect";
Effect.ADRENALINE = "adrenaline";
Effect.POISON_BRAND = "poison_brand";
Effect.SELF_SACRIFICE = "self_sacrifice";
Effect.REVENGE = "revenge";
Effect.SPIKED_ARMOUR = "spiked_armour";
Effect.FIRE_BRAND = "fire_brand";
Effect.RECKLESS_ATTACK = "reckless_attack";
Effect.REINFORCE = "reinforce";
Effect.TACTICS = "tactics";
Effect.SURROUND_ATTACK = "surround_attack";

// Not implemented yet
Effect.DOUBLE_MOVE = "double_move";


//===================================================
// Public Methods
//===================================================

p.create = function(_effectData, _timer)
{		
	this._effectType = _effectData.name;
	
	if(_effectData.value && _effectData.value !== null)
		this._value = _effectData.value;
	
	if(_timer && _timer !== null)
		this._timer = _timer
	else
		this._timer = 1;
}

p.reduceTimer = function()
{
	this._timer -= 1; 		
}

p.applyEffectToActor = function(_actor)
{
	if(this._effectType === Effect.ATTACK)
		_actor.setCurrentAttack(_actor.getCurrentAttack() + this._value);
		
	else if(this._effectType === Effect.DEFENCE)
		_actor.setCurrentDefence(_actor.getCurrentDefence() + this._value);

	else if(this._effectType === Effect.BRAVERY)
		_actor.setCurrentAttack(_actor.getCurrentAttack() + _actor.getNumberActorsAdjacent() );		
		
	else if(this._effectType === Effect.REINFORCE)
		_actor.setCurrentDefence(_actor.getCurrentDefence() + _actor.getNumberActorsAdjacent() );	
		
	else if(this._effectType === Effect.REVENGE)
		_actor.setCurrentAttack(_actor.getCurrentAttack() + _actor.getDamageTakenLastTurn() );	
		
	else if(this._effectType === Effect.TACTICS)
		_actor.setCurrentAttack(_actor.getCurrentAttack() + _actor.getAdjacentDefenceDiff() );	
		
	else if(this._effectType === Effect.RECKLESS_ATTACK)
	{
		_actor.setCurrentAttack(_actor.getCurrentAttack() + _actor.getCurrentDefence() );
		_actor.setCurrentDefence(0);
	}
		
}

// This is for actions created by effects
p.getAction = function(_actor)
{		
	if(this._effectType === Effect.SELF_SACRIFICE)
		return (new Action(_actor, Action.DAMAGE, [[_actor], this._value]));
		
	return null;
		
}

//===================================================
// Private Methods
//===================================================


//===================================================
// Events
//===================================================

//===================================================
// GETTERS & SETTERS
//===================================================

p.getEffectType = function() { return this._effectType;}

p.isActive = function() { return this._timer > 0; }

p.getValue = function() { return this._value; }

//===================================================
// LOADING & SAVING
//===================================================

p.getSaveObject = function()
{
	var saveObject = {};
	
	saveObject._effectType = this._effectType;
	saveObject._timer = this._timer;	
	saveObject._value = this._value;	
	
	return saveObject;
}

p.restoreFromSaveObject = function(_saveObject)
{
	this._effectType = _saveObject._effectType;
	this._timer = _saveObject._timer;	
	this._value = _saveObject._value;	
}
