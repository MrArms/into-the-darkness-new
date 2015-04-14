
goog.provide( "tt.Actor" );

goog.require( "tt.Effect" );
goog.require( "tt.CharmGlobals" );

//===================================================
// Constructor
//===================================================

Actor = function()
{
	this._init();
}

var p = Actor.prototype;

//===================================================
// Variables
//===================================================

Actor.FAST_SPEED = 4;
Actor.NORMAL_SPEED = 2;
Actor.SLOW_SPEED = 1;
Actor.NO_SPEED = 0;

Actor.TIMER_MAX = 100;
Actor.TIMER_TICK = 1;

Actor.TIMER_MONSTER_START = 1;
Actor.TIMER_PLAYER_START = 100;

// This will store any data that needs to be saved as is
p._data = null;

// Innate effects
p._innateEffects = null;

// This stores effects from your charms
p._charmEffects = null;
// This stores temporary charms effects that get copied to the charmEffects at the end of the turn
// We need these because we might keep swapping the charms selected and want to update the values in the UI
// 		but we only want to add them to the list when the turn ends and the selection is made definite
p._tempCharmEffects = null;

p._statusArray = null;

p._currentGameEvent = null;

//===================================================
// Public Methods
//===================================================

p.create = function(_char)
{
	this._data._char = _char;
	this._data._isPlayer = _char === "@";
	
	this._data._colour =  GameGlobals.actorsData[this.getChar()].colour;
	
	this._data._alignment = GameGlobals.actorsData[this.getChar()].alignment;
	
	this._data._maxHP = GameGlobals.actorsData[this.getChar()].max_hp;
	this._data._currentHP = this._data._maxHP;
	
	this._data._baseSpeed = GameGlobals.actorsData[this.getChar()].speed;
	this._data._currentSpeed = this._data._baseSpeed;
			
	this._data._baseAttackBonus = GameGlobals.actorsData[this.getChar()].base_attack;	
	this._data._currentAttackBonus = this._data._baseAttackBonus;
	
	this._data._baseDefenceBonus = GameGlobals.actorsData[this.getChar()].base_defence;	
	this._data._currentDefenceBonus = this._data._baseDefenceBonus;
	
	this._data._enemiesKilledThisTurn = 0;
	this._data._enemiesKilledThisPass = 0; // This is for adrenaline
	this._data._enemiesKilledLastTurn = 0;
	
	this.addInnateEffects();
}

p.addStatus = function(_statusType, _timer)
{
	// Need to search to see if the status is already active and if so add it to the timer	
	var alreadyActive = false;
	
	for(var i=0; i<this._statusArray.length; i++)
	{
		if(this._statusArray[i].getStatusType() === _statusType)
		{
			this._statusArray[i].increaseTimer(_timer);
			
			alreadyActive = true;		
		}
	}
	
	// We don't already have the status active so add it to the status array here
	if(alreadyActive === false)
	{
		var newStatus = new Status();
		newStatus.create(_statusType, _timer);
	
		this._statusArray.push(newStatus);
	}	
}

// These are stored and re-applied each turn (designed to be used by monsters rather than the player, but the player can have them for testing)
p.addInnateEffects = function()
{
	// This is an array of effects that get re-applied every time the actor values are updated
	this._innateEffects = [];

	for(var i=0; i< GameGlobals.actorsData[this.getChar()].effects.length; i++)	
	{
		var newEffect = new Effect();
		newEffect.create(GameGlobals.actorsData[this.getChar()].effects[i], -1);	
		this._innateEffects.push(newEffect);
	}
}

// Get the current actions associated with active status' and return them all in order to be processed by the actionGod
p.getEndTurnStatusActions = function()
{
	var returnActionArray = [];
		
	for(var i=0; i<this._statusArray.length; i++)
	{	
		var newAction = this._statusArray[i].getAction(this);
	
		// Regen should always be before poison etc.
		if(this._statusArray[i].getStatusType() === Status.REGEN)		
			returnActionArray.unshift(newAction);
		// Other status' go on at the end
		else if(this._statusArray[i].getStatusType() === Status.POISON)	
		{
			returnActionArray.push(newAction);	
		}		
	}

	return returnActionArray;
}

