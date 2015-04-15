
goog.provide( "tt.ScreenManager" );

goog.require( 'tt.MenuScreen' );
goog.require( 'tt.GameScreen' );
goog.require( 'tt.GameOverScreen' );
goog.require( 'tt.WinningScreen' );
//goog.require( 'tt.Instructions' );

//===================================================
// Constructor
//===================================================

ScreenManager = function()
{
	
}

var p = ScreenManager.prototype;
ScreenManager.prototype.constructor = ScreenManager;

//===================================================
// Variables
//===================================================

p._display = null;

p._currentScreen = null;

p._menuScreen = null;

// Could eventually be loaded in from a file rather than this variable
p._saveGameObject = null;

// Callback names (this is a bit clunky)
ScreenManager.START_GAME = "START_GAME";
ScreenManager.GAME_OVER = "GAME_OVER";
ScreenManager.GAME_WON = "GAME_WON";	
ScreenManager.LOAD_GAME = "LOAD_GAME";	
ScreenManager.SAVE_GAME = "SAVE_GAME";
ScreenManager.QUIT_GAME = "QUIT_GAME";
ScreenManager.RETURN_TO_MENU = "RETURN_TO_MENU";

//===================================================
// Public Methods
//===================================================

p.init = function()
{
	Globals.screen_manager = this;
	
	this._handle = this;
	
	this._currentScreen = null;
	
	var options = {
		width: Globals.SCREEN_WIDTH,
		height: Globals.SCREEN_HEIGHT,
		fontSize: Globals.FONT_SIZE,
		//fontFamily:"Georgia", //Georgia", //Verdana", //Lucida Console", // Verdana", //"Courier New", //monospace",
		fontFamily:"Verdana", //Georgia", //Verdana", //Lucida Console", // Verdana", //"Courier New", //monospace",
		// fontStyle:"bold",
		forceSquareRatio:false
		}
	
	
	this._display = new ROT.Display(options); //width: Globals.SCREEN_WIDTH, height: Globals.SCREEN_HEIGHT, fontSize:Globals.FONT_SIZE});
	document.body.appendChild(this._display.getContainer());
	
	setInterval(this._onTimerTick.bind(this), 1000 / Globals.FPS); // 33 milliseconds = ~ 30 frames per sec
			
	window.addEventListener('keydown', function(e) { this._handle._keydownHandler(e); }.bind(this), false);
	window.addEventListener('keyup', function(e) { this._handle._keypressupHandler(e); }.bind(this), false);
	window.addEventListener('keypress', function(e) { this._handle._keypressHandler(e); }.bind(this), false);	
	
	window.addEventListener('mousedown', function(e) { this._handle._mouseDownHandler(e); }.bind(this), false);	
	window.addEventListener('mouseup', function(e) { this._handle._mouseUpHandler(e); }.bind(this), false);	
	window.addEventListener('mouseover', function(e) { this._handle._mouseOverHandler(e); }.bind(this), false);	
	window.addEventListener('mouseout', function(e) { this._handle._mouseOutHandler(e); }.bind(this), false);
	window.addEventListener('mousemove', function(e) { this._handle._mouseMoveHandler(e); }.bind(this), false);
	
	this._startMenuScreen();
}

p._startMenuScreen = function()
{
	this._getSavedGameObject();

	var saveGameAvailable = (this._saveGameObject !== null);

	var menuScreen = new MenuScreen(this._display, saveGameAvailable);
	menuScreen.setScreenManager(this);
	menuScreen.addCallbackFunction(ScreenManager.START_GAME, this._startGame.bind(this));	
	menuScreen.addCallbackFunction(ScreenManager.RESTORE_GAME, this._restoreGame.bind(this));	
	
	//menuScreen.signalStartGame.add( this._startGame, this );
	this._switchScreen(menuScreen);	
}

p._startGame = function()
{
	var gameScreen = this._createGameScreen(null);
	
	this._switchScreen(gameScreen);
}

p._getSavedGameObject = function()
{	
	if(this._saveGameObject && this._saveGameObject !== null) 
		return;
	else
	{
		var retrievedObject = localStorage.getItem('saveGame');
		
		if(retrievedObject && retrievedObject !== null)
			this._saveGameObject = JSON.parse(retrievedObject);
	}
}

