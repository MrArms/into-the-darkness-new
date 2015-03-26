
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

//===================================================
// Public Methods
//===================================================

// Returns a random element - it is a little clunky
p.getRandomElement = function()
{
	var count = 0;

	for (var key in this._data)	
		count = count + 1;
		
	var randomIndex = Math.floor(Math.random() * count);
	
	count = 0;
	
	for (var key in this._data)	
	{
		if(count === randomIndex)
		{
			return this.getIndicesFromKey(key);
		}
			//return this._data[key];	
		count = count + 1;
	}
	
	return null;

}

p.setElement = function(_element, _x, _y)
{
	this._data[this._getKeyFromValues(_x, _y)] = _element;
}

/*p.removeElementByKey = function(_key)
{	
	if(this._data[_key])
		delete this._data[_key];
}*/

p.removeElementFromValues = function(_x, _y)
{
	if(this._data[this._getKeyFromValues(_x, _y)])
		delete this._data[this._getKeyFromValues(_x, _y)];
}

p.getElementFromValues = function(_x, _y)
{
	if(this._data[this._getKeyFromValues(_x, _y)])
		return this._data[this._getKeyFromValues(_x, _y)];
	else
		return null;
}

p.moveElement = function(_oldX, _oldY, _newX, _newY)
{
	var tempElement = this.getElementFromValues(_oldX, _oldY);
	
	this.setElement(tempElement, _newX, _newY);

	this.removeElementFromValues(_oldX, _oldY);
}

p.hasElement = function(_x, _y)
{
	return (this._data[this._getKeyFromValues(_x, _y)] !== undefined && this._data[this._getKeyFromValues(_x, _y)] !== null);
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

p.getIndicesFromKey = function(_key)
{
	var parts = _key.split(",");
    var x = parseInt(parts[0]);
    var y = parseInt(parts[1]);
	
	return [x,y];
}

//===================================================
// Private Methods
//===================================================

p._getKeyFromValues = function(_x, _y)
{
	var key = _x + "," + _y;	
	return key;
}

p._init = function()
{	
	this._data = {};
}

//===================================================
// Events
//===================================================
