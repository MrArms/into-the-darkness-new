
goog.provide( "tt.ObjectContainer" );

// This can store multiple objects of different types on a cell on a level
// It has an array of ObjectInformation objects which can hold multiple objects of the same type only

//===================================================
// Constructor
//===================================================

ObjectContainer = function() 
{
	this._init()
}

var p = ObjectContainer.prototype;

//===================================================
// Variables
//===================================================

p._objectInformationArray = null;

//===================================================
// Public Methods
//===================================================

p.getObjects = function()
{
	return this._objectInformationArray;
}

p.hasObjects = function()
{
	return (this._getNumberObjects() > 0 );
}

p.create = function()
{
	
}

p.addObjectInformation = function(_objectInformation) 
{		
	// If the object is stackable and is already in the objectContainer, then add the new objectInformation to the old one
	if(_objectInformation.getStackable() === true)
	{				
		// Check to see if the object is a charm and the key is already contained in the array
		for(var i=0; i<this._objectInformationArray.length; i++)
		{
			if(_objectInformation.getObjectType() === this._objectInformationArray[i].getObjectType()
										&& _objectInformation.getKey() === this._objectInformationArray[i].getKey() )
			{	
				this._objectInformationArray[i].changeNumber(_objectInformation.getNumber());						
				return;
			}
		}
	}

	this._objectInformationArray.push(_objectInformation);
}

p.removeObjectInformation = function(_index, _number)
{
	// if we don't specify the number then just get all of the objects 
	if(!_number || _number === null)
		_number = this._objectInformationArray[_index].getNumber();
	
	// This needs to be a new informationObject rather than a pointer to the old one (which will get deleted)
	var returnObjectInformation = new ObjectInformation(); 
	returnObjectInformation.create(this._objectInformationArray[_index].getObjectType(), this._objectInformationArray[_index].getKey(), this._objectInformationArray[_index].getObject(), _number);
	
	// If we are picking up all the number of the object then remove it from the array
	if(_number === this._objectInformationArray[_index].getNumber())
		this._objectInformationArray.splice(_index, 1);
	else
		this._objectInformationArray[_index].changeNumber( - _number);
	
	return returnObjectInformation;
}

//===================================================
// Private Methods
//===================================================

p._getNumberObjects = function()
{
	var numberObjects = 0;

	for(var i=0; i<this._objectInformationArray.length; i++)
	{
		var tempObjectInformation = this._objectInformationArray[i]
		
		numberObjects += tempObjectInformation.getNumber();	
	}
	
	return numberObjects;
}

p._init = function()
{
	this._objectInformationArray = [];
}

//===================================================
// Events
//===================================================

//===================================================
// GETTERS & SETTERS
//===================================================

p.getPosition = function() { return [this._col, this._row]; }

p.setPosition = function(_col, _row)
{		
	this._col = _col;
	this._row = _row;
}

//===================================================
// LOADING & SAVING
//===================================================

p.getSaveObject = function()
{
	var saveObject = {};
	
	saveObject._col = this._col;
	saveObject._row = this._row;
	
	saveObject._saveArray = [];
	
	for(var i=0; i<this._objectInformationArray.length; i++)	
		saveObject._saveArray.push(this._objectInformationArray[i].getSaveObject());	
		
	return saveObject;
}

p.restoreFromSaveObject = function(_saveObject)
{
	this._col = _saveObject._col;
	this._row = _saveObject._row;

	for(var i=0; i<_saveObject._saveArray.length; i++)
	{
		var newObjectInformation = new ObjectInformation();
		newObjectInformation.restoreFromSaveObject(_saveObject._saveArray[i]);
		this._objectInformationArray.push(newObjectInformation);	
	}
}