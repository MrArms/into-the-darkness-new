
goog.provide( "tt.ActionGod" );

goog.require( "tt.Attack" );
goog.require( "tt.GameEvent" );

//===================================================
// Constructor
//===================================================


ActionGod = function(_level)
{
	this._level = _level;

	this._init();
}

var p = ActionGod.prototype;

//===================================================
// Variables
//===================================================

p._level = null;
p._currentState = null;

// This stores whether to wait for an animation or not (if it is more than 0)
// If you just let it run to 0 frames then it takes an extra frame to process the next stage causing a nasty flicker
p._waitForAnim = null;

p._afterAnimWaitTime = null;

p._actionQueue = null;

p._actionRound = null;

// If it is a double move then duplicate the action queue for use at the end
p._doubleMove = null;
p._doubleActionQueue = null;

// A list of gameEvents which are things that happen to an actor that also can be grabbed by the renderer to animate
// When the animations have played on the actors then the actors get updated with the event
// Game events contain the actor that the event is on
p._gameEventList = null;

p.STATE_IDLE = "idle";
p.STATE_PROCESSING = "processing";
p.STATE_WAITING_FOR_ANIM = "waiting_for_anim";
p.STATE_WAITING_AFTER_ACTION = "waiting_after_action";

//===================================================
// Public Methods
//===================================================

p.startAction = function(_endCallback) //, _doubleMove)
{
	// This stores which action round we're in and is used to prevent endless counter attack loops
	this._actionRound = 1;

	this._endCallback = _endCallback;
	
	/*if(!_doubleMove || _doubleMove === null)
		this._doubleMove = false;
	else
		this._doubleMove = _doubleMove;
		
	// If it is a double move then we need to get the initial action to duplicate for later
	if(this._doubleMove === true)
	{
		this._doubleActionQueue = [];
		
		for(var i=0; i<this._actionQueue.length; i++)
		{
			this._doubleActionQueue.push(this._actionQueue[i].getActionType);
		}
	}*/

	this._gameEventList = [];		
	
	// Processes the first action in the list (there's only one at the moment)
	this._processAction();		
}

p.addAction = function(_action)
{
	// Add the action to the action queue
	this._actionQueue.push(_action);
}

p.update = function()
{
	if(this._currentState === this.STATE_IDLE || this._currentState === this.STATE_PROCESSING
														|| this._currentState === this.STATE_WAITING_AFTER_ACTION)
		return;
		
	else if(this._currentState === this.STATE_WAITING_FOR_ANIM)
	{		
		var animRunning = false;
	
		for(var i=0; i<this._gameEventList.length; i++)
		{
			this._gameEventList[i].updateAnimation();
			
			if(this._gameEventList[i].animationActive())
				animRunning = true;
		}
		
		if(animRunning === false)
		{
			this._currentState = this.STATE_WAITING_AFTER_ACTION;
			this._resolveAction();
		}		
	}
}

p.getAfterAnimWaitTime = function()
{
	return this._afterAnimWaitTime;
}

//===================================================
// Private Methods
//===================================================

p._reset = function()
{
	this._currentState = this.STATE_IDLE;
	
	this._waitForAnim = false; // This tells us whether to wait for an animation
	this._afterAnimWaitTime = 0; // This tells us whether to pause at the end of the animation before another action or next turn is called

	this._actionQueue = [];
}

p._addGameEvent = function(_gameEvent)
{
	this._gameEventList.push( _gameEvent );
	this._setMaxAnimTime( _gameEvent );
}

// Takes the maximum anim time from all the game events (they can all be different length animations)
p._setMaxAnimTime = function(_gameEvent)
{
	this._waitForAnim = this._waitForAnim || (_gameEvent.getTimer() > 0);	

	this._afterAnimWaitTime = Math.max(this._afterAnimWaitTime, _gameEvent.getAfterAnimWaitTime());	
}

