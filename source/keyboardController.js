/*/ !! DOCUMENTATION !! \*\

lastKey is self explanatory. Is automatically set in DefaultKeyDownAction()

DefaultKeyDownAction() is called every time any key is pressed.

defaultPreventionList is a list of all the keys for which the default
	action is disabled. i.e. you dont want space to scroll down.

keyEventPtrs is a list of functions which are called when the 
	associatedKeyForPtr is pressed. The function is passed by value.
	keyEventType determines if it's a key press or release.

Keys() is just a container for all the key codes. Can also convert codes
	to human readable strings. GetChar doesn't look important, I don't 
	know what it does.
	

KeyboardController does the important stuff





\* */


var lastkey = 0;

var defaultPreventionList = new Array(0);

var keyEventPtrs = new Array(0);
var associatedKeyForPtr = new Array(0);
var keyEventType = new Array(0);  //true = down

function Keys(){
	this.shift = 16;
	this.control = 17;
	this.alt = 18;
	this.left = 37;
	this.up = 38;
	this.right = 39;
	this.down = 40;
	this.capsLock = 20;
	this.enter = 13;	
	this.slash = 220;
	this.forwardSlash = 191
	this.lessThan = 188;
	this.greaterThan = 190;
	this.semicolon = 59;
	this.apostrophe = 222;
	this.openBracket = 219
	this.closeBracket = 221;
	this.backspace = 8;
	this.tab = 9;
	this.space = 32;
	this.hyphen = 189;
	
	this.a = 65;
	this.b = 66;
	this.c = 67;
	this.d = 68;
	this.e = 69;
	this.f = 70;
	this.g = 71;
	this.h = 72;
	this.i = 73;
	this.j = 74;
	this.k = 75;
	this.l = 76;
	this.m = 77;
	this.n = 78;
	this.o = 79;
	this.p = 80;
	this.q = 81;
	this.r = 82;
	this.s = 83;
	this.t = 84;
	this.u = 85;
	this.v = 86;
	this.w = 87;
	this.x = 88;
	this.y = 89;
	this.z = 90;
	
	this.esc = 27;
	this.f1 = 112;
	this.f2 = 113;
	this.f3 = 114;
	this.f4 = 115;
	this.f5 = 116;
	this.f6 = 117;
	this.f7 = 118;
	this.f8 = 119;
	this.printScreen = 44;
	this.scrollLock = 145;
	this.breakk = 19;
	
	this.num = function(n){return n + 48;}
	this.dash = 109;
	this.plus = 107;
	this.tilde = 192
	
	this.numpad = function(n)
	{return n + 96;}
	this.numpadSlash = 111;
	this.numpadAsterisk = 106;	
	this.numpadPeriod = 110;
	
	this.insert = 45;
	this.del = 46;
	this.pageUp = 33;
	this.pageDown = 34;
	this.end = 35;
	this.home = 36;
	
	this.GetKeyName = function(k)
	{
		if(k==this.left){return "Left";}
		else if(k==this.up){return "Up";}
		else if(k==this.down){return "Down";}
		else if(k==this.right){return "Right";}
		
		else if(k>=this.a&&k<=this.z){return String.fromCharCode(k);}
		else if(k>=48&&k<=57){return String.fromCharCode(k);}
		
		else if(k>=this.f1&&k<=this.f12){return "F"+(k-111);}  //FX keys
		else if(k>=96&&k<=96+9){return "Numpad " + (k-96);}
		
		else if(k==109){return "dash";}
		else if(k==107){return "plus";}
		else if(k==192){return "tilde";}
		
		else if(k==16){return "shift";}
		else if(k==17){return "control";}
		else if(k==18){return "alt";}
		
		return "Key Index " + k;
	}
	
	this.GetChar = function(k){
		if(k>=this.a&&k<=this.z){return String.fromCharCode(k);}
		else if(k>=48&&k<=57){return String.fromCharCode(k);}
		
		else if(k>=96&&k<=96+9){return k-96;}
		
		else if(k==this.greaterThan || k==this.numpadPeriod){return ".";}
		
		else if(k==109 || k==this.hyphen){return "-";}
		else if(k==107){return "=";}
		else if(k==192){return "`";}
	}
}

var DefaultKeyDownAction = function(e){
	keyboard.Typed(e.which);
	lastKey = e.which;
}

