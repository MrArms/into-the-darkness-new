
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

p.X_START = 80;
p.Y_START = 10;
p.Y_CHARM_DISPLAY_START = 20; //p.Y_START + 20;
p.CHARM_DISPLAY_WIDTH = 15; //p.Y_START + 20;

//===================================================
// Public Methods
//===================================================

p.update = function(_player, _inventory, _currentMouseCell, _charmIndicesSelectedArray)
{
	this._updateStatDisplay(_player);
	
	this._updateCharmDisplay(_inventory, _currentMouseCell, _charmIndicesSelectedArray);	
}

// This just returns the index of a charm if it is clicked on
p.checkMouseDown = function(_inventory, _currentMouseCell)
{
	if(_currentMouseCell !== null && _currentMouseCell[0] >= this.X_START && _currentMouseCell[0] <= this.X_START + this.CHARM_DISPLAY_WIDTH)
	{
		var indexYCell =  _currentMouseCell[1] - this.Y_CHARM_DISPLAY_START
	
		 if(indexYCell >= 0 && indexYCell <= _inventory.getCharmObjectArray().length - 1)
			return 	indexYCell;
	}
	
	return null;

}

//===================================================
// Private Methods
//===================================================

p._updateStatDisplay = function(_player)
{
	this._display.drawText(this.X_START, this.Y_START, "Attack Bonus " + _player.getCurrentAttackBonus() );
	this._display.drawText(this.X_START, this.Y_START + 1, "Defence Bonus " + _player.getCurrentDefenceBonus() );
}

p._updateCharmDisplay = function(_inventory, _currentMouseCell, _charmIndicesSelectedArray)
{
	var charmObjectArray = _inventory.getCharmObjectArray();

	var currentYPosition = this.Y_CHARM_DISPLAY_START;
	
	for(var i=0; i<charmObjectArray.length; i++)
	{			
		// var isSelected = (Utils.arrayContainsNumber(_charmIndicesSelectedArray, i) !== null);
		var isSelected = (Utils.arrayContainsElement(_charmIndicesSelectedArray, charmObjectArray[i].key) !== null);
	
		this._showCharmItem(this.X_START, currentYPosition, charmObjectArray[i], _currentMouseCell, isSelected);	

		currentYPosition += 1;
	}
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
		

	this._display.drawText(_xPos, _yPos, currentColourText + _charmItem.key + " " + _charmItem.number);
}

p._init = function()
{	

}

//===================================================
// Events
//===================================================

