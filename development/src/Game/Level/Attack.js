
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

Attack.applyPoisonBrand = function(_actionGod, _attacker, _defender, _damage, _attackerHealthChange)
{
	if(_attacker.hasEffect(Effect.POISON_BRAND))	
		_actionGod.addActionAtFront(new Action(_defender, Action.STATUS_START, [Status.POISON, _damage]) ); 	

	if(_attackerHealthChange < 0 && _defender.hasEffect(Effect.POISON_BRAND))
		_actionGod.addActionAtFront(new Action(_attacker, Action.STATUS_START, [Status.POISON, -_attackerHealthChange]) ); 			
}

Attack.createAndApplyGameEvents = function(_actionGod, _actor, _gameEventType, _argArray)
{
	var newGameEvent = new GameEvent(_actor, _gameEventType, _argArray);	
	// Add it to the actor so the renderer can display the gameEvent 
	_actor.addGameEvent(newGameEvent);			
	_actionGod.addGameEvent( newGameEvent );
}

Attack.createAttackAndDamageGameEvents = function(_actionGod, _attacker, _defender, _damage, _attackerHealthChange)
{
	if(_attackerHealthChange === 0)	
		Attack.createAndApplyGameEvents(_actionGod, _attacker, GameEvent.ATTACK, [_damage]);			
	else if(_attackerHealthChange > 0)
		Attack.createAndApplyGameEvents(_actionGod, _attacker, GameEvent.HEAL, [_attackerHealthChange]);		
	else if(_attackerHealthChange < 0)		
		Attack.createAndApplyGameEvents(_actionGod, _attacker, GameEvent.DAMAGE, [-_attackerHealthChange]);
		
	Attack.createAndApplyGameEvents(_actionGod, _defender, GameEvent.DAMAGE, [_damage]);	
}

Attack.processOneAttackTarget = function(_level, _actionGod, _attacker, _defender)
{
	var damage = Attack.calculateBaseDamage(_attacker, _defender);
		
	// Need to test if the attacker has knockback here
	if(_attacker.hasEffect(Effect.KNOCKBACK))			
		damage = Attack.resolveKnockback(_level, _actionGod, _attacker, _defender, damage);
						
	var attackerHealthChange = 0;
	
	if(_defender.hasEffect(Effect.SPIKED_ARMOUR))	
		var  attackerHealthChange = -Math.max(0, _defender.getCurrentDefence() - _attacker.getCurrentDefence());
		
	if(_attacker.hasEffect(Effect.FIRE_BRAND))	
		damage = damage * 2;
						
	Attack.createAttackAndDamageGameEvents(_actionGod, _attacker, _defender, damage, attackerHealthChange);

	Attack.applyPoisonBrand(_actionGod, _attacker, _defender, damage, attackerHealthChange);
	
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
	return Math.max(0, _attacker.getCurrentAttack() - _defender.getCurrentDefence());		
}

Attack.getAttackTargets = function(_attacker, _actors, _targetCell)
{
	//var targets = null;

	// Eventually will get this from the actors effects etc.
	var _attackType = Attack.SINGLE_TARGET_PATTERN;
	
	// if(_attacker.isPlayer() === true)
	
	if(_attacker.hasEffect(Effect.SURROUND_ATTACK) === true)
		_attackType = Attack.SURROUND_PATTERN;
	
	if(_attackType === Attack.SINGLE_TARGET_PATTERN)
	{	
		return Attack.getSingleTarget(_attacker, _actors, _targetCell);
	}
	else if(_attackType === Attack.SURROUND_PATTERN)
	{
		return Attack.getSurroundTargets(_attacker, _actors, _targetCell);
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

Attack.getSurroundTargets = function(_attacker, _actors, _targetCell)
{
	var targets = [];

	var startPosition = _attacker.getPosition();
	
	for(var i=-1; i<=1; i++)
		for(var j=-1; j<=1; j++)
		{
			if(i !== 0 || j !== 0)
			{
				var newTarget = _actors.getElementFromValues(startPosition[0] + i, startPosition[1] + j);
				
				if(newTarget !== null && newTarget.isActorAlive() === true)	
					targets.push( newTarget );				
			}		
		}
	
	return targets;
}
