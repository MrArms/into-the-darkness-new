
goog.provide( "tt.LevelMap" );

goog.require( "tt.CellDataObject" );

//===================================================
// Constructor
//===================================================

LevelMap = function(_levelIndex)
{
	this._levelIndex = _levelIndex;

	this._init()
}

var p = LevelMap.prototype;

//===================================================
// Variables
//===================================================

p.MAP_WIDTH = 92;  // <60 and we run out of free cells 
p.MAP_HEIGHT = 25;

// p._leftMostCell = null;
// p._rightMostCell = null;

p._startPos = null;
p._endPos = null;

p._mapDigger = null;

// This tells us whether we can redraw the map or not, when recalculating fov then we set this to false
p._canDraw = null;

// p.DISTANCE_FROM_EDGE_FOR_STAIRS = 0 ;//2;

// Stores the map cells
p._mapCells = null;

// This stores tiles that are currently in line of sight
p._currentViewableCells = null;

// This stores seen parts of the level - could eventually be stored in a particular actor if we want to do that, 
//			but in general once seen you don't want things to go blank again so it is stored in here for now
p._viewedMapCells = null;

p._freeCells = null;

//===================================================
// Public Methods
//===================================================

p.getMapCells = function()
{
	return this._mapCells;
}

p.getCurrentViewableMapCells = function()
{
	return this._currentViewableCells; 
}

p.getViewedMapCells = function()
{
	return this._viewedMapCells; 
}

p.canWalk = function(_x, _y)
{
	// var tempChar = this.getCellChar(_x, _y);
	var tempChar = this._mapCells.getElementFromValues(_x, _y);
	
	return (Utils.arrayContainsElement(GameGlobals.walkableTiles, tempChar) !== null);
}

p.isStairs = function(_x, _y)
{
	// var tempChar = this.getCellChar(_x, _y);
	var tempChar = this._mapCells.getElementFromValues(_x, _y);
	
	return (tempChar === '>');
}

p.getStartPos = function()
{
	return this._startPos;
}

p.getEndPos = function()
{
	return this._endPos;
}

p.updateViewableTiles = function(_col, _row)
{
	this._canDraw = false;

	// This gets reset each time 
	this._currentViewableCells = new CellDataObject();
	
	var fov = new ROT.FOV.PreciseShadowcasting(this._canLightPass.bind(this));

	fov.compute(_col, _row, GameGlobals.visionRadius, this._fovOutput.bind(this));
	
	this._canDraw = true;
}

p.canDraw = function()
{
	return this._canDraw;
}

// Just returns a free cell at random
// Eventually may specify general position and whether to delete the cell afterwards
p.getFreeCell = function()
{
	return this._freeCells.getRandomElementPosition();
}

//===================================================
// Private Methods
//===================================================



// This function outputs the visible cells
p._fovOutput = function(_col, _row, r, visibility)
{
	// Need to check if the output is a floor or wall cell	
	var tempChar = this._mapCells.getElementFromValues(_col, _row);
	
	// It is a wall so set it to a generic "#"
	// Eventually we may want to read in the characters for the wall for more variety but just have a # for the moment ***
	if (Utils.arrayContainsElement(GameGlobals.lightPasses, tempChar) === null)	
		tempChar = "#";	

	// Set the cells you can currently see here
	this._currentViewableCells.setElement(tempChar, _col, _row);
	
	// Set the cells you have viewed ever here
	this._viewedMapCells.setElement(tempChar, _col, _row);
}

p._canLightPass = function(_col, _row)
{	
	var tempChar = this._mapCells.getElementFromValues(_col, _row);
	
	return (tempChar !== null && Utils.arrayContainsElement(GameGlobals.lightPasses, tempChar) !== null);
}

p._getCellChar = function(_x, _y)
{	
	return this._mapCells.getElementFromValues(_x, _y);
}

p._setCellChar = function(_element, _x, _y)
{
	this._mapCells.setElement(_element, _x, _y);
}

p._generateMap = function(_levelIndex)
{
	this._mapDigger = new ROT.Map.Digger(this._mapWidth, this._mapHeight, {corridorLength:[2,3], dugPercentage:0.3});
	
	// This stores empty squares where we can place things
	this._freeCells = new CellDataObject(); 
	
	var digCallback = function(x, y, isWall) 
	{
		if (isWall) { return; } /* do not store walls */
 
		this._freeCells.setElement(1, x, y);
		var tempElement = isWall ? '#' : '.';
		
		this._mapCells.setElement(tempElement, x,y);		
	}
	
	this._mapDigger.create(digCallback.bind(this));	

	// var rooms = this._mapDigger.getRooms();
}

p._init = function(_levelIndex)
{	
	this._canDraw = true;

	this._levelIndex = _levelIndex;

	this._mapCells = new CellDataObject();
	this._currentViewableCells = new CellDataObject();
	this._viewedMapCells = new CellDataObject();
	
	this._generateMap(_levelIndex);
		
	// Need to remove the freeCell at some point ************
	this._startPos = this.getFreeCell();  //[tempIndex];
		
	// this._setStartAndEndPosition();
	// Just set the start position to any free cell for the moment
}

//===================================================
// Events
//===================================================

