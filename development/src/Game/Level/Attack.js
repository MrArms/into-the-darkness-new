
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

Attack.getAttackTargets = function(_attacker, _actors, _targetCell) //, _attackType)
{
	var targets = null;

	// Eventually will get this from the actors effects etc.
	var _attackType = Attack.SINGLE_TARGET_PATTERN;
	
	if(_attackType === Attack.SINGLE_TARGET_PATTERN)
	{	
		return Attack.getSingleTarget(_attacker, _actors, _targetCell);
	}
	else if(_attackType === Attack.SURROUND_PATTERN)
	{
	
	}
}

Attack.getSingleTarget = function(_attacker, _actors, _targetCell)
{
	var targets = [];

	var newTarget = _actors.getElementFromValues(_targetCell[0], _targetCell[1]);
	
	if(newTarget !== null)	
		targets.push( newTarget );
		
	return targets;
}