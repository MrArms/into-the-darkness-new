
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

Attack.canKnockback = function(_level, _attacker, _defender)
{
	return (_attacker.hasEffect(Effect.KNOCKBACK) && Attack.isKnockbackCellFree(_level, _attacker, _defender));
}

Attack.resolveKnockback = function(_level, _actionGod, _attacker, _defender, _damage)
{
	if(Attack.targetAdjacent(_attacker, _defender))
	{
		if(Attack.isKnockbackCellFree(_level, _attacker, _defender))
		{
			_actionGod.addAction(new Action(_defender, Action.MOVE_WAIT, [[ _defender ], [Attack.getKnockbackCell(_attacker, _defender)], _level] ) );
		}		
		else
		{	
			// Need to test if we're hitting into another actor
			var knockbackCell = Attack.getKnockbackCell(_attacker, _defender);			
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

// This is made more complicated by the double_move effect
Attack.testAndProcessCounterAttack = function(_actionGod, _level, _attacker, _defender)
{
	// If the target has a counter attack then add it here (check we're in the first action round to prevent endless counter loops)
	if( _actionGod.getActionRound() === 1 && _defender.isActorAlive() === true && _defender.hasEffect(Effect.COUNTER_ATTACK)) 
	{
		// If the attacker is able to knockback the defender then the defender cannot counter attack 
		if(!_attacker.hasEffect(Effect.KNOCKBACK) || !Attack.isKnockbackCellFree(_level, _attacker, _defender)) 
		{
			_actionGod.addAction(new Action(_defender, Action.ATTACK, [ _attacker.getPosition() ]) ); 

			// If the defender has double move then they get two counter attacks, but not if the defender can knock them back
			if(_defender.hasEffect(Effect.DOUBLE_MOVE))
			{		
				// Test for knockback here and if not then add the attack as normal
				if(!Attack.canKnockback(_level, _defender, _attacker))
					_actionGod.addAction(new Action(_defender, Action.ATTACK, [ _attacker.getPosition() ]) ); 				
			}
		}	
	}
}

Attack.processOneAttackTarget = function(_level, _actionGod, _attacker, _defender)
{
	var damage = Attack.calculateBaseDamage(_attacker, _defender);
		
	// Need to test if the attacker has knockback here
	if(_attacker.hasEffect(Effect.KNOCKBACK))			
		damage = Attack.resolveKnockback(_level, _actionGod, _attacker, _defender, damage);
											
	// Show the attacker is attacking
	var newAttackGameEvent = new GameEvent(_attacker, GameEvent.ATTACK, []);	
	// Add it to the actor so the renderer can display the gameEvent 
	_attacker.addGameEvent(newAttackGameEvent);			
	_actionGod.addGameEvent( newAttackGameEvent );
	
	// Show the target is hit
	var newDamageGameEvent = new GameEvent(_defender, GameEvent.DAMAGE, [damage]);				
	// Add it to the actor so the renderer can display the gameEvent 			
	_defender.addGameEvent(newDamageGameEvent);	
	_actionGod.addGameEvent( newDamageGameEvent );	

	/*if(damage >= _defender.getCurrentHP())	
	{	
		//_attacker.madeKill();		
		//_actionGod.addAction(new Action(_defender, Action.DEATH, []) ); 
	}*/
			
	Attack.testAndProcessCounterAttack(_actionGod, _level, _attacker, _defender);	

}

Attack.processAttack = function(_level, _actionGod, _action)
{
	var targetCell = _action.getTargetCell();
		
	var attacker = _action.getActor();
		
	var attackTargets = Attack.getAttackTargets(attacker, _level.getActors(), targetCell);
	
	for(var i=0; i<attackTargets.length; i++)
	{				
		var currentTarget = attackTargets[i];
		
		Attack.processOneAttackTarget(_level, _actionGod, attacker, currentTarget);							
	}			
}

// Currently just returns the damage of the attack - later will include status effects etc.
Attack.calculateBaseDamage = function(_attacker, _defender)
{
	return 3;		
}

Attack.getAttackTargets = function(_attacker, _actors, _targetCell)
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
	
	// Need to make sure the actor hasn't been killed already this turn 
	if(newTarget !== null && newTarget.isActorAlive() === true)	
		targets.push( newTarget );
		
	return targets;
}