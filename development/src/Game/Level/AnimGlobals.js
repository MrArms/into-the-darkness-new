
goog.provide( "tt.AnimGlobals" );

Anim = {}
Anim.MELEE = "melee";

AnimGlobals = {};

// Animations aren't updated every frame, but this often
AnimGlobals.framesPerChunk = 5;

// Need to store character, foreground colour, background colour for frames
// Default character is null for all three fields
// If not specified then assume the last value is the current one

AnimGlobals[Anim.MELEE] = {	gradualAnim:true,
							numberChunks:6,							
							chunk0:{charType:"*", backgroundColour:"#FFFFFF", foregroundColour:"#FF0000"}, 
							chunk2:{charType:"-", backgroundColour:"#AAAAAA", foregroundColour:"#FFFFFF"},
							chunk4:{charType:null, backgroundColour:"#000000", foregroundColour:"#FF00FF"} 
						  };