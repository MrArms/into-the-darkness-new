
goog.provide( "tt.Renderer" );

//===================================================
// Constructor
//===================================================

// _args is an array of arguments
Renderer = function(_display)
{
	this._display = _display;

	this._init();
}

var p = Renderer.prototype;

//===================================================
// Variables
//===================================================

p._display = null;

p._map_camera_col = null;
p._map_camera_row = null;

//===================================================
// Public Methods
//===================================================

// Will eventually send map, the camera position and the actors here
p.update = function(_map, _actors)
{
	this._renderAll(_map, _actors);

	//this._renderActors(_actors);
}

p.setMapCameraPosition = function(_col, _row)
{
	this._map_camera_col = _col - Math.floor(Globals.MAP_WINDOW_WIDTH * 0.5);
	this._map_camera_row = _row - Math.floor(Globals.MAP_WINDOW_HEIGHT * 0.5);	
}

//===================================================
// Private Methods
//===================================================

p._drawCell = function(_col, _row, ch, fg, bg)
{
	var colour = bg;

	/*if(this._mouseCell && this._mouseCell[0] === x && this._mouseCell[1] === y)
		colour = Globals.mouseOverColour;*/

	// this._display.draw(_col, _row, ch, fg, colour);
	this._display.draw(Globals.MAP_START_COL + _col, Globals.MAP_START_ROW + _row, ch, fg, colour);
}

p._inWindowBounds = function(_col, _row)
{
	var left = this._map_camera_col - Globals.MAP_WINDOW_WIDTH * 0.5;
	var top = this._map_camera_row - Globals.MAP_WINDOW_HEIGHT * 0.5;

	var outOfBounds = (_col < left || _col > left + Globals.MAP_WINDOW_WIDTH
			|| _row < top || _row > top + Globals.MAP_WINDOW_HEIGHT);
			
	return (!outOfBounds);
}

p._renderMapCell = function(_map, _col, _row)
{
	var currentViewableCells = _map.getCurrentViewableMapCells();
	var viewedMapCells = _map.getViewedMapCells();

	//var viewedValue = viewedMapCells.getElementFromValues(this._map_camera_col + i, this._map_camera_row + j);
	var viewedValue = viewedMapCells.getElementFromValues(this._map_camera_col + _col, this._map_camera_row + _row);
	//var viewableValue = currentViewableCells.getElementFromValues(this._map_camera_col + i, this._map_camera_row + j);
	var viewableValue = currentViewableCells.getElementFromValues(this._map_camera_col + _col, this._map_camera_row + _row);

	if(viewableValue && viewableValue !== null)
	{
		if(viewableValue === "#")
			this._drawCell(_col,_row, "", "#BBB", "#BBB");
		else
			this._drawCell(_col,_row, viewableValue, "#999");
	
	}
	else if(viewedValue && viewedValue !== null)
	{
		if(viewedValue === "#")
			this._drawCell(_col,_row, "", "#4B3", "#666");
		else
			this._drawCell(_col,_row, viewedValue, "#444");			
	}	
}

p._renderActorCell = function(_map, _actorsCellObject, _col, _row) 
{
	var currentViewableCells = _map.getCurrentViewableMapCells();
	var viewedCellValue = currentViewableCells.getElementFromValues(this._map_camera_col + _col, this._map_camera_row + _row);

	var tempActor = _actorsCellObject.getElementFromValues(this._map_camera_col + _col, this._map_camera_row + _row);
	//var tempActor = _actorsCellObject.getElementFromValues(_col, _row);
	
	// Check the actor exists, is alive and is in a viewable part of the map
	if(tempActor !== null && tempActor.isActorAlive() === true && viewedCellValue !== null)
	{
		var gameEvent = tempActor.getGameEvent();
	
		if(gameEvent !== null)
		{
			// Just draw the attacker as normal here
			if(gameEvent.getEventType() === GameEvent.ATTACK)
				this._drawCell(_col, _row, "@", "#000", "#FFF");
				
			// Draw the number over the defenders head here
			else if(gameEvent.getEventType() === GameEvent.DAMAGE)
				this._drawCell(_col, _row, gameEvent.getDamage(), "#F00", "#000");
			
			// Draw the number over the actors head here
			else if(gameEvent.getEventType() === GameEvent.HEAL)
				this._drawCell(_col, _row, gameEvent.getHealAmount(), "#8F8", "#000");
				
			else if(gameEvent.getEventType() === GameEvent.POISON_DAMAGE)
				this._drawCell(_col, _row, gameEvent.getDamage(), "#0B0", "#000");
				
			// Just showing a blue background for actors "animating" their move for the moment
			// Note you can get the new position be calling gameEvent.getNewPosition() if needed
			else if(gameEvent.getEventType() === GameEvent.MOVEMENT)
				this._drawCell(_col, _row, "@", "#FFF", "#00F");
	
		}	
		// No game event so just draw the actor as usual
		else
			this._drawCell(_col, _row, "@", "#FFF", "#000");		
	}	
}

p._renderAll = function(_map, _actorsCellObject)
{		
	// Get the viewed map here and go through and draw currently viewable cells and if there aren't there draw viewed cells
	for(var i=0; i < Globals.MAP_WINDOW_WIDTH; i++)	
		for(var j=0; j < Globals.MAP_WINDOW_HEIGHT; j++)
		{						
			// this._renderMapCell(_map, this._map_camera_col + i, this._map_camera_row + j);
			this._renderMapCell(_map, i, j);
			// this._renderActorCell(_actorsCellObject, this._map_camera_col + i, this._map_camera_row + j);				
			this._renderActorCell(_map, _actorsCellObject, i, j);				
		}	
}

p._init = function()
{	
	this._map_camera_col = 0;
	this._map_camera_row = 0;		
}

//===================================================
// Events
//===================================================