function KeyboardController(){
	this.maskType = 'numeric';
	
	//this.charBuffer = "";
	
	this.charBuffer = new Array();
	
	this.cursorLocation = 0;
	
	this.ApplyNumericMask = function(inputIdx){
		if(inputIdx==keys.numpadPeriod || inputIdx==keys.greaterThan){
			for(var q = this.charBuffer.length-1; q>=0; q--){
				if(this.charBuffer.charAt(q)==".")
					return -1;
			}
			
			return inputIdx;
		}
		
		if(inputIdx==keys.dash || inputIdx==keys.hyphen){
			if(this.charBuffer[0]!=189)
				this.charBuffer.splice(0, 0, 189);
		}
		
		if(inputIdx>=keys.num(0) && inputIdx<=keys.num(9))
			return inputIdx;
		if(inputIdx>=keys.numpad(0) && inputIdx<=keys.numpad(9))
			return inputIdx;
		
		if(inputIdx==keys.left)
			return -3;
		if(inputIdx==keys.right)
			return -2;
		if(inputIdx==keys.backspace)
			return -4;
		if(inputIdx==keys.del)
			return -5;
		
		return -1;
	}
	
	this.Typed = function(inputIdx){
		var i = inputIdx;
		
		if(this.maskType=='numeric'){
			i = this.ApplyNumericMask(inputIdx);
		}
		
		if(i>-1){
			var j = inputIdx;
			if(j!=undefined){
				this.charBuffer.splice(this.cursorLocation,0,j);
				this.cursorLocation++;
			}
		}else if(i==-3){
			if(this.cursorLocation>0)
				this.cursorLocation--;
		}else if(i==-2){
			if(this.cursorLocation<this.charBuffer.length-2)
				this.cursorLocation++;
		}else if(i==-4){
			if(this.cursorLocation>0){
				this.charBuffer.splice(this.cursorLocation-1, 1);
				this.cursorLocation--;
			}
		}else if(i==-5){
			if(this.cursorLocation<this.charBuffer.length)
				this.charBuffer.splice(this.cursorLocation, 1);
		}
		
		console.log(this.BufferToString());
	}
	
	this.OnKeyUp = function(e)
	{
		for(var q = associatedKeyForPtr.length - 1; q >= 0; q--)
		{
			if(associatedKeyForPtr[q]==e.which && !keyEventType[q])
			{
				keyEventPtrs[q]();
			}
		}
	}
	
	this.OnKeyDown = function(e)
	{
		for(var q = 0; q < defaultPreventionList.length; q++)
			if(defaultPreventionList[q] == e.which)
				e.preventDefault();
		
		DefaultKeyDownAction(e);
		
		for(var q = associatedKeyForPtr.length - 1; q >= 0; q--)
		{
			if(associatedKeyForPtr[q]==e.which && keyEventType[q])
				keyEventPtrs[q]();
		}
	}
	
	this.AddKeyEvent = function(keyDown, key, fx)
	{
		keyEventPtrs.push(fx);
		associatedKeyForPtr.push(key);
		keyEventType.push(keyDown);
		return keyEventPtrs.length - 1;
	}
	
	this.DisableKey = function(k)
	{
		for(var q = defaultPreventionList.length - 1; q>=0; q--)
		{
			if(defaultPreventionList[q]==-1)
			{
				defaultPreventionList[q]=k;
				return;
			}
		}
		
		defaultPreventionList.push(k);
	}
	
	this.EnableKey = function(k)
	{
		for(var q = defaultPreventionList.length - 1; q>=0; q--)
		{
			if(defaultPreventionList[q]==k)
			{
				defaultPreventionList[q]=-1;
				return;
			}
		}
		
	}
	
	this.BufferToString = function(){
		var rv = "";
		
		for(var q = this.charBuffer.length-1, qq=0; qq<=q; qq++){
			rv+=keys.GetChar(this.charBuffer[qq]);
		}
		
		return rv;
	}
	
	this.ResetBuffer = function(){
		keyboard.charBuffer=new Array();
	}
}

var keyboard = new KeyboardController();
//keyboard.Initialize();
//var prevKeyboard = keyboard;
var keys = new Keys();
//----------------------------//
$(document).keyup(keyboard.OnKeyUp);
$(document).keydown(keyboard.OnKeyDown);