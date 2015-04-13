
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

Attack.targetAdjacent = function(_attacker, _defender)
{
	var targetPos = _defender.getPosition();
	var attackerPos = _attacker.getPosition();
	
	return (Utils.getDistanceBetweenMapPoints(targetPos, attackerPos) === 1);
}

Attack.getKnockbackCell = function(_attacker, _defender)
{
	var targetPos = _defender.getPosition();
	var attackerPos = _attacker.getPosition();
	
	return Utils.getPositionBehindSecondPointFromFirst(attackerPos, targetPos);
}

Attack.isKnockbackCellFree = function(_level, _attacker, _defender)
{
	var knockbackCell = Attack.getKnockbackCell(_attacker, _defender);
	
	var cellActor = _level.getActors().getElementFromValues(knockbackCell[0], knockbackCell[1]);

	return (_level.getMap().canWalk(knockbackCell[0], knockbackCell[1]) && cellActor === null);											
}

Attack.resolveKnockback = function(_level, _actionGod, _currentAction, _currentTarget, _damage)
{
	var tempAttacker = _currentAction.getActor();

	if(Attack.targetAdjacent(tempAttacker, _currentTarget))
	{
		if(Attack.isKnockbackCellFree(_level, tempAttacker, _currentTarget))
		{
			_actionGod.addAction(new Action(_currentTarget, Action.MOVE_WAIT, [[ _currentTarget ], [Attack.getKnockbackCell(tempAttacker, _currentTarget)], _level] ) );
		}		
		else
		{	
			// Need to test if we're hitting into another actor
			var knockbackCell = Attack.getKnockbackCell(tempAttacker, _currentTarget);			
			var cellActor = _level.getActors().getElementFromValues(knockbackCell[0], knockbackCell[1]);
			
			// Need to damage the actor we're bashing into here too
			if(cellActor !== null)
			{
				var tempBumpeeDamage = 1;
			
				var newDamageGameEvent = new GameEvent(cellActor, GameEvent.DAMAGE, [tempBumpeeDamage]);
						
				// Add it to the actor so the renderer can display the gameEvent 			
				cellActor.addGameEvent(newDamageGameEvent);	

				_actionGod.addGameEvent( newDamageGameEvent );
			}
			
			// Increasing the damage on the first target here
			_damage = _damage + 1;
		}
	}
	
	return _damage;
}

Attack.processAttack = function(_level, _actionGod, _action)
{
	var targetCell = _action.getTargetCell();
		
	var attackTargets = Attack.getAttackTargets(_action.getActor(), _level.getActors(), targetCell);
	
	for(var i=0; i<attackTargets.length; i++)
	{	
		var currentTarget = attackTargets[i];
								
		var damage = Attack.calculateBaseDamage(_action.getActor(), currentTarget);
		
		// Need to test if the attacker has knockback here
		if(_action.getActor().hasEffect(Effect.KNOCKBACK))			
			damage = Attack.resolveKnockback(_level, _actionGod, _action, currentTarget, damage);
												
		// Show the attacker is attacking
		var newAttackGameEvent = new GameEvent(_action.getActor(), GameEvent.ATTACK, []);
		
		// Add it to the actor so the renderer can display the gameEvent 
		_action.getActor().addGameEvent(newAttackGameEvent);		
		
		_actionGod.addGameEvent( newAttackGameEvent );
		
		// Show the target is hit
		var newDamageGameEvent = new GameEvent(currentTarget, GameEvent.DAMAGE, [damage]);
					
		// Add it to the actor so the renderer can display the gameEvent 			
		currentTarget.addGameEvent(newDamageGameEvent);	

		_actionGod.addGameEvent( newDamageGameEvent );	

		if(damage >= currentTarget.getCurrentHP())
			_action.getActor().madeKill();
				
		// If the target has a counter attack then add it here (check we're in the first action round to prevent endless counter loops)
		if( _actionGod.getActionRound() === 1 && currentTarget.isActorAlive() === true && currentTarget.hasEffect(Effect.COUNTER_ATTACK)) // && currentTarget.isHasCounterAttack() )
		{				
			// If the attacker is able to knockback the defender then the defender cannot counter attack 
			if(!_action.getActor().hasEffect(Effect.KNOCKBACK) || !Attack.isKnockbackCellFree(_action.getActor(), currentTarget)) 
			{
				_actionGod.addAction(new Action(currentTarget, Action.ATTACK, [ _action.getActor().getPosition() ]) ); 

				// If the defender has double move then they get two counter attacks 
				if(currentTarget.hasEffect(Effect.DOUBLE_MOVE))
					_actionGod.addAction(new Action(currentTarget, Action.ATTACK, [ _action.getActor().getPosition() ]) ); 	
			}					
		}
	}			
}

// Currently just returns the damage of the attack - later will include status effects etc.
Attack.calculateBaseDamage = function(_attacker, _defender)
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