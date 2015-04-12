
goog.provide( "tt.Colour" );

//===================================================
// Constructor
//===================================================

Colour = function(_name, _hexValue, _startColourIndex)
{
	this._init(_name, _hexValue, _startColourIndex);
}

var p = Colour.prototype;
Colour.prototype.constructor = Colour;

//===================================================
// Variables
//===================================================

p._name = null;
p._baseColour = null;
p._colourArray = null;

p.COLOUR_DIFF = 0.08;
p.NUMBER_COLOURS = 8;

//===================================================
// Public Methods
//===================================================

// if we don't specify which colour from the array we want then just get the brightest one
p.getColour = function(_index)
{
	if(!_index || _index === null)
		_index = this.NUMBER_COLOURS - 1;
		
	return this._colourArray[_index];
}

// if we don't specify which colour from the array we want then just get the brightest one
p.getColourForText = function(_index)
{
	if(!_index || _index === null)
		_index = this.NUMBER_COLOURS - 1;

	return "%c{" + this.getColour(_index) +  "}";
}

//===================================================
// Private Methods
//===================================================

// Lightens of darkens a colour by the amount specified by lum
p._colorLuminance = function(hex, lum) 
{
	// validate hex string
	hex = String(hex).replace(/[^0-9a-f]/gi, '');
	if (hex.length < 6) {
		hex = hex[0]+hex[0]+hex[1]+hex[1]+hex[2]+hex[2];
	}
	lum = lum || 0;

	// convert to decimal and change luminosity
	var rgb = "#", c, i;
	for (i = 0; i < 3; i++) {
		c = parseInt(hex.substr(i*2,2), 16);
		c = Math.round(Math.min(Math.max(0, c + (c * lum)), 255)).toString(16);
		rgb += ("00"+c).substr(c.length);
	}

	return rgb;
}

p._getColourArrayFromColour = function(_colour, _startColourIndex)
{
	var colourArray = [];
	
	// % difference in lighting between shades
	var colourDiff = null; 
		
	var startDiff = -_startColourIndex;
	var endDiff = this.NUMBER_COLOURS - 1 - _startColourIndex;
		
	// add 3 darker and 3 lighter values
	for(var i=startDiff; i<=endDiff; i++)
	{
		colourDiff = Math.max(0, this.COLOUR_DIFF*i);
		colourDiff = Math.min(1.0, this.COLOUR_DIFF*i);
	
		colourArray.push( this._colorLuminance(_colour, colourDiff) );								
	}
	
	return colourArray;
}

p._init = function(_name, _hexValue, _startColourIndex)
{
	this._name = _name;
	this._baseHexColour = _hexValue;
	
	if(!_startColourIndex || _startColourIndex === null)
		_startColourIndex = this.NUMBER_COLOURS - 1;
	
	this._colourArray = this._getColourArrayFromColour(_hexValue, _startColourIndex);
}

//===================================================
// Events
//===================================================
