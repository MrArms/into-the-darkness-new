
goog.provide( "tt.AI" );

//===================================================
// Constructor
//===================================================

// _args is an array of arguments
AI = function()
{
	
}

var p = AI.prototype;

//===================================================
// Variables
//===================================================

AI.MONSTER_AWARENESS_RANGE = 200; //10;
AI.MAX_MONSTER_PATH_LENGTH = 200; //10;

AI.globalPathStorage = null;
AI.globalAlignmentVariable = null;

//===================================================
// Public Methods
//===================================================

// This will eventually take in the map too, but currently just attacks the player ****
AI.getMove = function(_actor, _allActors, _player, _level, _map)
{		
	var actorPos = _actor.getPosition();
	var playerPos = _player.getPosition();
	
	var distance = Utils.getDistanceBetweenMapPoints(actorPos, playerPos);
	
	// If the monster is too far away from the player then just return and don't do anything
	if(distance > AI.MONSTER_AWARENESS_RANGE)
	{
		return null;
	}
	
	//AI.globalPathStorage = [];
	AI._getPathBetweenTwoPoints(actorPos, playerPos, _map, _allActors, _actor.getAlignment());

	// Path is too long for the monster to bother with or a path cannot be found at all
	if(AI.globalPathStorage.length > AI.MAX_MONSTER_PATH_LENGTH || AI.globalPathStorage.length <= 1)
	{
		return null;
	}
	// Here if the monster is one tile away then he'll attack
	else if(AI.globalPathStorage.length === 2)
	{
		// return (new Action(_actor, Action.ATTACK, [[ playerPos ]] ) );		   
		return (new Action(_actor, Action.ATTACK, [[ _player ]] ) );		   
	}
	else
	{
		return (new Action(_actor, Action.MOVE, [[_actor ], [[ AI.globalPathStorage[1].x, AI.globalPathStorage[1].y]], _level] ));
	}			
}

//===================================================
// Private Methods
//===================================================


AI.passableCallback = function(_x, _y, actorPos, _map, _allActors)
{
	// Can always pass through the cell they are standing in currently!!!
	if(_x === actorPos[0] && _y === actorPos[1])
		return true;

	// Need to make sure the monster doesn't attack his friends
	var hasFriendInAdjacentCell = false;
	
	// Check for actor in the cell
	
	// Only bother if the friend is directly adjacent (otherwise keeping moving towards target)
	if(Utils.distanceBetweenTwoPoints(actorPos, [_x, _y]) === 1)
	{
		var otherActor = _allActors.getElementFromValues(_x ,_y);
		if(otherActor !== null)
			hasFriendInAdjacentCell = (otherActor.getAlignment() === AI.globalAligntmentVariable); //isBad();			
	}
	
	return (_map.canWalk(_x ,_y) && !hasFriendInAdjacentCell); 

}

AI._getPathBetweenTwoPoints = function(_startPosition, _destination, _map, _allActors, _alignment)
{
	AI.globalPathStorage = [];
	
	AI.globalAligntmentVariable = _alignment;
	
	var passableCallback = function(_x, _y) 
	{ 			
		// Yes I know this is a horrible way of doing this - need simplifying and combining with the AI.passableCallback method above ****
		var returnVariable = AI.passableCallback(_x, _y, _startPosition, _map, _allActors);			
		return returnVariable;			
	}

	var dijkstra = new ROT.Path.Dijkstra(_destination[0], _destination[1], passableCallback);

	dijkstra.compute(_startPosition[0], _startPosition[1], function(_x ,_y){AI.globalPathStorage.push( {x:_x, y:_y} ) } );

}

//===================================================
// Events
//===================================================

