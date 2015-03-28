
goog.provide( "tt.Game" );

goog.require( "tt.Actor" );
goog.require( "tt.Action" );
goog.require( "tt.ActionGod" );
goog.require( "tt.Renderer" );
goog.require( "tt.Utils" );
goog.require( "tt.Status" );
goog.require( "tt.AI" );
goog.require( "tt.TurnManager" );
goog.require( "tt.Globals" );
goog.require( "tt.GameGlobals" );
goog.require( "tt.Level" );
goog.require( "tt.LevelMap" );



//===================================================
// Constructor
//===================================================

Game = function()
{
	this._init();
}

var p = Game.prototype;

//===================================================
// Variables
//===================================================

p._player = null;

p._doRenderMap = null;

p._controlsLocked = null;
// p._actors = null;
p._currentActor = null;

p._levels = null;
p._currentLevelIndex = null;

p._actionGod = null;
p._renderer = null;

p.FPS = 60;


p.CONTROL_MOVEMENT = "movement";
p.CONTROL_NO_MOVE = "no_move";

p._keyMap = {};

p._keyMap[ROT.VK_NUMPAD8] = {controlType:p.CONTROL_MOVEMENT, direction:0};
p._keyMap[ROT.VK_NUMPAD9] = {controlType:p.CONTROL_MOVEMENT, direction:1};
p._keyMap[ROT.VK_NUMPAD6] = {controlType:p.CONTROL_MOVEMENT, direction:2}; 
p._keyMap[ROT.VK_NUMPAD3] = {controlType:p.CONTROL_MOVEMENT, direction:3};
p._keyMap[ROT.VK_NUMPAD2] = {controlType:p.CONTROL_MOVEMENT, direction:4}; 
p._keyMap[ROT.VK_NUMPAD1] = {controlType:p.CONTROL_MOVEMENT, direction:5};
p._keyMap[ROT.VK_NUMPAD4] = {controlType:p.CONTROL_MOVEMENT, direction:6}; 
p._keyMap[ROT.VK_NUMPAD7] = {controlType:p.CONTROL_MOVEMENT, direction:7}; 

p._keyMap[ROT.VK_NUMPAD5] = {controlType:p.CONTROL_MOVEMENT, direction:p.CONTROL_NO_MOVE}; 

//===================================================
// Public Methods
//===================================================


//===================================================
// Private Methods
//===================================================

p._init = function()
{	
	this._controlsLocked = true;
	
	this._doRenderMap = false;

	this._renderer = new Renderer();
	
	this._actionGod = new ActionGod();
	
	this._handle = this; // Why do we need this exactly?	
	window.addEventListener('keydown', function(e) { this._handle._keydownHandler(e); }.bind(this), false);
			
	// Initialise the player
	this._player = new Actor("@"); //500, Actor.NORMAL_SPEED, false, true)
	
	// Create first level
	this._currentLevelIndex = 1;
	this._levels = [];
	this._levels.push(new Level(1));
	
	setInterval(this._onTimerTick.bind(this), 1000 / this.FPS); // 33 milliseconds = ~ 30 frames per sec
									
	// Starts the first monster to move
	this._startLevel();
}

p._getCurrentLevel = function()
{
	return this._levels[this._currentLevelIndex - 1];
}

// Eventually we'll have an array of levels etc.
p._startLevel = function()
{
	// Add the player to the level
	this._getCurrentLevel().addPlayer(this._player);
	
	// Need to update the map viewable tiles from the player position
	//this._getCurrentLevel().getMap().updateViewableTiles(this._player.getPosition()[0], this._player.getPosition()[1]);
	
	// Need to set the renderer camera position to the player position
	//this._renderer.setMapCameraPosition(this._player.getPosition()[0], this._player.getPosition()[1]);
	
	// Set the initial actor times (player gets first move)
	this._getCurrentLevel().initialiseActorTimers();
			
	// Update the visible part of the map
	this._updateVisibleMapFromPlayerPosition();
			
	// Let the renderer draw the map
	//this._doRenderMap = true;
		
	this._nextTurn();	
}

p._updateVisibleMapFromPlayerPosition = function()
{
	// Stop the renderer drawing the map whilst we recalculate the viewable tiles
	this._doRenderMap = true;

	// Need to update the map viewable tiles from the player position
	this._getCurrentLevel().getMap().updateViewableTiles(this._player.getPosition()[0], this._player.getPosition()[1]);
	
	// Need to set the renderer camera position to the player position
	this._renderer.setMapCameraPosition(this._player.getPosition()[0], this._player.getPosition()[1]);
	
	// Let the renderer draw the map
	this._doRenderMap = true;
}

