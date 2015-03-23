
goog.provide( "tt.Utils" );

//===================================================
// Constructor
//===================================================

Utils = function()
{


}

//===================================================
// Public Methods
//===================================================

Utils.console = function(_string)
{
	if(true) // Globals.console_debug === true)
	{
		console.log(_string)	
	}
}

Utils.clamp = function(_value, _min, _max)
{
	_value = Math.min(_value, _max);
	_value = Math.max(_value, _min);
	
	return _value;
}

Utils.inBounds = function(_value, _min, _max)
{
	return (_value >= _min && _value <= _max);
}

Utils.GetRandomString = function(_length)
{
	var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for( var i=0; i < _length; i++ )
        text += possible.charAt(Math.floor(Math.random() * possible.length));

    return text;
}

Utils.getDistanceBetweenMapPoints = function(_point1, _point2)
{
	return Math.max(Math.abs(_point1[0] - _point2[0]), Math.abs(_point1[1] - _point2[1]));
}

Utils.shuffleArray = function(o)
{
	for(var j, x, i = o.length; i; j = Math.floor(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x);
    return o;
}

Utils.arrayContainsNumber = function(_array, _number)
{
	for(var i=0; i<_array.length; i++)
	{
		if(_array[i] === _number)
			return i;
	}
	
	return null;
}

Utils.getSurroundingCellIndices = function(_col, _row)
{		
	var topLeft = [_col - 1, _row - 1];
	var top = [_col, _row - 1];
	var topRight = [_col + 1, _row - 1];
	var left = [_col - 1, _row];
	var right = [_col + 1, _row];
	var bottomLeft = [_col - 1, _row + 1];
	var bottom = [_col, _row + 1];
	var bottomRight = [_col + 1, _row + 1];
	
	return ([topLeft, top, topRight, left, right, bottomLeft, bottom, bottomRight ]);
}

Utils.addTwoArraysTogether = function(_array1, _array2)
{
	while(_array2.length > 0)
	{
		_array1.push(_array2.splice(0,1)[0]);
	}
	
	return _array1;
}

Utils.distanceBetweenTwoPoints = function(_point1, _point2)
{
	var dist1 = Math.abs(_point1[0] - _point2[0]);
	var dist2 = Math.abs(_point1[1] - _point2[1]);
	
	return Math.max(dist1, dist2);
}

Utils.getRandomArrayValue = function(_array)
{
	return _array[(Math.floor(Math.random() * _array.length))];
}

Utils.isPointInRectangle = function(_point, _left, _top, _right, _bottom)
{
	//if(point.x < rect.x) return false;
	if( _point[0] < _left) return false;
	if( _point[1] < _top) return false;
	if( _point[0] > _right) return false;
	if( _point[1] >= _bottom) return false;
	
	return true;
}

// This takes a number like 1.5 and gives you a 50% change of either 1 or 2
Utils.getValueFromProbability = function(_value)
{
	var floorValue = Math.floor(_value)
	var diff = _value - floorValue;
	
	var finalValue = floorValue;
	
	var testValue = Math.random();
	
	//Utils.console("Math.random() = " + testValue);
	
	if(Math.random() < diff)
		finalValue += 1;
		
	return finalValue;

}

Utils.addTwoPoints = function(_point1, _point2)
{
	return [_point1[0] + _point2[0], _point1[1] + _point2[1]];
}

Utils.itemIncludedInArray = function(arr,obj) 
{
    return (arr.indexOf(obj) != -1);
}



/*Utils.hasKeyBeenPressed = function(_event, _symbol)
{
	var code = _event.keyCode;

    // var vk = "?"; 
    for (var name in ROT) {
        if (ROT[name] == code && name.indexOf("VK_") == 0) 
		{ 
			return name; 
		}
    }	

}*/

 