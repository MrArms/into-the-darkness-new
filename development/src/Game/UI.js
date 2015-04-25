
goog.provide( "tt.UI" );

//===================================================
// Constructor
//===================================================

// _args is an array of arguments
UI = function(_display)
{
	this._display = _display;

	this._init();
}

var p = UI.prototype;

//===================================================
// Variables
//===================================================

p.X_START = 68; 
p.X_SECOND_COL = 85; 
p.Y_START = 3; //10;
p.Y_CHARM_DISPLAY_START = 20; 
p.CHARM_DISPLAY_WIDTH = 15;

p.Y_FLOOR_OBJECTS_START = 30; 
p.FLOOR_OBJECTS_SELECT_WIDTH = 15; 


//===================================================
// Public Methods
//===================================================

p.update = function(_player, _inventory, _currentMouseCell, _charmKeysSelectedArray, _level)
{
	this._updateStatDisplay(_player);
	
	this._updateCharmDisplay(_inventory, _currentMouseCell, _charmKeysSelectedArray);	
	
	this._updateFloorObjectsDisplay(_player, _level, _currentMouseCell, _inventory);
}

// This just returns the index of a charm if it is clicked on
p.checkMouseDownOnCharm = function(_inventory, _currentMouseCell)
{
	if(_currentMouseCell !== null)
	{
		return this._getCharmIndexFromCell(_inventory, _currentMouseCell[0], _currentMouseCell[1]);
	}

	return null;
}

// This just returns the index of a floor object if it is clicked on
p.checkMouseDownOnFloorObject = function(_currentMouseCell, _level)
{
	if(_currentMouseCell !== null)	
		return this._getFloorObjectIndexFromCell(_currentMouseCell[0], _currentMouseCell[1], _level);		

	return null;
}

//===================================================
// Private Methods
//===================================================

// =============== Floor objects ====================

// At the moment just tell the player whether he can pick up the floor object or not
p._floorCellTooltip = function(_objectInformation, _inventory)
{
	if(_inventory.getCharmsStorageSpace() === 0)
		this._display.drawText(this.X_START, this.Y_FLOOR_OBJECTS_START + 6, "%c{#FFF}" + "Inventory full, cannot pick up");
	else
		this._display.drawText(this.X_START, this.Y_FLOOR_OBJECTS_START + 6, "%c{#FFF}" + "Click to pick up");			
}


// This takes a screen cell coordinate and returns an index of a floor object if it is "over" the text of the floor object
// Used for mousing over and clicking floor object names
p._getFloorObjectIndexFromCell = function(_col, _row, _level)
{	
	var objectContainer = this._getObjectContainerAtPosition(_level.getPlayer().getPosition(), _level);
	
	if(objectContainer && objectContainer !== null)
	{
		for(var i=0; i<objectContainer.getObjects().length; i++)
		{
			if(_col >= this.X_START && _col < this.X_START + this.FLOOR_OBJECTS_SELECT_WIDTH)
			{					
				if(_row === this.Y_FLOOR_OBJECTS_START + 1 + i)
					return i;
			}
		}	
	}
	
	return null;
}

p._getObjectContainerAtPosition = function(_pos, _level)
{
	var tempObjectContainers = _level.getObjectContainers();
	
	return (tempObjectContainers.getElementFromValues(_pos[0], _pos[1]));
}

p._displayObjectName = function(_xPos, _yPos, _currentMouseCell, _objectInformation, _inventory)
{
	var tempNormalColour =   "%c{#3FF}";
	var tempMouseOverColour =   "%c{#FFF}";

	var tempColour = tempNormalColour;
	
	if(_currentMouseCell !== null && _currentMouseCell[0] >= _xPos && _currentMouseCell[0] <= _xPos + this.FLOOR_OBJECTS_SELECT_WIDTH && _currentMouseCell[1] === _yPos)
	{
		tempColour = tempMouseOverColour;
		this._floorCellTooltip(_objectInformation, _inventory);
	}
	
	this._display.drawText(_xPos, _yPos, tempColour + _objectInformation.getName() + " (" +  _objectInformation.getNumber() + ")" );
}

p._updateFloorObjectsDisplay = function(_player, _level, _currentMouseCell, _inventory)
{
	// Need to get the ObjectContainer cell at the player's feet
	var objectContainer = this._getObjectContainerAtPosition(_player.getPosition(), _level);
	
	if(objectContainer && objectContainer !== null)
	{
		this._display.drawText(this.X_START, this.Y_FLOOR_OBJECTS_START, "%c{#FFF}" + "On floor:" );
	
		for(var i=0; i<objectContainer.getObjects().length; i++)
		{					
			this._displayObjectName(this.X_START, this.Y_FLOOR_OBJECTS_START + 1 + i, _currentMouseCell, objectContainer.getObjects()[i], _inventory);		
		}
	}
}

// =================== Charms =======================

// This takes a screen cell coordinate and returns an index of a charm if it is "over" the text of the charm
// Used for mousing over and clicking charm names
p._getCharmIndexFromCell = function(_inventory, _col, _row)
{
	var numberInCol = Math.ceil(GameGlobals.MAX_DIFFERENT_CHARMS/2);
	
	var tempCol = null;
	
	// Are we in the first or second colomn of charms as displayed
	if(_col >= this.X_START && _col <= this.X_START + this.CHARM_DISPLAY_WIDTH)
		tempCol = 0;
	else if(_col >= this.X_SECOND_COL && _col <= this.X_SECOND_COL + this.CHARM_DISPLAY_WIDTH)
		tempCol = 1;
	else
		return null;
		
	if(_row >= this.Y_CHARM_DISPLAY_START && _row < this.Y_CHARM_DISPLAY_START + numberInCol)
	{
		var indexYCell =  _row - this.Y_CHARM_DISPLAY_START;
		
		if(tempCol === 1)	
			indexYCell = indexYCell + numberInCol;	
			
		if(indexYCell <= _inventory.getCharmObjectArray().length - 1)
			return indexYCell;		
	}
	
	return null;	
}

