
goog.provide( "tt.Attack" );

//===================================================
// Constructor
//===================================================

Attack = function()
{


}

//===================================================
// Variables
//===================================================

Attack.SURROUND_PATTERN = "surround";
Attack.SINGLE_TARGET_PATTERN = "single";

//===================================================
// Public Methods
//===================================================

// Currently just returns the damage of the attack - later will include status effects etc.
Attack.resolve = function(_attacker, _defender)
{
	return 3;		
}

Attack.getAttackTargets = function(_attacker, _actors, _direction, _attackType)
{
	var targets = null;

	if(_attackType === Attack.SINGLE_TARGET_PATTERN)
	{	
		return Attack.getSingleTarget(_attacker, _actors, _direction);
	}
	else if(_attackType === Attack.SURROUND_PATTERN)
	{
	
	}
}

Attack.getSingleTarget = function(_attacker, _actors, _direction)
{
	var targets = [];
	
	var targetCol = _attacker.getPosition()[0] + _direction[0];
	var targetRow = _attacker.getPosition()[1] + _direction[1];
	
	return targets;
}