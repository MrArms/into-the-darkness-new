

goog.provide( "tt.Main" );

goog.require( 'tt.Game' );
goog.require( 'tt.ScreenManager' );

function Main () // data, devices, canvasID, wrapperDivID ) 
{
	this.init();
}

var p = Main.prototype;

p._display = null;

p.init = function() //data) 
{	
	//this._display = new ROT.Display({width: Globals.SCREEN_WIDTH, height: Globals.SCREEN_HEIGHT, fontSize:Globals.FONT_SIZE});
	//document.body.appendChild(this._display.getContainer());

	// this._game = new Game(this._display);
	// this._game.create();
	// this._game.start();
	
	this.screenManager = new ScreenManager();
	this.screenManager.init();
	
}

goog.exportSymbol( 'tt.Main', Main );
goog.exportProperty(Main.prototype, "init", Main.prototype.init);

// This changes the localstorage so it stringifies and parses objects (causes problems otherwise)
Storage.prototype.setObject = function(key, value) {
    this.setItem(key, JSON.stringify(value));
}

Storage.prototype.getObject = function(key) {
    var value = this.getItem(key);
    return value && JSON.parse(value);
}