p._updateCharmDisplay = function(_inventory, _currentMouseCell, _charmKeysSelectedArray)
{
	var charmObjectArray = _inventory.getCharmObjectArray();

	this._display.drawText(this.X_START, this.Y_CHARM_DISPLAY_START - 2, "%c{#FFF}" + "Charms (" +  _inventory.getTotalNumberCharms() + "/" + GameGlobals.MAX_CHARMS + ")");
	
	var currentYPosition = this.Y_CHARM_DISPLAY_START;
	
	var numberInCol = Math.ceil(GameGlobals.MAX_DIFFERENT_CHARMS/2);
	
	// The first colomn of charms 
	for(var i=0; i< Math.min(numberInCol, charmObjectArray.length); i++)
	{			
		var isSelected = (Utils.arrayContainsElement(_charmKeysSelectedArray, charmObjectArray[i].key) !== null);
	
		this._showCharmItem(this.X_START, currentYPosition, charmObjectArray[i], _currentMouseCell, isSelected);	

		currentYPosition += 1;
	}
	
	// If we need the second colomn of charms
	if(charmObjectArray.length > numberInCol)
	{
		currentYPosition = this.Y_CHARM_DISPLAY_START;
				
		for(var i=0; i< charmObjectArray.length - numberInCol; i++)
		{			
			var isSelected = (Utils.arrayContainsElement(_charmKeysSelectedArray, charmObjectArray[i+numberInCol].key) !== null);
	
			this._showCharmItem(this.X_SECOND_COL, currentYPosition, charmObjectArray[i+numberInCol], _currentMouseCell, isSelected);	

			currentYPosition += 1;			
		}		
	}
	
	for(var i=0; i<_charmKeysSelectedArray.length; i++)
	{				
		var tempKey = _charmKeysSelectedArray[i];
				
		this._display.drawText(this.X_START, this.Y_CHARM_DISPLAY_START + numberInCol + 1 + i, "%c{#3F3}" + CharmGlobals.data[tempKey].name + " (" + (i+1) + ")");					
	}
	
	if(charmObjectArray.length > GameGlobals.MAX_DIFFERENT_CHARMS)
		Utils.console("Error. More charm objects in array than the max allowed!");	
}

p._showCharmItem = function(_xPos, _yPos, _charmItem, _currentMouseCell, _isSelected)
{
	// Going to store these colours somewhere eventually
	var tempUnselectedColour =   "%c{#888}";
	var tempSelectedColour =   "%c{#FF3}";
	var tempMouseOverColour =   "%c{#AAF}";
	var tempMouseOverSelectedColour =   "%c{#FFF}";

	var currentColourText = tempUnselectedColour;
			
	if(_isSelected)
		currentColourText = tempSelectedColour;		
			
	if(_currentMouseCell !== null && _currentMouseCell[0] >= _xPos && _currentMouseCell[0] <= _xPos + this.CHARM_DISPLAY_WIDTH && _currentMouseCell[1] === _yPos)
	{
		if(_isSelected)
			currentColourText = tempMouseOverSelectedColour;
		else
			currentColourText = tempMouseOverColour;				
	}
			
	this._display.drawText(_xPos, _yPos, currentColourText + CharmGlobals.data[_charmItem.key].name + " " + _charmItem.number);
}

// =================== Stats =======================

p._updateStatDisplay = function(_player)
{
	p.getCurrentStrength = function() { return this._data._baseStrength; }
	p.getCurrentMagic = function() { return this._data._baseMagic; }
	p.getCurrentFaith = function() { return this._data._baseFaith; }
	p.getCurrentWill = function() { return this._data._baseWill; }	

	this._display.drawText(this.X_START, this.Y_START, "Strength " + _player.getCurrentStrength() );
	this._display.drawText(this.X_START, this.Y_START + 1, "Magic " + _player.getCurrentMagic() );
	this._display.drawText(this.X_START, this.Y_START + 2, "Faith " + _player.getCurrentFaith() );
	this._display.drawText(this.X_START, this.Y_START + 3, "Will " + _player.getCurrentWill() );
	
	this._display.drawText(this.X_START, this.Y_START + 5, "Attack " + _player.getCurrentAttack() );
	this._display.drawText(this.X_START, this.Y_START + 6, "Defence " + _player.getCurrentDefence() );
	
	this._display.drawText(this.X_START, this.Y_START + 7, "Kills this turn " + _player.getEnemiesKilledThisTurn() );
	this._display.drawText(this.X_START, this.Y_START + 8, "Damage dealt this turn " + _player.getDamageDealtThisTurn() );
	this._display.drawText(this.X_START, this.Y_START + 9, "Damage taken this turn " + _player.getDamageTakenThisTurn() );
	this._display.drawText(this.X_START, this.Y_START + 10, "Damage dealt last turn " + _player.getDamageDealtLastTurn() );
	this._display.drawText(this.X_START, this.Y_START + 11, "Damage taken last turn " + _player.getDamageTakenLastTurn() );
			
	if(_player.hasEffect(Effect.ADRENALINE))
		this._display.drawText(this.X_START, this.Y_START + 12, "ADRENALINE");			
}

p._init = function()
{	

}

//===================================================
// Events
//===================================================

