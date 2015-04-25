
goog.provide( "tt.CharmGlobals" );

goog.require( "tt.Effect" );

Charm = {};
Charm.BRAVERY = "bravery";
Charm.MIGHT = "might";
Charm.KNOCKBACK = "knockback";
Charm.DOUBLE_MOVE = "double_move";
Charm.FORTIFY = "fortify";
Charm.COUNTER_ATTACK = "counter_attack";
Charm.ADRENALINE = "adrenaline";
Charm.POISON_BRAND = "poison";
Charm.SELF_SACRIFICE = "self_sacrifice";
Charm.REVENGE = "revenge";

var CharmGlobals = {};

CharmGlobals.data = {};

// CharmGlobals.data[Charm.BRAVERY] = {name:"Bravery", description:"+1 attack for each enemy surrounding you", effects:[ {name:Effect.BRAVERY},{name:Effect.ATTACK, value:1} ] };

// NOTE that when you have multiple effects in a charm they get applied in the order that they are list in
CharmGlobals.data[Charm.MIGHT] = {name:"Might", description:"Increases your attack by 2", effects:[{name:Effect.ATTACK, value:2}] };

CharmGlobals.data[Charm.BRAVERY] = {name:"Bravery", description:"+1 attack for each enemy surrounding you", effects:[ {name:Effect.BRAVERY} ] };
																																					
CharmGlobals.data[Charm.DOUBLE_MOVE] = {name:"Double move", description:"Performs two moves", effects:[{name:Effect.DOUBLE_MOVE}] };
																							
CharmGlobals.data[Charm.KNOCKBACK] = {name:"Knockback", description:"Knocks opponent back if possible, otherwise damages opponent", effects:[{name:Effect.KNOCKBACK}] };
CharmGlobals.data[Charm.COUNTER_ATTACK] = {name:"Counter Attack", description:"Counter attacks when attacked in melee", effects:[{name:Effect.COUNTER_ATTACK}] };
CharmGlobals.data[Charm.ADRENALINE] = {name:"Adrenaline", description:"You get an extra turn if you kill a monster this turn", effects:[{name:Effect.ADRENALINE}] };
CharmGlobals.data[Charm.POISON_BRAND] = {name:"Poison brand", description:"Brand your attacks with poison", effects:[{name:Effect.POISON_BRAND}] };
																							
CharmGlobals.data[Charm.FORTIFY] = {name:"Fortify", description:"Increases defence by 2", effects:[{name:Effect.DEFENCE, value:2}] };																					
CharmGlobals.data[Charm.SELF_SACRIFICE] = {name:"Self Sacrifice", description:"Increase attack by 2 but do 2 damage to yourself", effects:[{name:Effect.ATTACK, value:2}, 
																																		{name:Effect.SELF_SACRIFICE, value:2}] };

CharmGlobals.data[Charm.REVENGE] = {name:"Revenge", description:"Increase attack by the amount you were damaged by last turn", effects:[{name:Effect.REVENGE}] };																					
																																													