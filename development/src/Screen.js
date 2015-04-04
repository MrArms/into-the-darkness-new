
goog.provide( "tt.Screen" );

//===================================================
// Constructor
//===================================================

Screen = function()
{
	this._callbackFunctionList = {};
}

var p = Screen.prototype;
Screen.prototype.constructor = Screen;

//===================================================
// Variables
//===================================================

p._callbackFunctionList = null;
p._screenManager = null;

//===================================================
// Public Methods
//===================================================

p.enter = function()
{

}

p.exit = function()
{

}

p.setScreenManager = function(_screenManager)
{
    this._screenManager = _screenManager;
}

p.addCallbackFunction = function(_name, _callback)
{
	this._callbackFunctionList[_name] = _callback;
}

p.render = function()
{


}

//===================================================
// Private Methods
//===================================================

// This is pretty ugly
p._callbackFunction = function(_name, _args)
{
	if(this._callbackFunctionList[_name] && this._callbackFunctionList[_name] !== null)
	{
		var tempFunction = this._callbackFunctionList[_name];
		tempFunction(_args); //.bind(this._screenManager);
	}
	else
		Utils.console("Error, cannot find function callback for name: " + _name);
}


//===================================================
// Events
//===================================================

// These are to be overwritten in the extended screen class

p.onTimerTick = function(e)
{
	

}

p.keydownHandler = function(e)
{
	// Utils.console("this._keydownHandler");
}

p.keypressupHandler = function(e)
{
	// Utils.console("this._keypressupHandler");
}

p.keypressHandler = function(e)
{
	// Utils.console("this._keypressHandler");	
}

p.mouseDownHandler = function(e)
{
	// Utils.console("this._mouseDownHandler");	
}

p.mouseUpHandler = function(e)
{
	// Utils.console("this._mouseUpHandler");	
}

p.mouseOverHandler = function(e)
{
	// Utils.console("this._mouseOverHandler");	
}

p.mouseOutHandler = function(e)
{
	// Utils.console("this._mouseOutHandler");	
}

p.mouseMoveHandler = function(e)
{
	// Utils.console("this._mouseOutHandler");	
}