
goog.provide( "tt.CharmGlobals" );

goog.require( "tt.Effect" );

Charm = {};
Charm.BRAVERY = "bravery";
Charm.MIGHT = "might";
Charm.KNOCKBACK = "knockback";
Charm.DOUBLE_BLOW = "double_blow";
Charm.FORTIFY = "fortify";

var CharmGlobals = {};

CharmGlobals.data = {};



// NOTE that when you have multiple effects in a charm they get applied in the order that they are list in

CharmGlobals.data[Charm.MIGHT] = {name:"Attack +2", description:"Increases your attack by 2", 
																					effects:[
																							{name:Effect.ATTACK, value:2}
																							] };

// ADDED ANOTHER ATTACK POINT TO TEST MULTIPLE STATUS EFFECTS *****
CharmGlobals.data[Charm.BRAVERY] = {name:"Bravery", description:"+1 attack for each enemy surrounding you", effects:[
																							{name:Effect.BRAVERY} //,
																							//{name:Effect.ATTACK, value:1},
																							] };
																				
// Not implemented yet																				
CharmGlobals.data[Charm.DOUBLE_BLOW] = {name:"Double Blow", description:"Performs two attacks", 
																					effects:[
																							{name:Effect.DOUBLE_BLOW}
																							] };
																							
CharmGlobals.data[Charm.KNOCKBACK] = {name:"Knockback", description:"Knocks opponent back if possible, otherwise damages opponent", 
																					effects:[
																							{name:Effect.KNOCKBACK}
																							] };
																							
CharmGlobals.data[Charm.FORTIFY] = {name:"Fortify", description:"Increases defence by 2", 
																					effects:[
																							{name:Effect.DEFENCE, value:2}
																							] };	

CharmGlobals.data["test name 1"] = {name:"Test name 1", description:"Test description", 
																					effects:[
																							{name:Effect.DEFENCE, value:1}
																							] };		

CharmGlobals.data["test name 2"] = {name:"Test name 2", description:"Test description", 
																					effects:[
																							{name:Effect.ATTACK, value:1}
																							] };	
CharmGlobals.data["test name 3"] = {name:"Test name 3", description:"Test description", 
																					effects:[
																							{name:Effect.ATTACK, value:1}
																							] };
																							
CharmGlobals.data["test name 4"] = {name:"Test name 4", description:"Test description", 
																					effects:[
																							{name:Effect.ATTACK, value:1}
																							] };
																							
CharmGlobals.data["test name 5"] = {name:"Test name 5", description:"Test description", 
																					effects:[
																							{name:Effect.ATTACK, value:1}
																							] };
																							
CharmGlobals.data["test name 6"] = {name:"Test name 6", description:"Test description", 
																					effects:[
																							{name:Effect.ATTACK, value:1}
																							] };	

CharmGlobals.data["test name 7"] = {name:"Test name7", description:"Test description", effects:[{name:Effect.ATTACK, value:1} ] };																							
CharmGlobals.data["test name 8"] = {name:"Test name8", description:"Test description", effects:[{name:Effect.ATTACK, value:1} ] };																							
CharmGlobals.data["test name 9"] = {name:"Test name9", description:"Test description", effects:[{name:Effect.ATTACK, value:1} ] };																							
CharmGlobals.data["test name 10"] = {name:"Test name10", description:"Test description", effects:[{name:Effect.ATTACK, value:1} ] };																							
CharmGlobals.data["test name 11"] = {name:"Test name11", description:"Test description", effects:[{name:Effect.ATTACK, value:1} ] };																							
CharmGlobals.data["test name 12"] = {name:"Test name12", description:"Test description", effects:[{name:Effect.ATTACK, value:1} ] };																							
CharmGlobals.data["test name 13"] = {name:"Test name13", description:"Test description", effects:[{name:Effect.ATTACK, value:1} ] };																							
CharmGlobals.data["test name 14"] = {name:"Test name14", description:"Test description", effects:[{name:Effect.ATTACK, value:1} ] };																							
CharmGlobals.data["test name 15"] = {name:"Test name15", description:"Test description", effects:[{name:Effect.ATTACK, value:1} ] };																							
CharmGlobals.data["test name 16"] = {name:"Test name16", description:"Test description", effects:[{name:Effect.ATTACK, value:1} ] };																							
CharmGlobals.data["test name 17"] = {name:"Test name17", description:"Test description", effects:[{name:Effect.ATTACK, value:1} ] };																							
CharmGlobals.data["test name 18"] = {name:"Test name18", description:"Test description", effects:[{name:Effect.ATTACK, value:1} ] };																							
CharmGlobals.data["test name 19"] = {name:"Test name19", description:"Test description", effects:[{name:Effect.ATTACK, value:1} ] };																							
CharmGlobals.data["test name 20"] = {name:"Test name20", description:"Test description", effects:[{name:Effect.ATTACK, value:1} ] };																							
																							
																							

// Want to be able to have multiple effects on the same card - can have rare cards with more than one effect on them