p._targetAdjacent = function(_attacker, _defender)
{
	var targetPos = _defender.getPosition();
	var attackerPos = _attacker.getPosition();
	
	return (Utils.getDistanceBetweenMapPoints(targetPos, attackerPos) === 1);
}

p._getKnockbackCell = function(_attacker, _defender)
{
	var targetPos = _defender.getPosition();
	var attackerPos = _attacker.getPosition();
	
	return Utils.getPositionBehindSecondPointFromFirst(attackerPos, targetPos);
}

p._knockbackCellFree = function(_attacker, _defender)
{
	var knockbackCell = this._getKnockbackCell(_attacker, _defender);
	
	var cellActor = this._level.getActors().getElementFromValues(knockbackCell[0], knockbackCell[1]);

	return (this._level.getMap().canWalk(knockbackCell[0], knockbackCell[1]) && cellActor === null);											
}

p._resolveKnockback = function(_currentAction, _currentTarget, _damage)
{
	var tempAttacker = _currentAction.getActor();

	if(this._targetAdjacent(tempAttacker, _currentTarget))
	{
		if(this._knockbackCellFree(tempAttacker, _currentTarget))
		{
			this.addAction(new Action(_currentTarget, Action.MOVE_WAIT, [[ _currentTarget ], [this._getKnockbackCell(tempAttacker, _currentTarget)], this._level] ) );
		}		
		else
		{	
			// Need to test if we're hitting into another actor
			var knockbackCell = this._getKnockbackCell(tempAttacker, _currentTarget);			
			var cellActor = this._level.getActors().getElementFromValues(knockbackCell[0], knockbackCell[1]);
			
			// Need to damage the actor we're bashing into here too
			if(cellActor !== null)
			{
				var tempBumpeeDamage = 1;
			
				var newDamageGameEvent = new GameEvent(cellActor, GameEvent.DAMAGE, [tempBumpeeDamage]);
						
				// Add it to the actor so the renderer can display the gameEvent 			
				cellActor.addGameEvent(newDamageGameEvent);	

				this._addGameEvent( newDamageGameEvent );
			}
			
			// Increasing the damage on the first target here
			_damage = _damage + 1;
		}
	}
	
	return _damage;
}

