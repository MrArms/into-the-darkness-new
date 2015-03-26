
goog.provide( "tt.Level" );



//===================================================
// Constructor
//===================================================

Level = function(_levelIndex)
{
	this._levelIndex = _levelIndex;

	this._init()
}

var p = Level.prototype;

//===================================================
// Variables
//===================================================

p._actors = null;
// p._currentActor = null;
p._levelIndex = null;

p._map = null;

//===================================================
// Public Methods
//===================================================

p.getActors = function()
{
	return this._actors;
}

p.addPlayer = function(_player)
{
	this._actors.unshift(_player);
	
	var startPos = this._map.getStartPos();
	
	_player.setPosition( startPos[0], startPos[1] );		
}

p.initialiseActorTimers = function()
{
	for(var i=0; i < this._actors.length; i++)
	{
		if(this._actors[i].isPlayer())
			this._actors[i].setMoveTimerToPlayerStart();
		else	
			this._actors[i].setMoveTimerToMonsterStart();				
	}
}

p.getMap = function()
{
	return this._map;
}

//===================================================
// Private Methods
//===================================================

p._createMonsters = function()
{
	// Initialise test monsters
	this._actors.push(new Actor(2,4, 20, Actor.NORMAL_SPEED, true, false)); // counter	
	this._actors.push(new Actor(3,4, 15, Actor.FAST_SPEED, false, false)); 
	this._actors.push(new Actor(4,4, 10, Actor.SLOW_SPEED, false, false)); 
	
	// Here add the status effects to the player and monsters to test 
	this._actors[0].addStatus(Status.POISON, 3);
	this._actors[0].addStatus(Status.REGEN, 7);
	
	this._actors[1].addStatus(Status.POISON, 2);
	this._actors[1].addStatus(Status.REGEN, 1);
}

p._init = function()
{	
	this._map = new LevelMap(this._levelIndex);

	this._actors = [];		
	
	// this._createMonsters();
	
}

//===================================================
// Events
//===================================================

