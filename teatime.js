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

function isNumber(event, element) {
	if (event) {
		console.log(event);
		var max_chars = element.getAttribute("max").length;
		var charCode = (event.which) ? event.which : event.keyCode;
		if (charCode != 190 && charCode > 31 &&
			(charCode < 48 || charCode > 57) &&
			(charCode < 96 || charCode > 105) &&
			(charCode < 37 || charCode > 40) &&
			charCode != 110 && charCode != 8 && charCode != 46 ) {
		return false;
		}
		if (element.value.length >= max_chars && charCode > 47) { 
			return false; 
		}
		else { 
			return true; 
		}
	}
}