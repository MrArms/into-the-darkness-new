
goog.provide( "tt.Level" );



//===================================================
// Constructor
//===================================================

Level = function(_levelIndex, _leaveLevelCallback, _playerDiesCallback)
{
	this._levelIndex = _levelIndex;
	
	this._leaveLevelCallback = _leaveLevelCallback;
	this._playerDiesCallback = _playerDiesCallback;

	this._init()
}

var p = Level.prototype;

//===================================================
// Variables
//===================================================

p._actors = null;
p._levelIndex = null;

p._leaveLevelCallback = null;
p._playerDiesCallback = null;

p._player = null;

p._currentActor = null;
p._controlsLocked = null;
p._isActive = null;

p._actionGod = null;

p._map = null;

//===================================================
// Public Methods
//===================================================

p.joinLevel = function(_player)
{
	// Add the player to the level
	// this._getCurrentLevel().addPlayer(this._player);
	
	this._addPlayer(_player);
	
	// Set the initial actor times (player gets first move)
	this._initialiseActorTimers();
			
	// Update the visible part of the map
	this._updateVisibleMapFromPlayerPosition();
			
	this._isActive = true;		
			
	this._nextTurn();	
}

p.moveActor = function(_actor, _newPosition)
{
	if(this._actors.hasElement(_newPosition[0], _newPosition[1]) === false)
	{
		this._removeActorFromLevel(_actor);
		
		this._addActorAtPosition(_actor, _newPosition[0], _newPosition[1]);
	}
	else
		Utils.console("ERROR! Moving an actor but there is already something in the destination cell");
}

p.interpretPlayerInput = function(_keyCode)
{
	// If it isn't the players turn or we're already processing his move then ignore the input
	if(this.getControlLock())
		return;
		
	this._setControlLock(true);

	if(_keyCode.direction === Game.CONTROL_NO_MOVE)
	{
		this._turnFinished();
	}
	else if(_keyCode.controlType === Game.CONTROL_MOVEMENT)
	{					
		this._processPlayerMove(_keyCode);
	}	
}

p.update = function()
{
	if(this._isActive)
		this._actionGod.update();
}

//===================================================
// Private Methods
//===================================================

p._processPlayerMove = function(_keyCode)
{
	var diff = ROT.DIRS[8][_keyCode.direction];			

	var oldPos = this._player.getPosition();

	var newCol = oldPos[0] + diff[0];
	var newRow = oldPos[1] + diff[1];

	// Check the new position is walkable and if so check whether there is an enemy there instead			
	if(this._map.canWalk(newCol, newRow))
	{				
		var actor = this._actors.getElementFromValues(newCol, newRow);
	
		if(actor !== null)		
			this._playerMovesIntoOccupiedCell(newCol, newRow, actor);		
		// Here the cell is empty and walkable and so we can move into it
		else		
			this._movePlayerIntoEmptyCell(newCol, newRow);		
	}			
	// We are trying to walk into an unwalkable cell here 
	else
	{
		// Could create an animation that does not end the actors turn just yet here if we wanted
		// Just unlock controls for now
		this._setControlLock(false);
	}		
}

p._playerMovesIntoOccupiedCell = function(_newCol, _newRow, _actor)
{
	// Check whether the alignment of the actor is the same or different to the player
	// If it is different then attack the actor
	if( this._player.getAlignment() !== _actor.getAlignment() )
	{
		// Eventually we will get the attack targets using skills and status data
		var targets = Attack.getAttackTargets(this._player, this._actors, [_newCol, _newRow], Attack.SINGLE_TARGET_PATTERN);
	
		this._actionGod.addAction(new Action(this._currentActor, Action.ATTACK, [targets] ) );	
		this._actionGod.startAction(this._turnActionFinished.bind(this) );
	}
	else
	{												
		// Just unlock controls for the moment (as you haven't made a move since we do nothing to friendly actors)
		this._setControlLock(false);					
	}
}

p._movePlayerIntoEmptyCell = function(_newCol, _newRow)
{
	// Need to create an action and gameEvent here somehow :/
	this._actionGod.addAction(new Action(this._player, Action.MOVE, [[ this._player ], [[_newCol, _newRow]], this] ) );	
	this._actionGod.startAction(this._turnActionFinished.bind(this) );
}

p._leaveLevel = function(_up)
{
	this._isActive = false;
	
	this._removeActorFromLevel(this._player);
	
	this._player = null;
	
	this._leaveLevelCallback(_up);
}

p._addPlayer = function(_player)
{	
	this._player = _player;

	var startPos = this._map.getStartPos();
	
	this._addActorAtPosition(_player, startPos[0], startPos[1]);	
}