// Made much more complicated by adrenaline
p.turnStarted = function()
{	
	// Clear old temporary charm effects
	this._tempCharmEffects = [];
		
	var adrenalineKill = false;	
		
	if(this.hasEffect(Effect.ADRENALINE))
	{
		adrenalineKill = (this._data._enemiesKilledThisPass > 0);
		
		this._data._enemiesKilledThisTurn += this._data._enemiesKilledThisPass;		
		this._data._enemiesKilledThisPass = 0;
	}
	
	// Reset enemies killed if we haven't made an adrenaline kill
	if(adrenalineKill === false)
	{
		this._data._enemiesKilledLastTurn = this._data._enemiesKilledThisTurn;
		this._data._enemiesKilledThisTurn = 0;
	}
	
	// Update charm effects here - it should remove all the charms currently as they only last 1 turn, but we could introduce longer charm effects eventually
	for(var i=this._charmEffects.length - 1; i>=0; i--)
	{
		if(adrenalineKill === false || !this._charmEffects[i].getEffectType() === Effect.ADRENALINE)
		{	
			this._charmEffects[i].reduceTimer();
		
			if(this._charmEffects[i].isActive() === false)
				this._charmEffects.splice(i, 1);
		}
	}	
}

p.turnFinished = function()
{
	this._currentGameEvent = null;

	// Copy the temp charm effects to the stored ones in this._charmEffects
	for(var i=0; i<this._tempCharmEffects.length; i++)	
		this._charmEffects.push(this._tempCharmEffects[i]);
		
	// Now remove the temp charm effects here
	this._tempCharmEffects = [];
				
	// Update status and anything else that needs to be done after the turn
	for(var i=this._statusArray.length - 1; i>=0; i--)
	{
		this._statusArray[i].reduceTimer();
		
		if(this._statusArray[i].isActive() === false)
			this._statusArray.splice(i, 1);		
	}		
	
	// Don't reset the timer if 
	if(!this.hasEffect(Effect.ADRENALINE) || this._data._enemiesKilledThisPass === 0)
	{			
		// Reset the move counter
		this._resetMoveTimer(); 
	}
	else
	{
		
	}
}


// This adds a game event to the actor, but doesn't yet apply it
//		it is used by the renderer to show an animation
// 	
p.addGameEvent = function(_gameEvent)
{
	if(this._currentGameEvent !== null)
	{
		if(this._currentGameEvent.getEventType() !== _gameEvent.getEventType())
		{		
			Utils.console("Error - adding gameEvent of different type to actor, but it already has one - see below to details");
			Utils.console("Old gameEvent type: " + this._currentGameEvent.getEventType() + "   new gameEvent type: " + _gameEvent.getEventType());			
		}
		else
		{
			// So we have a gameEvent that is the same as the gameEvent already on an actor
			// This is ok because an actor can say hit more than one enemy on the same turn so will get multiple attack gameEvents called on it
		}
	}

	this._currentGameEvent = _gameEvent;
}

// Called by using a gameEvent from ActionGod
p.damage = function(_amount)
{
	this._data._currentHP = Math.max(0, this._data._currentHP - _amount);
	
	if(this._data._currentHP <= 0)
		this._kill();
}

// Called by using a gameEvent from ActionGod
p.heal = function(_amount)
{
	this._data._currentHP = Math.min(this._data._maxHP, this._data._currentHP + _amount);
}