p._restoreGame = function()
{
	// First look for a local saved game here
	if(this._saveGameObject && this._saveGameObject !== null)
	{
		var gameScreen = this._createGameScreen(this._saveGameObject);		
		this._switchScreen(gameScreen);
	}
}

p._createGameScreen = function(_saveGameObject)
{
	var gameScreen = new GameScreen(this._display, _saveGameObject);
	
	gameScreen.setScreenManager(this);
	gameScreen.addCallbackFunction(ScreenManager.GAME_OVER, this._gameOver.bind(this));	
	gameScreen.addCallbackFunction(ScreenManager.GAME_WON,  this._gameWon.bind(this));		
	gameScreen.addCallbackFunction(ScreenManager.SAVE_GAME, this._saveGame.bind(this));	
	gameScreen.addCallbackFunction(ScreenManager.QUIT_GAME, this._startMenuScreen.bind(this));	
	
	return gameScreen;
}

p._saveGame = function(_args)
{
	this._saveGameObject = _args[0]; 
	
	// Put the object into storage
	localStorage.setItem('saveGame', JSON.stringify(this._saveGameObject));
}

p._gameWon = function()
{
	var winningScreen = new WinningScreen(this._display);	
	this._switchScreen(winningScreen);
}

p._gameOver = function()
{
	var gameOverScreen = new GameOverScreen(this._display);	
	gameOverScreen.addCallbackFunction(ScreenManager.RETURN_TO_MENU, this._startMenuScreen.bind(this));	
	this._switchScreen(gameOverScreen);
}

p._switchScreen = function(_screen)
{
	if(this._currentScreen !== null)
	{
		this._currentScreen.exit();
	}

	this._display.clear();
    this._currentScreen = _screen;
	
    if (this._currentScreen && this._currentScreen !== null) 
	{
        this._currentScreen.enter();
        this._currentScreen.render(this._display);
    }
}

//===================================================
// Private Methods
//===================================================

//===================================================
// Events
//===================================================

p._onTimerTick = function(e)
{
	if (this._currentScreen && this._currentScreen !== null) 
	{		
		this._currentScreen.onTimerTick(e);	
	}	
}

p._keydownHandler = function(e)
{
	if (this._currentScreen && this._currentScreen !== null) 
	{		
		this._currentScreen.keydownHandler(e);	
	}		
}

p._keypressupHandler = function(e)
{
	if (this._currentScreen && this._currentScreen !== null) 
	{		
		this._currentScreen.keypressupHandler(e);	
	}	
}

p._keypressHandler = function(e)
{
	//Utils.console("this._keypressHandler");	
	
	if (this._currentScreen && this._currentScreen !== null) 
	{		
		this._currentScreen.keypressHandler(e);	
	}	
}

p._mouseDownHandler = function(e)
{
	//Utils.console("this._mouseDownHandler");	
	
	if (this._currentScreen && this._currentScreen !== null) 
	{		
		this._currentScreen.mouseDownHandler(e);	
	}
}

p._mouseUpHandler = function(e)
{
	//Utils.console("this._mouseUpHandler");	
	
	if (this._currentScreen && this._currentScreen !== null) 
	{		
		this._currentScreen.mouseUpHandler(e);	
	}
}

p._mouseOverHandler = function(e)
{
	Utils.console("this._mouseOverHandler");	
	
	if (this._currentScreen && this._currentScreen !== null) 
	{		
		this._currentScreen.mouseOverHandler(e);	
	}
}

p._mouseOutHandler = function(e)
{
	//Utils.console("this._mouseOutHandler");	
	
	if (this._currentScreen && this._currentScreen !== null) 
	{		
		this._currentScreen.mouseOutHandler(e);	
	}
}

p._mouseMoveHandler = function(e)
{
	// Utils.console("this._mouseMoveHandler");	
	
	if (this._currentScreen && this._currentScreen !== null) 
	{		
		this._currentScreen.mouseMoveHandler(e);	
	}
}