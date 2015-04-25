
goog.provide( "tt.GameGlobals" );

goog.require( "tt.Globals" );
goog.require( "tt.Effect" );


var GameGlobals = {};

GameGlobals.visionRadius = 10;

GameGlobals.MAX_CHARMS = 50;
GameGlobals.START_CHARMS = 40;
GameGlobals.MAX_DIFFERENT_CHARMS = 10;

GameGlobals.MAX_CHARMS_SELECTED = 3;

GameGlobals.walkableTiles = ['.', '>', '<'];
GameGlobals.lightPasses = ['.', '>', '<'];

GameGlobals.actorsData = {};

/*GameGlobals.actorsData["@"] = {max_hp:50, base_attack:3, base_defence:1, speed:Actor.NORMAL_SPEED, alignment:"GOOD", name:"Player", colour:Globals.COLOUR_WHITE, 
																															effects:[
																																	{name:Effect.ATTACK, value:1},
																																	{name:Effect.COUNTER_ATTACK},
																																	]};*/
																																
GameGlobals.actorsData["@"] = {max_hp:50, base_strength:2, base_defence:1, base_magic:1, base_faith:1, base_will:1, base_speed:Actor.NORMAL_SPEED, alignment:"GOOD", name:"Player", colour:ColourGlobals.COLOUR_WHITE, effects:[]};
																																			
GameGlobals.actorsData["A"] = {max_hp:3, base_strength:2, base_defence:1, base_magic:1, base_faith:1, base_will:1, base_speed:Actor.NORMAL_SPEED, alignment:"BAD", name:"Alan", colour:ColourGlobals.COLOUR_CYAN, effects:[]}; //{name:Effect.COUNTER_ATTACK}]};



