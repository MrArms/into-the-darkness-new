
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


//===================================================
// Public Methods
//===================================================

// This will eventually take in the map too, but currently just attacks the player ****
AI.getMove = function(_actor, _player)
{		
	return new Action(_actor, Action.ATTACK, [[ _player ]] )	
}

//===================================================
// Private Methods
//===================================================



//===================================================
// Events
//===================================================
