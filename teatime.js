"use strict";

var eleTimerDescription = document.getElementById("timer-description"),
	eleMin = document.getElementById("timer-min"),
	eleSec = document.getElementById("timer-sec"),
	eleSetDefault = document.getElementById("set-default"),
	eleControl = document.getElementById("control"),
	eleControlDiv = eleControl.firstElementChild,
	eleTea = document.getElementById("cup-tea"),
	eleSteam = document.getElementById("cup-steam"),
	defaultTime = 180,
	timeMin,
	timeSec,
	time,
	alarm;

console.log(document.cookie);
window.onload = function() {
	setInput();
	setMainHeight();

	function setMainHeight() {
		var height = document.documentElement.clientHeight - 104,
			main = document.getElementById("main");

		main.style.height = height+"px"
	}
}

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

function getDefaultTime() {
	var result;
	document.cookie == "" ? result = defaultTime : result = document.cookie.split('=')[1];
	return result;
}

/* Called onchange of setDefault checkbox.
 * If checkbox is checked, stores current default time in defaultTime 
 * and sets cookie to current input time.
 * Else (i.e. box is unchecked), cookie is set to value held by 
 * defaultTime.
 * If the box is checked and input numbers are then changed by the user,
 * fixInput() handles unchecking the checkbox, and setDefault() is
 * is not called.
 * If the box is checked and the user presses Start, the box is unchecked
 * in the Time object constructor.
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

/* Plays audio tag with id audioId.
 */
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
			resetTimer();
		}
	}
}

/* Called onclick of #control button from checkTimerState() if the
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

/* Called onclick of #control button from checkTimerState() if the 
 * timer is ticking and Start button present.
 */
function stopTimer() {
	time.delete();
	doTransition("stop");
}

/* Called onclick of #control button from checkTimerState() if the
 * timer has reached 0:00 and Stop button is present.
 */
function resetTimer() {
	alarm.stop();
	setInput();	
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
		tea = eleTea.classList,
		steam = eleSteam.classList,
		endState;

	startState == "start" ? endState = "stop" : endState = "start";

	ctrl.remove(startState);
	ctrl.add(endState);

	if (startState == "stop") { 
		setDef.remove("hidden"); 
	}
	else { 
		tea.remove("cup-empty"); 
		tea.add("cup-full");
		steam.remove("cup-no-steam");
		steam.add("cup-steam");
	}

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

		if (startState == "start") { 
			setDef.add("hidden"); 
		}
		else {
			tea.remove("cup-full");
			tea.add("cup-empty");
			steam.remove("cup-steam");
			steam.add("cup-no-steam");
		}

		setTimeout(fadeIn, 200);
	}

	function fadeIn() {
		ctrlDiv.remove("fade-in");
		timrDescr.remove("fade-in");
		setDef.remove("fade-in");
	}
}

/* The Alarm object plays the audio tag with id audioId every interval
 * milliseconds. 
 * The Alarm object does not stop itself and is stopped only when the user
 * presses the Stop button after the alarm has begun.
 */
function Alarm(audioId, interval) {
	this.audioId = audioId;
	var that = this;
	this.intervalId = setInterval(function() { that.ring(); }, interval);
}

Alarm.prototype.ring = function() {
	playAudio(this.audioId);
}

Alarm.prototype.stop = function() {
	alarm = undefined;
	clearInterval(this.intervalId);
}

function Time(startMin, startSec) {
	this.time = startMin*60 + startSec; 
	var that = this;
	this.intervalId = setInterval(function() { that.tick(); }, 1000);

	if (eleSetDefault.checked) { eleSetDefault.checked = false; }

	this.setValue();
}

Time.prototype.delete = function() {
	time = undefined;
	document.title = "TeaTime";
	clearInterval(this.intervalId);
}

Time.prototype.setValue = function() {
	eleMin.value = this.getMinStr();
	eleSec.value = this.getSecStr();
	document.title = "("+eleMin.value+":"+eleSec.value+") TeaTime";
}

Time.prototype.tick = function() {
	--this.time;

	this.setValue();

	if (this.time == 0) {
		this.delete();
		alarm = new Alarm("alarm", 1500);
	}
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

function sayHi() {
	console.log("Hi.");
}