p._nextTurn = function()
{		
	// Considering putting this logic into the level *******
	this._currentActor = TurnManager.getNextActor(this._player, this._getCurrentLevel().getActors());	
	this._currentActor.turnStarted();
	
	// Unlock the controls for the player turn
	if(this._currentActor.isPlayer())
	{
		this._controlsLocked = false;
	}
	// Otherwise get the AI move and start to perform it
	else
	{
		var monsterMove = AI.getMove(this._currentActor, this._getCurrentLevel().getActors(), this._player, this._getCurrentLevel(), this._getCurrentLevel().getMap());
	
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

p._interpretPlayerMove = function(_keyCode)
{			
	// Lock the controls while we resolve this command first
	this._controlsLocked = true;

	if(_keyCode.controlType === this.CONTROL_MOVEMENT)
	{					
		if(_keyCode.direction == this.CONTROL_NO_MOVE)
		{
			this._turnFinished();
		}
		else
		{					
			var diff = ROT.DIRS[8][_keyCode.direction];			

			var oldPos = this._player.getPosition();
	
			var newCol = oldPos[0] + diff[0];
			var newRow = oldPos[1] + diff[1];
			
			var tempActors = this._getCurrentLevel().getActors();
			
			// Check the new position is walkable and if so check whether there is an enemy there instead			
			if(this._getCurrentLevel().getMap().canWalk(newCol, newRow))
			{
				var actor = tempActors.getElementFromValues(newCol, newRow);
			
				if(actor !== null)
				{
					// Check whether the alignment of the actor is the same or different to the player
					// If it is different then attack the actor
					if( this._player.getAlignment() !== actor.getAlignment() )
					{
						// Eventually we will get the attack targets using skills and status data
						var targets = Attack.getAttackTargets(this._player, tempActors, [newCol, newRow], Attack.SINGLE_TARGET_PATTERN);
					
						this._actionGod.addAction(new Action(this._currentActor, Action.ATTACK, [targets] ) );	
						this._actionGod.startAction(this._turnActionFinished.bind(this) );
					}
					else
					{												
						// Just unlock controls for the moment (as you haven't made a move since we do nothing to friendly actors)
						this._controlsLocked = false;					
					}
				}
				// Here the cell is empty and walkable and so we can move into it
				else
				{
					// Need to create an action and gameEvent here somehow :/
					this._actionGod.addAction(new Action(this._currentActor, Action.MOVE, [[ this._player ], [[newCol, newRow]], this._getCurrentLevel()] ) );	
					this._actionGod.startAction(this._turnActionFinished.bind(this) );	
				}
			}			
			// We are trying to walk into an unwalkable cell here 
			else
			{
				// Perhaps create an animation that does not end the actors turn here ***
				
				// Just unlock controls for the moment *****
				this._controlsLocked = false;
			}
			
			// this._getCurrentLevel().interpretPlayerMove(this._player, diff);					
		}			
	}
	// Command not recognised, so set the controls to unlocked to wait for player command again
	else
	{
		this._controlsLocked = false;
	}

	// Need to create an action here - temporary - will eventually poll the controls to determine this *****
	// this._actionGod.addAction(new Action(this._currentActor, Action.ATTACK, [[ this._getCurrentLevel().getActors[1]]] ) );	
	// this._actionGod.startAction(this._turnActionFinished.bind(this) );	
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
	
	// Slight delay before letting the next character move
	// At the moment this is set to 0 as it is annoying, perhaps we will have a delay only after certain actions that we want a pause afterwards
	//						so that the player can see what is going on more clearly
	TweenMax.delayedCall(Globals.END_TURN_DELAY, this._nextTurn, [], this);
}

p._removeDeadActors = function()
{
	// for(var i=this._getCurrentLevel().getActors().length - 1; i>= 0; i--)
			
	for( var key in this._getCurrentLevel().getActors().getData() )
	{
		var actors = this._getCurrentLevel().getActors();
	
		//var test = actors.getElementFromKey(key);
		
		if(actors.getElementFromKey(key).isActorAlive() === false)		
			actors.removeElementByKey(key);	
	}
}

//===================================================
// Events
//===================================================

p._onTimerTick = function(e)
{		
	if(this._doRenderMap === true)
	{
		// Make sure we aren't in the middle of recalculating fov 
		if(this._getCurrentLevel().getMap().canDraw() === true)
			this._renderer.update(this._getCurrentLevel().getMap(), this._getCurrentLevel().getActors());
	}
}

p._keydownHandler = function(e)
{
	if(this._controlsLocked === false)
	{
		var code = e.keyCode;		
 
		if (!(code in this._keyMap)) { return; }
		else	
			this._interpretPlayerMove(this._keyMap[code]);
	}
}