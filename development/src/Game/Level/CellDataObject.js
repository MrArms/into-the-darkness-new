
goog.provide( "tt.CellDataObject" );

			   
// This is a basic class that deals with the issues with position keys when storing elements that are ordered on the map grid
// eg. storing elements in the form actorsArray[col, row] = whatever
// It stops having to have annoying conversion functions all over your code

// To iterate through the elements of the object you need to call the getData() method
// eg. var tempData = actorsArray.getData()
//  for(var key in tempData) 
//		tempData[key] etc.

//===================================================
// Constructor
//===================================================

CellDataObject = function()
{
	this._init();
}

var p = CellDataObject.prototype;

//===================================================
// Variables
//===================================================

p._data = null;
p._numberElements = null;

//===================================================
// Public Methods
//===================================================

p.getNumberElements = function()
{
	return this._numberElements;
}

// Returns a random element - it is a little clunky
p.getRandomElementKey = function()
{
	this._setNumberElements();
	
	// There are no elements to return
	if(this._numberElements === 0)
	{
		Utils.console("WARNING! Trying to get a random element, but there are none in the object");
		return null;		
	}

	var randomIndex = Math.floor(ROT.RNG.getUniform() * this._numberElements);
	
	var count = 0;
	
	for (var key in this._data)	
	{
		if(count === randomIndex)	
			return key;
			// return Utils.getIndicesFromKey(key);
		
		count = count + 1;
	}
	
	Utils.console("ERROR! Trying to get a random element, but didn't return one. Perhaps there's a bug when getting the random index?");	
	return null;
}

p.getRandomElement = function()
{
	var tempElement = this.getRandomElement();
	
	return this._data[key];
}

p.getRandomElementPosition = function()
{
	var tempKey = this.getRandomElementKey();
	
	return Utils.getIndicesFromKey(tempKey);
}

p.setElement = function(_element, _x, _y)
{
	//if(this.getElementFromValues(_x, _y) !== null)
	//	Utils.console("WARNING! Setting element on top of an old one");

	this._data[Utils.getKeyFromValues(_x, _y)] = _element;
	
	this._setNumberElements();
	
}

p.removeElementByKey = function(_key)
{	
	if(this._data[_key])
		delete this._data[_key];
}

p.removeElementFromValues = function(_x, _y)
{
	if(this._data[Utils.getKeyFromValues(_x, _y)] !== null)
	{			
		delete this._data[Utils.getKeyFromValues(_x, _y)];	
	}
	else
		Utils.console("Error, trying to delete an element that doesn't exist");
	
	this._setNumberElements();
}

p.getElementFromValues = function(_x, _y)
{
	if(this._data[Utils.getKeyFromValues(_x, _y)])
		return this._data[Utils.getKeyFromValues(_x, _y)];
	else
		return null;
}

p.getElementFromKey = function(key)
{
	if(this._data[key] && this._data[key] !== null)
		return this._data[key];
	else
		return null;	
}

p.moveElement = function(_oldX, _oldY, _newX, _newY)
{
	var tempElement = this.getElementFromValues(_oldX, _oldY);
	
	if(tempElement !== null && this.getElementFromValues(_newX, _newY) !== null)	
		Utils.console("WARNING! Overwriting old element when moving an element");				
		
	this.setElement(tempElement, _newX, _newY);

	this.removeElementFromValues(_oldX, _oldY);
	
	this._setNumberElements();
	
}

p.hasElement = function(_x, _y)
{
	return (this._data[Utils.getKeyFromValues(_x, _y)] !== undefined && this._data[Utils.getKeyFromValues(_x, _y)] !== null);
}

p.getData = function()
{
	return this._data;
}

p.getKey = function(_element)
{
	for(var key in this._data)
	{
		if(this._data[key] === _element)
			return key;
	}
	
	return null;	
}

p.destroy = function()
{
	// Call destroy method if applicable or otherwise just set the data value to null
	for (var key in this._data)
	{
		if(this._data[key].destroy && this._data[key].destroy !== null)	
			this._data[key].destroy();			
		else
			this._data[key] = null;
	}

	this._data = null;
}

//===================================================
// Private Methods
//===================================================

p._setNumberElements = function()
{
	var count = 0;

	for (var key in this._data)	
		count = count + 1;

	this._numberElements = count;
}

p._init = function()
{	
	this._data = {};
	
	this._numberElements = 0;
}

//===================================================
// Events
//===================================================

//===================================================
// LOADING & SAVING
//===================================================

// This only works with objects that have single values as elements 
// A cellDataObject of say actors needs a separate method for this
p.getSaveObject = function()
{
	var saveObject = {}; 
	
	for(var key in this._data)
	{
		saveObject[key] = this._data[key];
	}
			
	return saveObject;
}

p.restoreFromSaveObject = function(_saveObject)
{
	for(var key in _saveObject)
	{
		this._data[key] = _saveObject[key];
	}

	this._setNumberElements();
}