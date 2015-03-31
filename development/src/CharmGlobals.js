
goog.provide( "tt.CharmGlobals" );

Charm = {};
Charm.BRAVERY = "bravery";

var CharmGlobals = {};

CharmGlobals.data = {};



// NOTE that when you have multiple effects in a charm they get applied in the order that they are list in

CharmGlobals.data["attack_plus_2"] = {name:"Attack +2", description:"Increases your attack by 2", 
																					effects:[
																							{name:"attack_effect", value:2}
																							] };

// ADDED ANOTHER ATTACK POINT TO TEST MULTIPLE STATUS EFFECTS *****
CharmGlobals.data[Charm.BRAVERY] = {name:"Bravery", description:"+1 attack for each enemy surrounding you", effects:[
																							{name:"bravery_effect", value:1},
																							{name:"attack_effect", value:3},
																							] };

// Want to be able to have multiple effects on the same card - can have rare cards with more than one effect on them