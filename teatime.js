"use strict";

var eleTimerDescription = document.getElementById("timer-description"),
	eleMin = document.getElementById("timer-min"),
	eleSec = document.getElementById("timer-sec"),
	eleSetDefault = document.getElementById("set-default"),
	eleControl = document.getElementById("control"),
	eleControlDiv = eleControl.firstElementChild,
	defaultTime = 180,
	timeMin,
	timeSec,
	time;

window.onload = function() {
	setInput();
	setMainHeight();

	function setInput() {
		var defTime = getDefaultTime(),
			min = Math.floor(defTime/60),
			sec = defTime%60;
		eleMin.value = min;
		if (sec < 10) {
			eleSec.value = "0"+sec;
		}
		else {
			eleSec.value = sec;
		}
	}

	function setMainHeight() {
		var height = document.documentElement.clientHeight - 104,
			main = document.getElementById("main");

		main.style.height = height+"px"
	}
}

function getDefaultTime() {
	var result;
	document.cookie == "" ? result = defaultTime : result = document.cookie.split('=')[1];
	return result;
}

function playAudio(audioId) {
	var audio = document.getElementById(audioId);
	audio.play();
}

/* Called onclick of #control button.
 */
function checkTimerState(event) {
	if (event) {
		// If time is not ticking and Start button present
		if (time == undefined && eleControl.classList.contains("start")) {
			startTimer();
			playAudio("boiling-water");
		}
		// If time is ticking and Stop button present
		else if (time != undefined && eleControl.classList.contains("stop")) {
			stopTimer();
		}
		// If time is not ticking and Stop button present 
		// (i.e. timer has reached 0:00)
		else if (time == undefined && eleControl.classList.contains("stop")) {

		}
	}
}

/* Called onclick of control button from checkTimerState() if the
 * timer is not already ticking.
 */
function startTimer() {
	timeMin = eleMin.valueAsNumber;
	timeSec = eleSec.valueAsNumber;
	if (timeMin != 0 || timeSec != 0) { // i.e. !(timeMin == 0 && timeSec == 0)
		time = new Time(timeMin, timeSec);
		doTransition("start");
	}
	else {
		console.log("Input time is 0:00. Not starting timer.");
	}
}

/* Called onclick of control button from checkTimerState() if the 
 * timer is ticking and Start button present.
 */
function stopTimer() {
	time.delete();
	doTransition("stop");
}

/* Controls transitions from Start->Stop and Stop->Start
 * depending on supplied startState.
 */
function doTransition(startState) {
	var ctrl = eleControl.classList,
		setDef = eleSetDefault.parentNode.classList,
		timrDescr = eleTimerDescription.classList,
		ctrlDiv = eleControlDiv.classList,
		endState;

	startState == "start" ? endState = "stop" : endState = "start";

	ctrl.remove(startState);
	ctrl.add(endState);

	if (startState == "stop") { setDef.remove("hidden"); }

	fadeOut();

	function fadeOut() {
		ctrlDiv.add("fade-out");
		timrDescr.add("fade-out");
		setDef.add("fade-out");
		
		setTimeout(changeText, 200);
	}

	function changeText() {
		var ctrlDivText,
			timrDescrText;
		startState == "start" ? ctrlDivText = "Stop" : ctrlDivText = "Start";
		eleControlDiv.innerHTML = ctrlDivText;

		ctrlDiv.remove("fade-out");
		ctrlDiv.add("fade-in");

		startState == "start" ? timrDescrText = "" : timrDescrText = "Set steep time:";
		eleTimerDescription.innerHTML = timrDescrText;

		timrDescr.remove("fade-out");
		timrDescr.add("fade-in");

		setDef.remove("fade-out");
		setDef.add("fade-in");

		if (startState == "start") { setDef.add("hidden"); }

		setTimeout(fadeIn, 200);
	}

	function fadeIn() {
		ctrlDiv.remove("fade-in");
		timrDescr.remove("fade-in");
		setDef.remove("fade-in");
	}
}

function Time(startMin, startSec) {
	this.time = startMin*60 + startSec; 
	var that = this;
	this.intervalId = setInterval(function() { that.tick(); }, 1000);

	this.setValue();
}

Time.prototype.delete = function() {
	time = undefined;
	clearInterval(this.intervalId);
}

Time.prototype.setValue = function() {
	eleMin.value = this.getMinStr();
	eleSec.value = this.getSecStr();
}

Time.prototype.tick = function() {
	--this.time;

	this.setValue();

	if (this.time == 0) {
		//time = undefined;	
		//clearInterval(this.intervalId);
		this.delete();
		console.log('RING RING BITCHES');	
	}
	console.log(this.getMinStr()+":"+this.getSecStr());
}

Time.prototype.getMinStr = function() {
	var min = Math.floor(this.time/60);
	return min.toString();
}

Time.prototype.getSecStr = function() {
	var sec = this.time%60,
		result;
	sec < 10 ? result = "0"+sec : result = sec;
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
		if (eleSetDefault.checked) {
			eleSetDefault.checked = false;
		}
	}
}

/* Called onchange of setDefault checkbox.
 * If checkbox is checked, stores current default time in defaultTime 
 * and sets cookie to current input time.
 * Else (i.e. box is unchecked), cookie is set to value held by 
 * defaultTime.
 * If the box is checked and input numbers are then changed,
 * fixInput() handles unchecking the checkbox, and setDefault() is
 * is not called.
 */
function setDefault() {
	var min = eleMin.valueAsNumber, 
		sec = eleSec.valueAsNumber,
		newTime;  	
	if (eleSetDefault.checked) {
		newTime = min*60+sec;
		defaultTime = getDefaultTime();
		document.cookie = "defaultTime="+newTime+"; expires=Thu, 18 Dec 2020 12:00:00 UTC";
	}
	else {
		document.cookie = "defaultTime="+defaultTime+"; expires=Thu, 18 Dec 2020 12:00:00 UTC";
	}
}

function sayHi() {
	console.log("Hi.");
}
