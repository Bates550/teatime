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