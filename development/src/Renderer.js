
goog.provide( "tt.Renderer" );

//===================================================
// Constructor
//===================================================

// _args is an array of arguments
Renderer = function()
{
	this._init();
}

var p = Renderer.prototype;

//===================================================
// Variables
//===================================================

p._display = null;

//===================================================
// Public Methods
//===================================================

// Will eventually send map, the camera position and the actors here
p.update = function(_actors)
{
	for(var i=0; i<_actors.length; i++)
	{
		var position = _actors[i].getPosition();
	
		if(_actors[i].isActorAlive())
		{			
			var gameEvent = _actors[i].getGameEvent();
							
			if(gameEvent !== null)
			{
				// Just draw the attacker as normal here
				if(gameEvent.getEventType() === GameEvent.ATTACK)
					this._display.draw(position[0], position[1], "@", "#000", "#FFF");
					
				// Draw the number over the defenders head here
				else if(gameEvent.getEventType() === GameEvent.DAMAGE)
					this._display.draw(position[0], position[1], gameEvent.getDamage(), "#F00", "#000");
				
				// Draw the number over the actors head here
				else if(gameEvent.getEventType() === GameEvent.HEAL)
					this._display.draw(position[0], position[1], gameEvent.getHealAmount(), "#8F8", "#000");
					
				else if(gameEvent.getEventType() === GameEvent.POISON_DAMAGE)
					this._display.draw(position[0], position[1], gameEvent.getDamage(), "#0B0", "#000");
			}	
			// No game event so just draw the actor as usual
			else
				this._display.draw(position[0], position[1], "@", "#FFF", "#000");						
		}	
		else
		{
			// Clear killed actors for the moment
			this._display.draw(position[0], position[1], "", "#FFF", "#000");
		}
	}
}

//===================================================
// Private Methods
//===================================================

p._init = function()
{	
	this._display = new ROT.Display({width: 30, height: 30, fontSize:22});
	document.body.appendChild(this._display.getContainer());
}

//===================================================
// Events
//===================================================

