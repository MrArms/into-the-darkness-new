
goog.provide( "tt.Renderer" );

//===================================================
// Constructor
//===================================================

// _args is an array of arguments
Renderer = function()
{
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
	this._display.clear();

	this._renderMap(_map, _actors);

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

p._renderMap = function(_map, _actors)
{
	var currentViewableCells = _map.getCurrentViewableMapCells();
	var viewedMapCells = _map.getViewedMapCells();
	
	// Get the viewed map here and go through and draw currently viewable cells and if there aren't there draw viewed cells
	for(var i=0; i < Globals.MAP_WINDOW_WIDTH; i++)
	{
		for(var j=0; j < Globals.MAP_WINDOW_HEIGHT; j++)
		{								
			var viewedValue = viewedMapCells.getElementFromValues(this._map_camera_col + i, this._map_camera_row + j);
			var viewableValue = currentViewableCells.getElementFromValues(this._map_camera_col + i, this._map_camera_row + j);
		
			if(viewableValue && viewableValue !== null)
			{
				if(viewableValue === "#")
					this._drawCell(i,j, "", "#BBB", "#BBB");
				else
					this._drawCell(i,j, viewableValue, "#999");
			
			}
			else if(viewedValue && viewedValue !== null)
			{
				if(viewedValue === "#")
					this._drawCell(i,j, "", "#4B3", "#666");
				else
					this._drawCell(i,j, viewedValue, "#444");			
			}					
		}
	}	

	// Draws the actors on top of the map cells
	for(var i=0; i<_actors.length; i++)
	{
		var position = _actors[i].getPosition();
	
		if(_actors[i].isActorAlive() && this._inWindowBounds(position[0], position[1]) )
		{			
			var gameEvent = _actors[i].getGameEvent();
							
			var screenPos = [position[0] - this._map_camera_col, position[1] - this._map_camera_row];				
							
			if(gameEvent !== null)
			{
				// Just draw the attacker as normal here
				if(gameEvent.getEventType() === GameEvent.ATTACK)
					this._drawCell(screenPos[0], screenPos[1], "@", "#000", "#FFF");
					
				// Draw the number over the defenders head here
				else if(gameEvent.getEventType() === GameEvent.DAMAGE)
					this._drawCell(screenPos[0], screenPos[1], gameEvent.getDamage(), "#F00", "#000");
				
				// Draw the number over the actors head here
				else if(gameEvent.getEventType() === GameEvent.HEAL)
					this._drawCell(screenPos[0], screenPos[1], gameEvent.getHealAmount(), "#8F8", "#000");
					
				else if(gameEvent.getEventType() === GameEvent.POISON_DAMAGE)
					this._drawCell(screenPos[0], screenPos[1], gameEvent.getDamage(), "#0B0", "#000");
			}	
			// No game event so just draw the actor as usual
			else
				this._drawCell(screenPos[0], screenPos[1], "@", "#FFF", "#000");						
		}	
		else
		{
			// Clear killed actors for the moment
			this._drawCell.draw(screenPos[0], screenPos[1], "", "#FFF", "#000");
		}
	}
}

p._init = function()
{	
	this._map_camera_col = 0;
	this._map_camera_row = 0;
	
	this._display = new ROT.Display({width: Globals.SCREEN_WIDTH, height: Globals.SCREEN_HEIGHT, fontSize:Globals.FONT_SIZE});
	document.body.appendChild(this._display.getContainer());
}

//===================================================
// Events
//===================================================

