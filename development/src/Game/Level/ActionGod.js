
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

p.startAction = function(_endCallback)
{
	this._endCallback = _endCallback;

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

p._knockbackStuff = function(_currentAction, _currentTarget, _damage)
{
	// First test if the defender is adjacent to the attacker (can only knockback adjacent enemies)
	var targetPos = _currentTarget.getPosition();
	var attackerPos = _currentAction.getActor().getPosition();
										
	if(Utils.getDistanceBetweenMapPoints(targetPos, attackerPos) === 1)
	{
		// Now need to test whether the space behind the defender is empty or not
		var cellBehindDefender = Utils.getPositionBehindSecondPointFromFirst(attackerPos, targetPos);
	
		var actors = this._level.getActors();
	
		var cellActor = this._level.getActors().getElementFromValues(cellBehindDefender[0], cellBehindDefender[1]);
	
		if(this._level.getMap().canWalk(cellBehindDefender[0], cellBehindDefender[1]) && cellActor === null)
		{				
			this.addAction(new Action(_currentTarget, Action.MOVE_WAIT, [[ _currentTarget ], [cellBehindDefender], this._level] ) );	
		
			// Add a new gameEvent to move the actor
			/*var newMoveGameEvent = new GameEvent(_currentTarget, GameEvent.MOVEMENT, [cellBehindDefender, this._level]);
		
			// Add it to the actor so the renderer can display the gameEvent 
			_currentTarget.addGameEvent(newMoveGameEvent);		
			
			this._addGameEvent( newMoveGameEvent );*/
		}	
		// At the moment just increase the damage to the defender by 1
		else
		{
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
				damage = this._knockbackStuff(currentAction, currentTarget, damage);
													
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
			
			// If the target has a counter attack then add it here CURRENTLY REMOVED, BUT WILL PUT BACK IN *********
			if( currentTarget.isActorAlive() === true && false) // && currentTarget.isHasCounterAttack() )
				this.addAction(new Action(currentTarget, Action.ATTACK, [[ currentAction.getActor() ]]) ); 					
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
			
			/*if(currentAction.getActionType() === Action.MOVE_WAIT)
				gameEventType = GameEvent.MOVEMENT_WAIT;*/
	
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
		// We put a slight delay between actions
		TweenMax.delayedCall(Globals.DELAY_BETWEEN_ACTIONS, this._processAction, [], this);		
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
		
		// TweenMax.delayedCall(this._afterAnimWaitTime, this._endCallback, [], this);
		//this._afterAnimWaitTime
							
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

