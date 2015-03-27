

goog.provide( "tt.Main" );
goog.require( 'tt.Game' );

function Main () // data, devices, canvasID, wrapperDivID ) 
{
	this.init();
}

var p = Main.prototype;

p.init = function() //data) 
{	
	this._game = new Game();
}

goog.exportSymbol( 'tt.Main', Main );
goog.exportProperty(Main.prototype, "init", Main.prototype.init);