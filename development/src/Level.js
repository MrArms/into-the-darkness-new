
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
	// this._actors.unshift(_player);
				
	var startPos = this._map.getStartPos();
	
	this._setActorPosition(_player, startPos[0], startPos[1]);	
}

p.initialiseActorTimers = function()
{	
	for(var key in this._actors.length)
	{
		if(this._actors[key].isPlayer())
			this._actors[key].setMoveTimerToPlayerStart();
		else	
			this._actors[key].setMoveTimerToMonsterStart();				
	}
}

p.getMap = function()
{
	return this._map;
}

p.moveActor = function(_actor, _newPosition)
{
	if(this._actors.hasElement(_newPosition[0], _newPosition[1]) === false)
	{
		var oldPos = _actor.getPosition();
	
		this._actors.setElement(_actor, _newPosition[0], _newPosition[1]);
		this._actors.removeElementFromValues(oldPos[0], oldPos[1]);
		
		_actor.setPosition(_newPosition[0], _newPosition[1]);
	}
	else
		Utils.console("ERROR! Moving an actor but there is already something in the destination cell");

}

//===================================================
// Private Methods
//===================================================

p._setActorPosition = function(_actor, _col, _row)
{
	if(this._actors.getElementFromValues(_col, _row) !== null)
		Utils.console("Error! Adding actor to position but there is already something there");
		
	_actor.setPosition(_col, _row );
	this._actors.setElement(_actor, _col, _row);
}

p._createMonsters = function()
{
	// Initialise test monsters
	/*this._actors.push(new Actor(2,4, 20, Actor.NORMAL_SPEED, true, false)); // counter	
	this._actors.push(new Actor(3,4, 15, Actor.FAST_SPEED, false, false)); 
	this._actors.push(new Actor(4,4, 10, Actor.SLOW_SPEED, false, false)); 
	
	// Here add the status effects to the player and monsters to test 
	this._actors[0].addStatus(Status.POISON, 3);
	this._actors[0].addStatus(Status.REGEN, 7);
	
	this._actors[1].addStatus(Status.POISON, 2);
	this._actors[1].addStatus(Status.REGEN, 1);*/
}

p._init = function()
{	
	this._map = new LevelMap(this._levelIndex);

	//this._actors = [];		
	this._actors = new CellDataObject();		
	
	// this._createMonsters();
	
}

//===================================================
// Events
//===================================================

