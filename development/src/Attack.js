
goog.provide( "tt.Attack" );

//===================================================
// Constructor
//===================================================

Attack = function()
{


}

//===================================================
// Public Methods
//===================================================

// Currently just returns the damage of the attack - later will include status effects etc.
Attack.resolve = function(_attacker, _defender)
{
	return 3;		
}