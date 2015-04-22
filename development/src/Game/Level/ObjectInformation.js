
goog.provide( "tt.ObjectInformation" );

// This stores the information about an object so it can be stored on a map or in your inventory


//===================================================
// Constructor
//===================================================

ObjectInformation = function() 
// ObjectInformation = function(_object, _number) 
{

	this._init()
}

var p = ObjectInformation.prototype;

//===================================================
// Variables
//===================================================

//Object = {}
ObjectInformation.CHARM = "charm";

ObjectInformation.stackableArray = [ObjectInformation.CHARM];

p._objectType = null;
p._key = null;
p._object = null;
p._number = null;
p._stackable = null;

//===================================================
// Public Methods
//===================================================

p.changeNumber = function(_difference)
{
	this._number += _difference;
}

p.getName = function() 
{ 	
	if(this._objectType === ObjectInformation.CHARM) 
	{
		return CharmGlobals.data[this._key].name;		
	}
}



p.create = function(_objectType, _key, _object, _number)
{
	this._objectType = _objectType;
	this._key = _key;
	this._object = _object;
	this._number = _number;
	
	this._stackable = Utils.arrayContainsElement(ObjectInformation.stackableArray, this._objectType); // === ObjectInformation.CHARM;
}


//===================================================
// Private Methods
//===================================================

p._init = function()
{

}

//===================================================
// Events
//===================================================

//===================================================
// GETTERS & SETTERS
//===================================================

p.getObjectType = function() {	return this._objectType; }

p.getKey = function() { return this._key; }

p.getObject = function() { return this._object; }

p.getNumber = function() {	return this._number; }

p.getStackable = function() { return this._stackable; }

//===================================================
// LOADING & SAVING
//===================================================

p.getSaveObject = function()
{
	var saveObject = {};
	
	saveObject._objectType = this._objectType;
	saveObject._key = this._key;
	saveObject._number = this._number;
	saveObject._stackable = this._stackable;
	
	if(this._object !== null)
		saveObject._object = this._object.getSaveObject();
	
	
	return saveObject;
}

p.restoreFromSaveObject = function(_saveObject)
{
	this._objectType = _saveObject._objectType;
	this._key = _saveObject._key;
	this._number = _saveObject._number;
	this._stackable = _saveObject._stackable;
	
	if(_saveObject._object && _saveObject._object !== null)
	{
		// UNCOMMENT THESE WHEN GameObjects are created
		// ===============   DO NOT DELETE   =============================
		//this._object = new GameObject();
		//this._object.restoreFromSaveObject(_saveObject._object);		
	}
	else
		this._object = null;
}