// This updates all values (at the moment just attack and defence bonus) from the status effects, 
//					current charms selected, extra bonuses (monsters killed last turn etc.) and bonuses from the map (eg. number actors adjacent)
// Charms are only applied temporarily until the end of the turn when they are added to this._charmEffects to continue to work until the start of the next turn
p.updateValuesFromLevel = function(_level) 
{
	// Reset values first
	this._data._currentAttackBonus = this._data._baseAttackBonus;
	this._data._currentDefenceBonus = this._data._baseDefenceBonus;
		
	this._updateNumberAdjacentActors(_level.getActors());
			
	// IF WE WANT TO APPLY STATUSES TO THE ACTORS HERE TOO ***
	// this.updateValuesFromStatus
			
	var allEffects = this._getAllEffects(); 
			
	// Now apply the effects in order	
	for(var i=0; i<allEffects.length; i++)		
		allEffects[i].applyEffectToActor(this);
	
		//this._updateValuesFromEffect(allEffects[i]);	
}

// This gets called when the actor makes a kill
p.madeKill = function()
{
	if(this.hasEffect(Effect.ADRENALINE))
		this._data._enemiesKilledThisPass += 1;
	else
		this._data._enemiesKilledThisTurn += 1;							
}

p.hasEffect = function(_effectName)
{
	var allEffects = this._getAllEffects(); 

	for(var i=0; i<allEffects.length; i++)		
		{
			if(allEffects[i].getEffectType() === _effectName)
				return true;			
		}
		
	return false;			
}

p.updateValuesFromStatus = function(_statusName)
{
	// Statuses caused by effects go in here ***
}

// This sends the charms that the actor has selected and updates the values of the actor
// Currently only used on the player
p.updateSelectedCharms = function(_level, _charmsList)
{
	// If we're being passed the charms list for the player then add them to the effects list here
	// Otherwise just keep the current this._tempCharmEffects
	if(_charmsList && _charmsList !== null)
	{
		// Clear old temporary charm effects
		this._tempCharmEffects = [];
	
		for(var i=0; i<_charmsList.length; i++)
		{
			var charmData = CharmGlobals.data[_charmsList[i]];
		
			if(charmData && charmData !== null)
			{	
				for(var j=0; j<charmData.effects.length; j++)	
				{					
					var newEffect = new Effect();
					newEffect.create(charmData.effects[j]);
				
					// Add the the temp charm effect list to be copied to the actual charm effects when the turn ends
					this._tempCharmEffects.push(newEffect);										
					//this._tempCharmEffects.push(new Effect(charmData.effects[j]) );										
				}
			}
			else
				Utils.console("Error, cannot find effect data for: " + _charmsList[i]);							
		}
	}
	
	this.updateValuesFromLevel(_level); //_map, _actors) //, _charmsList);
}

//===================================================
// Private Methods
//===================================================

p._init = function()
{			
	// This will store any data that we want to save in the same form
	this._data = {};
	
	this._setActorAlive(true);
	this._resetMoveTimer();
		
	// There are no charms active at the moment
	this._charmEffects = [];	
	this._tempCharmEffects = [];	
	this._innateEffects = [];
	
	this._tempCharmEffects = [];
	
	this._statusArray = [];
	
	this._currentGameEvent = null;
}

p._getAllEffects = function() 
{
	// This is like the "effect" list in the charms (so not the same as a charm)	
	var allEffects = [];
	
	for(var i=0; i< this._innateEffects.length; i++)	
		allEffects.push(this._innateEffects[i]);	
		
	// At the moment charm effects only last 1 turn so this array should be empty now (as they would have been cleared at the start of the turn)
	//	However we might add longer charm effects later on
	for(var i=0; i< this._charmEffects.length; i++)	
		allEffects.push(this._charmEffects[i]);	
			
	for(var i=0; i< this._tempCharmEffects.length; i++)	
		allEffects.push(this._tempCharmEffects[i]);			
	
	return allEffects;
}

p._updateNumberAdjacentActors = function(_actors)
{
	this._data._numberActorsAdjacent = 0;

	var adjacentCellKeys = Utils.getCellsSurroundingCell(this._data._col, this._data._row);
	
	for(var i=0; i<adjacentCellKeys.length; i++)
	{
		var actorTest = _actors.getElementFromKey(adjacentCellKeys[i]);
	
		if(actorTest !== null && actorTest.isActorAlive() === true)		
			this._data._numberActorsAdjacent += 1;		
	}
}

