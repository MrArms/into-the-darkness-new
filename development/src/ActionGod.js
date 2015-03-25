
goog.provide( "tt.ActionGod" );

goog.require( "tt.Attack" );
goog.require( "tt.GameEvent" );

//===================================================
// Constructor
//===================================================


ActionGod = function()
{
	this._init();
}

var p = ActionGod.prototype;

//===================================================
// Variables
//===================================================

p._actionQueue = null;

// A list of gameEvents which are things that happen to an actor that also can be grabbed by the renderer to animate
// When the animations have played on the actors then the actors get updated with the event
// Game events contain the actor that the event is on
p._gameEventList = null;

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

//===================================================
// Private Methods
//===================================================

p._reset = function()
{
	this._actionQueue = [];
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
			
			// Show the attacker is attacking
			var newAttackGameEvent = new GameEvent(currentAction.getActor(), GameEvent.ATTACK, []);
			
			// Add it to the actor so the renderer can display the gameEvent 
			currentAction.getActor().addGameEvent(newAttackGameEvent);			
			this._gameEventList.push( newAttackGameEvent );
			
			// Show the target is hit
			var newDamageGameEvent = new GameEvent(currentTarget, GameEvent.DAMAGE, [damage]);
						
			// Add it to the actor so the renderer can display the gameEvent 			
			currentTarget.addGameEvent(newDamageGameEvent);				
			this._gameEventList.push( newDamageGameEvent );											
			
			// If the target has a counter attack then add it here 
			if( currentTarget.isActorAlive() === true && currentTarget.isHasCounterAttack() )
				this.addAction(new Action(currentTarget, Action.ATTACK, [[ currentAction.getActor() ]]) ); 					
		}	
		
		// If it is a double blow then add the original attack again here
	}
	else if(currentAction.getActionType() === Action.STATUS)
	{			
		var newGameEvent = currentAction.getStatus().getGameEventFromStatus(currentAction.getActor());
		currentAction.getActor().addGameEvent(newGameEvent);
		this._gameEventList.push( newGameEvent );	
	}
	
	// Need a callback here for when the animations have been completed, for now we are going to use a tween with a standard animation delay
	//				but eventually we might want a more custom method for each animation type 
	TweenMax.delayedCall(Globals.GAME_EVENT_ANIM_LENGTH, this._resolveAction, [], this);

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
					
	// if we have any actions left then we need to start the next one in the queue
	// Check the actor to perform the action is still alive too
	if(this._actionQueue.length > 0)
	{
		// We put a slight delay between actions
		TweenMax.delayedCall(Globals.DELAY_BETWEEN_ACTIONS, this._processAction, [], this);		
	}
	// Otherwise tell the game that the "turn" that contained all the actions in the actionQueue (and any ones subsequently added to it) has completely finished
	else
	{
		this._reset();
		this._endCallback();					
	}
}

p._init = function()
{	
	this._reset();
}

//===================================================
// Events
//===================================================

