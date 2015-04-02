
goog.provide( "tt.LevelMap" );

goog.require( "tt.CellDataObject" );

//===================================================
// Constructor
//===================================================

LevelMap = function() 
{
	this._init();
}

var p = LevelMap.prototype;

//===================================================
// Variables
//===================================================

p.MAP_WIDTH = 18; //22; //35; //92;  // <60 and we run out of free cells 
p.MAP_HEIGHT = 15; //18; //25;

p._startPos = null;
p._endPos = null;

p._mapDigger = null;

// This tells us whether we can redraw the map or not, when recalculating fov then we set this to false
p._canDraw = null;

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

p.create = function(_levelIndex)
{
	this._levelIndex = _levelIndex

	this._generateMap(this._levelIndex);
		
	this._startPos = this.getFreeCell();  
	
	// We don't want stairs on the bottom level
	if(this._levelIndex > 1)
		this._mapCells.setElement("<", this._startPos[0], this._startPos[1]);
	
	this._endPos = this.getFreeCell();  
	this._mapCells.setElement(">", this._endPos[0], this._endPos[1]);	
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

// Just returns a free cell at random
// Eventually may specify general position and whether to delete the cell afterwards
p.getFreeCell = function()
{
	var freeCellPosition = this._freeCells.getRandomElementPosition();
	
	// Remove the freeCell so we can't put another actor in the same place
	this._freeCells.removeElementFromValues(freeCellPosition[0], freeCellPosition[1]);

	// return this._freeCells.getRandomElementPosition();
	return freeCellPosition;
}

//===================================================
// Private Methods
//===================================================

p._init = function()
{	
	this._canDraw = true;

	this._mapCells = new CellDataObject();
	this._currentViewableCells = new CellDataObject();
	this._viewedMapCells = new CellDataObject();		

	// This stores empty squares where we can place things
	this._freeCells = new CellDataObject(); 	
}

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

p._generateMap = function(_levelIndex)
{
	this._mapDigger = new ROT.Map.Digger(this.MAP_WIDTH, this.MAP_HEIGHT, {corridorLength:[2,3], dugPercentage:0.3});
			
	var digCallback = function(x, y, isWall) 
	{
		if (isWall) { return; } /* do not store walls */
 
		this._freeCells.setElement(1, x, y);
		var tempElement = isWall ? '#' : '.';
		
		this._mapCells.setElement(tempElement, x,y);		
	}
	
	this._mapDigger.create(digCallback.bind(this));	

	// var rooms = this._mapDigger.getRooms(); // IF WE WANT ROOMS WE'LL NEED TO SAVE AND RELOAD THEM ****
}

//===================================================
// Events
//===================================================

//===================================================
// GETTERS & SETTERS
//===================================================

p.canDraw = function() { return this._canDraw; }

p.getMapCells = function() { return this._mapCells;}

p.getCurrentViewableMapCells = function() { return this._currentViewableCells; }

p.getViewedMapCells = function() { return this._viewedMapCells; }

p.getStartPos = function() { return this._startPos; }

p.getEndPos = function() { return this._endPos; }

p._getCellChar = function(_x, _y) { return this._mapCells.getElementFromValues(_x, _y); }

p._setCellChar = function(_element, _x, _y) { this._mapCells.setElement(_element, _x, _y); }

p.canWalk = function(_x, _y)
{
	var tempChar = this._mapCells.getElementFromValues(_x, _y);
	
	return (Utils.arrayContainsElement(GameGlobals.walkableTiles, tempChar) !== null);
}

p.isDownStairs = function(_x, _y)
{
	var tempChar = this._mapCells.getElementFromValues(_x, _y);
	
	return (tempChar === '<');
}

p.isUpStairs = function(_x, _y)
{
	var tempChar = this._mapCells.getElementFromValues(_x, _y);
	
	return (tempChar === '>');
}

p.destroy = function()
{	
	this._startPos = null;
	this._endPos = null;

	this._mapDigger = null;
	
	this._mapCells.destroy();
	this._mapCells = null;
	
	this._currentViewableCells.destroy();
	this._currentViewableCellss = null;
	
	this._viewedMapCells.destroy();
	this._viewedMapCellss = null;
	
	this._freeCells.destroy();
	this._freeCells = null;
}

//===================================================
// LOADING & SAVING
//===================================================

p.getSaveObject = function()
{
	var saveObject = {};
	
	saveObject._startPos = this._startPos;
	saveObject._endPos = this._endPos;
	saveObject._mapCells = this._mapCells.getSaveObject();
	saveObject._currentViewableCells = this._currentViewableCells.getSaveObject();
	saveObject._viewedMapCells = this._viewedMapCells.getSaveObject();
	saveObject._freeCells = this._freeCells.getSaveObject();	
	
	return saveObject;
}

p.restoreFromSaveObject = function(_saveObject)
{
	this._canDraw = true;

	this._startPos = _saveObject._startPos;
	this._endPos = _saveObject._endPos;
	
	this._mapCells = new CellDataObject();	
	this._mapCells.restoreFromSaveObject(_saveObject._mapCells);
	
	this._currentViewableCells = new CellDataObject();	
	this._currentViewableCells.restoreFromSaveObject(_saveObject._currentViewableCells);

	this._viewedMapCells = new CellDataObject();	
	this._viewedMapCells.restoreFromSaveObject(_saveObject._viewedMapCells);
	
	this._freeCells = new CellDataObject();	
	this._freeCells.restoreFromSaveObject(_saveObject._freeCells);	
}
