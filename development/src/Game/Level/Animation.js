
goog.provide( "tt.Animation" );

goog.require( "tt.AnimGlobals" );

// This stores animation data for use with a gameEvent

//===================================================
// Constructor
//===================================================

Animation = function(_animationType)
{
	this._animationType = _animationType;

	this._init();
}

var p = Animation.prototype;

//===================================================
// Variables
//===================================================

p._animationType = null;
p._numberChunks = null;
p._gradualAnim = null; // This is if the colours are attenuated between frames or not
p._animationChunks = null; // This is if the colours are attenuated between frames or not

//===================================================
// Public Methods
//===================================================

p.isAnimationActive = function(_frame)
{
	// Give it the extra frame to prevent the flicker at the end
	return (_frame < this.getAnimationLength());	
}

p.getAnimationLength = function()
{
	return this._numberChunks * AnimGlobals.framesPerChunk - 1;
}

p.getFrameData = function(_frame)
{
	var frameChunk = Math.floor(_frame/AnimGlobals.framesPerChunk);
	
	// This is because we go 1 extra frame at the end to avoid flicker and we need to clamp it to the max frame index
	// frameChunk = Math.min(this._numberChunks - 1, frameChunk);
	
	return this._animationChunks[frameChunk];
}

p.getCharFromFrame = function(_frame)
{		
	return this.getFrameData(_frame).charType;
}

p.getForegroundColourFromFrame = function(_frame)
{		
	if(!this.getFrameData(_frame) || this.getFrameData(_frame) === null)
		Utils.console("Error, could not find frame data");

	return this.getFrameData(_frame).foregroundColour;
}

p.getBackgroundColourFromFrame = function(_frame)
{		
	return this.getFrameData(_frame).backgroundColour;
}

//===================================================
// Private Methods
//===================================================

p._init = function()
{	
	this._numberChunks = AnimGlobals[this._animationType].numberChunks;
	this._gradualAnim = AnimGlobals[this._animationType].gradualAnim;	
	
	var lastChunkFound = 0;
	
	this._animationChunks = [];
	
	var animObject = AnimGlobals[this._animationType]
	
	for(var i=0; i<this._numberChunks; i++)
	{		
		var tempName = "chunk" + i;
	
		if(animObject[tempName] && animObject[tempName] !== null)
		{
			this._animationChunks.push(animObject[tempName]);
		}
		else
		{
			// Need to create a chunk here, might have to average the colours if this._gradualAnim is true
			// Just copying previous colours for the moment
			
			var previousChunkData = this._animationChunks[this._animationChunks.length - 1];
			
			var newObject = {}
			newObject.charType = previousChunkData.charType;
			newObject.backgroundColour = previousChunkData.backgroundColour;
			newObject.foregroundColour = previousChunkData.foregroundColour;
			
			this._animationChunks.push(newObject);
		}
		
	}
}

//===================================================
// Events
//===================================================

