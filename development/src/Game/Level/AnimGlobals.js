
goog.provide( "tt.AnimGlobals" );

Anim = {}
Anim.MELEE = "melee";
Anim.DEATH = "death";
Anim.XP_GAIN = "xp_gain";

AnimGlobals = {};

// Animations aren't updated every frame, but this often
AnimGlobals.framesPerChunk = 3;

// Need to store character, foreground colour, background colour for frames
// Default character is null for all three fields
// If not specified then assume the last value is the current one

AnimGlobals[Anim.MELEE] = {	gradualAnim:true,
							numberChunks:6,							
							chunk0:{charType:"*", backgroundColour:"#FFFFFF", foregroundColour:"#FF0000"}, 
							chunk2:{charType:"-", backgroundColour:"#AAAAAA", foregroundColour:"#FFFFFF"},
							chunk4:{charType:null, backgroundColour:"#000000", foregroundColour:"#FF00FF"} 
						  };
						  
AnimGlobals[Anim.DEATH] = {	gradualAnim:true,
							numberChunks:6,							
							chunk0:{charType:"$", backgroundColour:"#FF0000", foregroundColour:"#000000"}, 
							chunk2:{charType:"*", backgroundColour:"#00FF00", foregroundColour:"#555555"},
							chunk4:{charType:"&", backgroundColour:"#0000FF", foregroundColour:"#FF0000"} 
						  };
						  
AnimGlobals[Anim.XP_GAIN] = {	
							gradualAnim:true,
							numberChunks:4,							
							chunk0:{charType:"+", backgroundColour:"#FF0000", foregroundColour:"#DDDDDD"}, 
							chunk2:{charType:"+", backgroundColour:"#00FF00", foregroundColour:"#FFFFFF"}							
						  };