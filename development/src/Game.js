
goog.provide( "tt.Game" );

goog.require( "tt.Actor" );
goog.require( "tt.Action" );
goog.require( "tt.TurnGod" );
goog.require( "tt.Renderer" );
goog.require( "tt.Utils" );

//===================================================
// Constructor
//===================================================

Game = function()
{
	this._init();
}

var p = Game.prototype;

//===================================================
// Variables
//===================================================

p._controlsLocked = null;
p._actorList = null;

p._turnGod = null;
p._renderer = null;

p.FPS = 60;


//===================================================
// Public Methods
//===================================================

p.turnFinished = function()
{
	Utils.console("Turn finished!!!");
	
	this._controlsLocked = false;
}

//===================================================
// Private Methods
//===================================================

p._init = function()
{	
	this._controlsLocked = true;

	this._renderer = new Renderer();
	
	this._turnGod = new TurnGod(this);
	
	this._handle = this; // Why do we need this exactly?
	
	window.addEventListener('keydown', function(e) { this._handle._keydownHandler(e); }.bind(this), false);
			
	this._actorList = [];
	
	this._actorList.push(new Actor(3,3, 10, false)); // player
	this._actorList.push(new Actor(2,4, 2, false)); // counter
	this._actorList.push(new Actor(3,4, 4, true)); // damaged
	this._actorList.push(new Actor(4,4, 5, false)); // dies
	
	setInterval(this._onTimerTick.bind(this), 1000 / this.FPS); // 33 milliseconds = ~ 30 frames per sec
	
	this._controlsLocked = false;	
}

p._startMove = function()
{
	this._controlsLocked = true;
	
	// Need to create an action here
	this._turnGod.startTurn(new Action(this._actorList[0], Action.ATTACK, [[ this._actorList[1], this._actorList[2], this._actorList[3] ]]) );
	// this._turnGod.startTurn(new Action(this._actorList[0], Action.ATTACK, [[ this._actorList[1] ]] ) );
}

//===================================================
// Events
//===================================================

p._onTimerTick = function(e)
{	
	this._renderer.update(this._actorList);
}

p._keydownHandler = function(e)
{
	if(this._controlsLocked === false)
	{
		this._startMove();
	}
}