p._processAction = function()
{
	// Get the action and remove it from the queue
	var currentAction = this._actionQueue.splice(0, 1)[0];
	
	// Need to get the event list for the action and any subsequent actions need to be added to the action queue	
	if(currentAction.getActionType() === Action.ATTACK)
	{							
		for(var i=0; i<currentAction.getTargets().length; i++)
		{
			var currentTarget = currentAction.getTargets()[i];
									
			var damage = Attack.resolve(currentAction.getActor(), currentTarget);
			
			// Need to test if the attacker has knockback here
			if(currentAction.getActor().hasEffect(Effect.KNOCKBACK))			
				damage = this._resolveKnockback(currentAction, currentTarget, damage);
													
			// Show the attacker is attacking
			var newAttackGameEvent = new GameEvent(currentAction.getActor(), GameEvent.ATTACK, []);
			
			// Add it to the actor so the renderer can display the gameEvent 
			currentAction.getActor().addGameEvent(newAttackGameEvent);		
			
			this._addGameEvent( newAttackGameEvent );
			
			// Show the target is hit
			var newDamageGameEvent = new GameEvent(currentTarget, GameEvent.DAMAGE, [damage]);
						
			// Add it to the actor so the renderer can display the gameEvent 			
			currentTarget.addGameEvent(newDamageGameEvent);	

			this._addGameEvent( newDamageGameEvent );											
			
			// If the target has a counter attack then add it here (check we're in the first action round to prevent endless counter loops)
			if( this._actionRound === 1 && currentTarget.isActorAlive() === true && currentTarget.hasEffect(Effect.COUNTER_ATTACK)) // && currentTarget.isHasCounterAttack() )
			{				
				// If the attacker is able to knockback the defender then the defender cannot counter attack 
				if(!currentAction.getActor().hasEffect(Effect.KNOCKBACK) || !this._knockbackCellFree(currentAction.getActor(), currentTarget)) 
					this.addAction(new Action(currentTarget, Action.ATTACK, [[ currentAction.getActor() ]]) ); 															
			}
		}	
		
		// If it is a double blow then add the original attack again here
	}
	else if(currentAction.getActionType() === Action.STATUS)
	{			
		var newGameEvent = currentAction.getStatus().getGameEventFromStatus(currentAction.getActor());
		currentAction.getActor().addGameEvent(newGameEvent);
		this._addGameEvent( newGameEvent );
	}
	// The targets are what moves here and not the actor making the action (it could be knockback for example)
	else if(currentAction.getActionType() === Action.MOVE || currentAction.getActionType() === Action.MOVE_WAIT)
	{
		for(var i=0; i<currentAction.getTargets().length; i++)
		{
			var currentTarget = currentAction.getTargets()[i];
			var newPosition = currentAction.getNewPositions()[i];
					
			var gameEventType = currentAction.getActionType() === Action.MOVE ? GameEvent.MOVEMENT : GameEvent.MOVEMENT_WAIT;
			
			// We should have already checked that the destination position is vacant before we even created the action, so no need to check it here
			var newMovementGameEvent = new GameEvent(currentTarget, gameEventType, [newPosition, currentAction.getLevel()]);
			
			// Add it to the actor so the renderer can display the gameEvent
			currentTarget.addGameEvent(newMovementGameEvent);				
			// this._gameEventList.push( newMovementGameEvent );	
			this._addGameEvent( newMovementGameEvent );	
		}	
	}
	
	// If we need to wait for an animation then do it here
	if(this._waitForAnim === true)	
		this._currentState = this.STATE_WAITING_FOR_ANIM;
	
	// Otherwise go straight to the next part
	else	
		this._resolveAction();
}

// This applies the action to the actors after the animation has been completed
p._resolveAction = function()
{
	for(var i=0; i<this._gameEventList.length; i++)
	{		
		this._gameEventList[i].resolveGameEvent();	
	}
	
	this._gameEventList = [];

	// Need to check the remaining actors in the actionQueue events are still alive (the previous action may have killed them)	
	// If we ever want to add an action that is performed after the death of an actor (eg. resurrect, explode) then we'll need to change this part here
	for(var j=this._actionQueue.length - 1; j>=0; j--)
	{
		if(this._actionQueue[j].getActor().isActorAlive() === false)		
			this._actionQueue.splice(j, 1);					
	}
	
	// We need to update the actors here again as the situation may have changed (if knockback moves an actor or more enemies killed this turn etc.)	
	if(this._actionQueue.length > 0)
		this._level.updateActors();
						
	// if we have any actions left then we need to start the next one in the queue
	// Check the actor to perform the action is still alive too
	if(this._actionQueue.length > 0)
	{			
		this._actionRound += 1;
	
		var tempWaitTime = Globals.DELAY_BETWEEN_ACTIONS + this._afterAnimWaitTime / Globals.FPS;
	
		// We put a slight delay between actions
		TweenMax.delayedCall(tempWaitTime, this._processAction, [], this);		
		// TweenMax.delayedCall(Globals.DELAY_BETWEEN_ACTIONS + this._afterAnimWaitTime, this._processAction, [], this);		
	}
	// Otherwise tell the game that the "turn" that contained all the actions in the actionQueue (and any ones subsequently added to it) has completely finished
	else
	{
		var tempWaitTime = this._afterAnimWaitTime / Globals.FPS;
	
		this._reset();
		
		if(tempWaitTime && tempWaitTime > 0)			
			TweenMax.delayedCall(tempWaitTime, this._endCallback, [], this);
		else
			this._endCallback();							
	}
}

/*p._crappyFunction = function()
{
	this._endCallback();
}*/

p._init = function()
{	
	this._reset();
}

//===================================================
// Events
//===================================================

