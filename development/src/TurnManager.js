
goog.provide( "tt.TurnManager" );

//===================================================
// Constructor
//===================================================

// _args is an array of arguments
TurnManager = function()
{

}

var p = TurnManager.prototype;

//===================================================
// Variables
//===================================================

//===================================================
// Public Methods
//===================================================

TurnManager.getNextActor = function(_player, _actorsCellObject)
{		
	// Make sure we have some actors existing
	//if(_actors.length > 0)
	if(_actorsCellObject.getNumberElements() > 0)
	{
		while(1)
		{		
			var readyReturnObject = this._getActorsReadyToMove(_actorsCellObject);
		
			// If the player is in the actors who are ready then return the player as the next to move
			if(readyReturnObject.player !== null)		
				return readyReturnObject.player;
			// If we have another actor ready to move
			else if(readyReturnObject.actorsReadyArray.length > 0)
			{
				return (TurnManager._getClosestActorToPlayer(_player, readyReturnObject.actorsReadyArray));
			}		

			// Need to increase actor timers here
			for(var key in _actorsCellObject.getData())
			{
				_actorsCellObject.getElementFromKey(key).increaseMoveTimerTick();
			}			
		}
	}
	else
		Utils.console("Error, no actors so cannot find next one to move");
}

//===================================================
// Private Methods
//===================================================

// This will eventually move the actors closest to the player, but since we have no map currently it just returns the first actor ***
TurnManager._getClosestActorToPlayer = function(_player, _readyActorArray)
{
	return _readyActorArray[0];
}

// Goes through the actors and get an array of those that have timer >= 100
TurnManager._getActorsReadyToMove = function(_actorsCellObject)
{
	var returnObject = {};
	returnObject.player = null;

	returnObject.actorsReadyArray = [];
			
	for(var key in _actorsCellObject.getData()) 
	{
		var tempActor = _actorsCellObject.getElementFromKey(key);
	
		if(tempActor.isReadyToMove())	
		{
			// If the player is one of the actors then add it separately here
			if(tempActor.isPlayer() === true)
				returnObject.player = tempActor;
			// Don't bother to add the player to the ready actors 
			else
				returnObject.actorsReadyArray.push(tempActor[key]);														
		}
	}

	return returnObject;
}

//===================================================
// Events
//===================================================

