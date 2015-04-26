
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
Charm.SPIKED_ARMOUR = "spiked_armour";
Charm.FIRE_BRAND = "fire_brand";
Charm.RECKLESS_ATTACK = "reckless_attack";
Charm.REINFORCE = "reinforce";
Charm.TACTICS = "tactics";
Charm.SURROUND_ATTACK = "surround_attack";

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
CharmGlobals.data[Charm.SPIKED_ARMOUR] = {name:"Spiked Armour", description:"Damages the attacker by the amount your defence is higher than theirs", effects:[{name:Effect.SPIKED_ARMOUR}] };																					
CharmGlobals.data[Charm.FIRE_BRAND] = {name:"Fire Brand", description:"Doubles damage", effects:[{name:Effect.FIRE_BRAND}] };																					
CharmGlobals.data[Charm.RECKLESS_ATTACK] = {name:"Reckless Attack", description:"Adds your defence to your attack and reduces defence to 0", effects:[{name:Effect.RECKLESS_ATTACK}] };		
																			
CharmGlobals.data[Charm.REINFORCE] = {name:"Reinforce", description:"Increase defence by each surrounding enemy", effects:[{name:Effect.REINFORCE}] };																					
CharmGlobals.data[Charm.TACTICS] = {name:"Tactics", description:"Increase attack by each point of defence higher than any adjacent enemy defence", effects:[{name:Effect.TACTICS}] };																					
CharmGlobals.data[Charm.SURROUND_ATTACK] = {name:"Surround", description:"Attacks each adjacent square to the attacker", effects:[{name:Effect.SURROUND_ATTACK}] };																					
																																													