
goog.provide( "tt.TurnManager" );

//===================================================
// Constructor
//===================================================

// _args is an array of arguments
TurnManager = function()
{
	//this._init();
}

var p = TurnManager.prototype;

//===================================================
// Variables
//===================================================


//===================================================
// Public Methods
//===================================================

TurnManager.getNextActor = function(_player, _actors)
{		
	// Make sure we have some actors existing
	if(_actors.length > 0)
	{
		while(1)
		{		
			var readyReturnObject = this._getActorsReadyToMove(_actors);
		
			// If the player is in the actors who are ready then return the player as the next to move
			if(readyReturnObject.player !== null)		
				return readyReturnObject.player;
			// If we have another actor ready to move
			else if(readyReturnObject.actorsReadyArray.length > 0)
			{
				return (TurnManager._getClosestActorToPlayer(_player, readyReturnObject.actorsReadyArray));
			}		

			// Need to increase actor timers here
			for(var i=0; i<_actors.length; i++)
			{
				_actors[i].increaseMoveTimerTick();
			}			
		}
	}
	else
		Utils.console("Error, no actors so cannot find next one to move");
}

/*TurnManager.actorMoved = function(_actor)
{
	_actor.
}*/

//===================================================
// Private Methods
//===================================================

// This will eventually move the actors closest to the player, but since we have no map currently it just returns the first actor ***
TurnManager._getClosestActorToPlayer = function(_player, _readyActorArray)
{
	return _readyActorArray[0];
}

// Goes through the actors and get an array of those that have timer >= 100
TurnManager._getActorsReadyToMove = function(_actors)
{
	var returnObject = {};
	returnObject.player = null;

	returnObject.actorsReadyArray = [];
	
	for(var i=0; i<_actors.length; i++)
	{
		if(_actors[i].isReadyToMove())	
		{
			// If the player is one of the actors then add it separately here
			if(_actors[i].isPlayer() === true)
				returnObject.player = _actors[i];
			// Don't bother to add the player to the ready actors 
			else
				returnObject.actorsReadyArray.push(_actors[i]);														
		}
	}

	return returnObject;
}

//===================================================
// Events
//===================================================

