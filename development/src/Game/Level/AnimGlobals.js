
goog.provide( "tt.AnimGlobals" );

Anim = {}
Anim.DAMAGE = "damage";
Anim.DEATH = "death";
Anim.XP_GAIN = "xp_gain";
Anim.HEAL = "heal";

Anim.POISON_STATUS_DAMAGE = "poison_status_damage";
Anim.POISON_STATUS_START = "poison_status_start";

AnimGlobals = {};

// Animations aren't updated every frame, but this often
AnimGlobals.framesPerChunk = 4; //3; //3;

// Need to store character, foreground colour, background colour for frames
// Default character is null for all three fields
// If not specified then assume the last value is the current one

AnimGlobals[Anim.ATTACK] = {	gradualAnim:true,
							numberChunks:6,							
							chunk0:{charType:null, backgroundColour:"#333333", foregroundColour:"#FFFFFF"}, 
							chunk2:{charType:null, backgroundColour:"#555555", foregroundColour:"#FFFFFF"},
							chunk4:{charType:null, backgroundColour:"#888888", foregroundColour:"#FFFFFF"} 
						  };

AnimGlobals[Anim.DAMAGE] = {	gradualAnim:true,
							numberChunks:6,							
							chunk0:{charType:null, backgroundColour:"#FFFFFF", foregroundColour:"#FF0000"}, 
							chunk2:{charType:null, backgroundColour:"#AAAAAA", foregroundColour:"#FFFFFF"},
							chunk4:{charType:null, backgroundColour:"#555555", foregroundColour:"#FF00FF"} 
						  };
						  
AnimGlobals[Anim.DEATH] = {	gradualAnim:true,
							numberChunks:6,							
							chunk0:{charType:"*", backgroundColour:"#FF0000", foregroundColour:"#000000"}, 
							chunk2:{charType:"*", backgroundColour:"#00FF00", foregroundColour:"#555555"},
							chunk4:{charType:"*", backgroundColour:"#0000FF", foregroundColour:"#FF0000"} 
						  };
						  
AnimGlobals[Anim.XP_GAIN] = {	
							gradualAnim:true,
							numberChunks:6,							
							chunk0:{charType:null, backgroundColour:null, foregroundColour:null}, 
							chunk2:{charType:"+", backgroundColour:"#FF0000", foregroundColour:"#DDDDDD"}, 
							chunk4:{charType:"+", backgroundColour:"#00FF00", foregroundColour:"#FFFFFF"}							
						  };
						  
AnimGlobals[Anim.POISON_STATUS_DAMAGE] = {	
							gradualAnim:true,
							numberChunks:6,							
							chunk0:{charType:null, backgroundColour:null, foregroundColour:null}, 
							chunk2:{charType:null, backgroundColour:"#00BB00", foregroundColour:"#000000"}, 
							chunk4:{charType:null, backgroundColour:"#000000", foregroundColour:"#00BB00"}							
						  };
						  
AnimGlobals[Anim.HEAL] = {	
							gradualAnim:true,
							numberChunks:6,							
							chunk0:{charType:null, backgroundColour:null, foregroundColour:null}, 
							chunk2:{charType:null, backgroundColour:"#00FF00", foregroundColour:"#000000"}, 
							chunk4:{charType:null, backgroundColour:"#000000", foregroundColour:"#00FF00"}							
						  };
						  
AnimGlobals[Anim.POISON_STATUS_START] = {	
							gradualAnim:true,
							numberChunks:4,							
							chunk0:{charType:"*", backgroundColour:null, foregroundColour:null}, 
							chunk1:{charType:"*", backgroundColour:"#00BB00", foregroundColour:"#000000"}, 
							chunk2:{charType:null, backgroundColour:"#000000", foregroundColour:"#009900"},						
							chunk3:{charType:null, backgroundColour:"#000000", foregroundColour:"#00BB00"}							
						  };
