
goog.provide( "tt.Inventory" );

//===================================================
// Constructor
//===================================================

Inventory = function()
{
	this._init();
}

var p = Inventory.prototype;

//===================================================
// Variables
//===================================================

// Relics instead of artifacts

// This contains an array of objects that list charm type and the number of them
// The objects are in the form {key:charmKey, number:numberOfThatCharm}
//  						eg.{key:"knockback", number:3}
p._charmObjectArray = null;

//===================================================
// Public Methods
//===================================================

// This is just a list of the keys and numbers of each charm type
p.getCharmObjectArray = function()
{
	return this._charmObjectArray;
}

p.addCharms = function(_charmKey, _number)
{
	var numberCharmsAdded = 0;

	if(this._getTotalNumberCharms() < GameGlobals.MAX_CHARMS && this._charmObjectArray.length < GameGlobals.MAX_DIFFERENT_CHARMS)
	{
		var charmIndex = this._hasCharm(_charmKey);
		
		numberCharmsAdded = Math.min(GameGlobals.MAX_CHARMS - this._getTotalNumberCharms(), _number);
	
		// We already have some of this charm type already, so just add more (up to the GameGlobals.MAX_CHARMS limit)
		if(charmIndex !== null)
		{
			this._charmObjectArray[charmIndex].number += numberCharmsAdded;								
		}
		// We don't already have this charm so create a new charm object and add it to the this._charmObjectArray
		else
		{
			var newCharmObject = {key:_charmKey, number:numberCharmsAdded};

			this._charmObjectArray.push(newCharmObject);
		}	
	}	

	return numberCharmsAdded;	
}

p.removeSelectedCharms = function(_charmKeyDeleteArray)
{
	for(var i=0; i<_charmKeyDeleteArray.length; i++)
	{
		this._removeCharm(_charmKeyDeleteArray[i]);
	}
	
}

p.create = function()
{		
	this._initialiseCharms();
}

//===================================================
// Private Methods
//===================================================

p._removeCharm = function(_charmKey)
{	
	// for(var key in this._charmObjectArray)
	for(var i=0; i<this._charmObjectArray.length; i++)
	{
		if(this._charmObjectArray[i].key === _charmKey)
		{
			this._charmObjectArray[i].number -= 1;
			
			if(this._charmObjectArray[i].number <= 0)			
				this._charmObjectArray.splice(i, 1);
				
			return;
		}	
	}	
}

// This creates some (random?) charms to start with
p._initialiseCharms = function()
{
	// Gets number of charms available	
	var numCharms = Utils.getNumberItemsInObject(CharmGlobals.data);
	
	for(var i=0; i<GameGlobals.START_CHARMS; i++)
	{
		var tempCharmKey = Utils.getRandomKeyFromObject(CharmGlobals.data, numCharms);
		
		this.addCharms(tempCharmKey, 1);
	}
}

p._getTotalNumberCharms = function()
{
	var numberCharms = 0;

	for(var i=0; i<this._charmObjectArray.length; i++)
	{	
		numberCharms += this._charmObjectArray[i].number;	
	}
	
	return numberCharms;
}

p._hasCharm = function(_charmKey)
{
	for(var i=0; i<this._charmObjectArray.length; i++)
	{
		if(this._charmObjectArray[i].key === _charmKey)
			return i;
	}
	
	return null;
}

p._init = function()
{
	this._charmObjectArray = [];
}

//===================================================
// Events
//===================================================

//===================================================
// LOADING & SAVING
//===================================================

p.getSaveObject = function()
{
	var saveObject = {};
	
	saveObject._charmObjectArray = []; 

	for(var i=0; i<this._charmObjectArray.length; i++)
	{
		var newObject = {};
		
		newObject.key = this._charmObjectArray[i].key;
		newObject.number = this._charmObjectArray[i].number;
		
		saveObject._charmObjectArray.push(newObject);
	}	
	
	return saveObject;
}

p.restoreFromSaveObject = function(_saveObject)
{
	for(var i=0; i<_saveObject._charmObjectArray.length; i++)
	{
		var newObject = {};
		
		newObject.key = _saveObject._charmObjectArray[i].key;
		newObject.number = _saveObject._charmObjectArray[i].number;
		
		this._charmObjectArray.push(newObject);
	}	
}