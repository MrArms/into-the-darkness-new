
goog.provide( "tt.GameGlobals" );

goog.require( "tt.Globals" );


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
																																	{Effect.ATTACK, value:1},
																																	{Effect.COUNTER_ATTACK},
																																	]};*/
																																	
GameGlobals.actorsData["@"] = {max_hp:50, base_attack:3, base_defence:1, speed:Actor.NORMAL_SPEED, alignment:"GOOD", name:"Player", colour:ColourGlobals.COLOUR_WHITE, effects:[]};
																															
GameGlobals.actorsData["A"] = {max_hp:20, base_attack:2, base_defence:1, speed:Actor.NORMAL_SPEED, alignment:"BAD", name:"Alan", colour:ColourGlobals.COLOUR_CYAN, effects:[]};