p._addActorAtPosition = function(_actor, _col, _row)
{
	if(this._actors.getElementFromValues(_col, _row) !== null)
		Utils.console("Error! Adding actor to position but there is already something there");
		
	_actor.setPosition(_col, _row );
	this._actors.setElement(_actor, _col, _row);
}

p._removeActorFromLevel = function(_actor)
{
	var oldPos = _actor.getPosition();

	this._actors.removeElementFromValues(oldPos[0], oldPos[1]);
}

p._updateVisibleMapFromPlayerPosition = function()
{
	// Need to update the map viewable tiles from the player position
	this._map.updateViewableTiles(this._player.getPosition()[0], this._player.getPosition()[1]);
}

p._initialiseActorTimers = function()
{	
	for(var key in this._actors.length)
	{
		if(this._actors[key].isPlayer())
			this._actors[key].setMoveTimerToPlayerStart();
		else	
			this._actors[key].setMoveTimerToMonsterStart();				
	}
}

p._updateActors = function()
{
	for(var key in this._actors.getData())
	{
		this._actors.getElementFromKey(key).updateValuesFromLevel(this._map, this._actors)
	}
}

p._nextTurn = function()
{		
	// if the level is not active then don't continue with the turns
	if(!this._isActive)
		return;

	this._updateActors();
		
	this._currentActor = TurnManager.getNextActor(this._player, this._actors);	
	this._currentActor.turnStarted();
	
	// Unlock the controls for the player turn
	if(this._currentActor.isPlayer())
	{
		// TEST STUFF
		//this._player.updateSelectedCharms(this._map, this._actors, [Charm.BRAVERY]);
	
		this._setControlLock(false);
	}
	// Otherwise get the AI move and start to perform it
	else
	{
		var monsterMove = AI.getMove(this._currentActor, this._actors, this._player, this, this._map);
	
		// If the monster is going to move then start the move here
		if(monsterMove !== null)
		{				
			this._actionGod.addAction(monsterMove);
			this._actionGod.startAction(this._turnActionFinished.bind(this) );
		}
		// Here the monster is not going to move so just call end turn 
		else
			this._turnFinished();
	}					
}	

// This says the action the actor performed during their turn has finished
p._turnActionFinished = function()
{	
	var newActions = this._currentActor.getEndTurnStatusActions();
	
	for(var i=0; i<newActions.length; i++)	
		this._actionGod.addAction(newActions[i]);
	
	// If we have status actions to perform then do this here, otherwise just end the turn
	if(newActions.length > 0)	
		this._actionGod.startAction(this._turnFinished.bind(this));		
	else
		this._turnFinished();
}

// Here the turn has finished, but we need to update the actors status timers before we can finish completely
p._turnFinished = function()
{
	this._currentActor.turnFinished();
	
	// Need to remove any actors killed this turn here
	this._removeDeadActors();
	
	// Need to update the map viewable tiles here
	this._updateVisibleMapFromPlayerPosition();
	
	// Check for delay after the actions have been resolved - only have a delay for some actions (not move as it would be too annoying)
	if(this._actionGod.getAfterAnimWaitTime() > 0)
		TweenMax.delayedCall(this._actionGod.getAfterAnimWaitTime(), this._nextTurn, [], this);	
	else
		this._nextTurn();	
}

p._removeDeadActors = function()
{
	for( var key in this._actors.getData() )
	{	
		if(this._actors.getElementFromKey(key).isActorAlive() === false)		
			this._actors.removeElementByKey(key);	
	}
}

p._createMonsters = function()
{
	var testNumberMonsters = 1;

	for(var i=0; i<testNumberMonsters; i++)
	{
		var cellPosition = this._map.getFreeCell();
		this._addActorAtPosition(new Actor("A"), cellPosition[0], cellPosition[1]);	
	}
}

p._init = function()
{	
	//this._controlsLocked = true;
	this._setControlLock(true);
	
	this._isActive = false;

	this._actionGod = new ActionGod();

	this._map = new LevelMap(this._levelIndex);
	
	this._actors = new CellDataObject();		
	
	this._createMonsters();	
}

//===================================================
// Events
//===================================================

//===================================================
// GETTERS & SETTERS
//===================================================

p._setControlLock = function(_lock) { this._controlsLocked = _lock; }
p.getControlLock = function() { return this._controlsLocked; }

p.getMap = function() {	return this._map; }

p.getActors = function() { return this._actors; }

p.isLevelActive = function() { return this._isActive; }