p._kill = function()
{
	this._setActorAlive(false);

	// this._data._isAlive = false;
}

//===================================================
// Events
//===================================================

//===================================================
// GETTERS & SETTERS
//===================================================

p.getChar = function() { return this._data._char; }

p.getColour = function() { return this._data._colour; }

p.isPlayer = function() { return this._data._isPlayer; }

p.setMoveTimerToPlayerStart = function() { this._data._moveTimer = Actor.TIMER_PLAYER_START; }

p.setMoveTimerToMonsterStart = function() { this._data._moveTimer = Actor.TIMER_MONSTER_START;}

p.increaseMoveTimerTick = function() { this._data._moveTimer += (this._data._currentSpeed * Actor.TIMER_TICK); }

p._resetMoveTimer = function() {this._data._moveTimer = 0;}

p.isReadyToMove = function() { return (this._data._isAlive === true && this._data._moveTimer >= Actor.TIMER_MAX); }

p._setActorAlive = function(_alive) {this._data._isAlive = _alive;}

p.isActorAlive = function() { return this._data._isAlive; }

p.getPosition = function() { return [this._data._col, this._data._row]; }

p.setPosition = function(_col, _row)
{		
	this._data._col = _col;
	this._data._row = _row;
}

p.getCurrentHP = function() { return this._data._currentHP;}

p.getMaxHP = function() { return this._data._maxHP;}

p.getEnemiesKilledThisTurn = function(){ return this._data._enemiesKilledThisTurn; }

p.getCurrentAttackBonus = function() { return this._data._currentAttackBonus; }
p.getCurrentDefenceBonus = function() { return this._data._currentDefenceBonus; }

p.setCurrentAttackBonus = function(_value) { this._data._currentAttackBonus = _value; }
p.setCurrentDefenceBonus = function(_value) { this._data._currentDefenceBonus = _value; }

p.getNumberActorsAdjacent = function() { return this._data._numberActorsAdjacent; }

p.getAlignment = function() { return this._data._alignment; }

// The renderer looks for this to see whether there is any gameEvents to render (eg. damage etc.)
p.getGameEvent = function() { return this._currentGameEvent; }

p.removeGameEvent = function() { this._currentGameEvent = null; }

//===================================================
// LOADING & SAVING
//===================================================

p.getSaveObject = function()
{
	var saveObject = {};
	
	saveObject._data = Utils.copyObject(this._data);
	
	saveObject._statusArray = [];
	
	for(var i=0; i<this._statusArray.length; i++)	
		saveObject._statusArray.push(this._statusArray[i].getSaveObject());
		
	saveObject._innateEffects = [];
	
	for(var i=0; i<this._innateEffects.length; i++)	
		saveObject._innateEffects.push(this._innateEffects[i].getSaveObject());
		
	saveObject._charmEffects = [];
	
	for(var i=0; i<this._charmEffects.length; i++)	
		saveObject._charmEffects.push(this._charmEffects[i].getSaveObject());
		
	return saveObject; 
}

p.restoreFromSaveObject = function(_saveObject)
{
	this._data = Utils.copyObject(_saveObject._data);
	
	for(var i=0; i<_saveObject._statusArray.length; i++)	
	{
		var status = new Status();
		status.restoreFromSaveObject(_saveObject._statusArray[i]);
		this._statusArray.push(status);
	}

	for(var i=0; i<_saveObject._innateEffects.length; i++)	
	{
		var effect = new Effect();
		effect.restoreFromSaveObject(_saveObject._innateEffects[i]);
		this._innateEffects.push(status);
	}

	for(var i=0; i<_saveObject._charmEffects.length; i++)	
	{
		var effect = new Effect();
		effect.restoreFromSaveObject(_saveObject._charmEffects[i]);
		this._charmEffects.push(status);
	}
	
}