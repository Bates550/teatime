"use strict";

var timer = document.getElementById("timer");

function startTimer(startMin, startSec) {
	var time = new Time(startMin, startSec);
}

function Time(startMin, startSec) {
	this.time = startMin*60 + startSec; 

	var that = this;
	this.intervalId = setInterval(function() { that.tick(); }, 1000);

	timer.innerHTML = this.toString();
}

Time.prototype.tick = function() {
	--this.time;

	timer.innerHTML = this.toString();

	if (this.time == 0) {
		clearInterval(this.intervalId);
		// RING RING BITCHES!!
		console.log('hi');	
	}
}

Time.prototype.toString = function() {
	var result = "",
		min = Math.floor(this.time/60),
		sec = this.time%60;
	result += min + ":";
	if (sec < 10) {
		result += "0" + sec;
	}
	else {
		result += sec;
	}

	return result;
}

/* Adapted from http://demosthenes.info/blog/748/The-HTML5-number-Input */
function isNumber(event, element, type) {
	if (event) {
		var max_chars = element.getAttribute("max").length;
		var min_chars = element.getAttribute("min").length;
		var charCode = (event.which) ? event.which : event.keyCode;
		var char = String.fromCharCode(charCode);
		if (charCode > 31 && 						// non-control chars
			(charCode < 48 || charCode > 57) &&		// "0"-"9"
			(charCode < 96 || charCode > 105) &&	// "0"-"9" (numpad)
			(charCode < 37 || charCode > 40) &&		// arrow keys
			charCode != 8 && 						// backspace
			charCode != 46 ) {						// delete
			return false;
		}
		if (element.value.length >= max_chars && charCode > 47) { 
			return false; 
		}
		else if (charCode == 40 && 			// Down arrow
			element.valueAsNumber == 0) { 	// Min value for sec and min
			if (type == 'sec') {
				element.value = "59";
			}
			else if (type == 'min') {
				element.value = "9";
			}
			return false;
		}
		else if (charCode == 38 && 			// Up arrow 
			element.valueAsNumber == 59 &&	// Max value for sec
			type == 'sec') {
			element.value = "00";
			return false;
		}
		// Up arrow for minutes input
		else if (charCode == 38 && 			// Up arrow
			element.valueAsNumber == 9 && 	// Max value for min
			type == 'min') {
			element.value = "0";
			return false;
		}
		else {
			return true; 
		}
	}
}

function fixInput(event, element, type) {
	if (event) {
		if (element.valueAsNumber > 59) {
			element.value = "59";
		}
		else if (element.valueAsNumber < 10 && type == 'sec') {
			element.value = "0" + element.value;
		}
		else if (element.value == "" && type == 'sec') {
			element.value = "00";
		}
		else if (element.value == "" && type == 'min') {
			element.value = "0";
		}
		//console.log(element.value);
	}
}

function sayHi() {
	console.log("Hi.");
}