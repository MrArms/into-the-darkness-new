
goog.provide( "tt.GameGlobals" );

goog.require( "tt.Globals" );


var GameGlobals = {};

GameGlobals.visionRadius = 10;

GameGlobals.MAX_SCROLLS = 30;

GameGlobals.walkableTiles = ['.', '>', '<'];
GameGlobals.lightPasses = ['.', '>', '<'];

GameGlobals.actorsData = {};

/*GameGlobals.actorsData["@"] = {max_hp:50, base_attack:3, base_defence:1, speed:Actor.NORMAL_SPEED, alignment:"GOOD", name:"Player", colour:Globals.COLOUR_WHITE, 
																															effects:[
																																	{name:"bravery", value:1},
																																	{name:"attack", value:1},
																																	]};*/
																																	
GameGlobals.actorsData["@"] = {max_hp:50, base_attack:3, base_defence:1, speed:Actor.NORMAL_SPEED, alignment:"GOOD", name:"Player", colour:Globals.COLOUR_WHITE, effects:[]};
																															
GameGlobals.actorsData["A"] = {max_hp:5, base_attack:2, base_defence:1, speed:Actor.NORMAL_SPEED, alignment:"BAD", name:"Alan", colour:Globals.COLOUR_CYAN, effects:[]};


