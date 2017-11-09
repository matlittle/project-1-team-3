// Initialize Firebase database
var config = {
	apiKey: "AIzaSyDZRnbOrhklh9e8ofblm1DlOqMi4D0lz08",
	authDomain: "dual-user-input.firebaseapp.com",
	databaseURL: "https://dual-user-input.firebaseio.com",
	projectId: "dual-user-input",
	storageBucket: "",
	messagingSenderId: "990369680846"
};
firebase.initializeApp(config);

var db = firebase.database();
var currPlayer = "";
var otherPlayer = "";

$(document).ready(function(){

	$(".secondPageLayout").fadeOut();
	$(".thirdPageLayout").fadeOut();
	$(".fourthPageLayout").fadeOut();
	

	 
	$("#readyUp").click(function(){                     // this will fade out the initial start page
		$(".firstPageLayout").fadeOut();                // fades out first page 
		$(".secondPageLayout").fadeIn();            // fades in second page 
	});


	$("").click(function(){
		$("").fadeOut();
		// fades in the question page on button click
		$(".").fadeOut();
		$("").fadeIn();

	});
});



/* 
Pseudocode for remaining functions we're goind to need 
I'm going to list out the remaining functions that we need, and provide the issue number in github that they correspond to. When working on a function, add it to the bottom of the document, and move the comment with it. Make sure to semantically name the function you're writing, and keep it self contained as much as possile. When you start working on it, close, then reopen the github issue to move it to the "Working" panel. Then when you're finished, close it, and submit a PR, with a link to the github issue in the comments. 
*/


/* Issue #26 and #27  (These issues will really be just one function I believe) */
/* Write a function which we will fire when the page loads. This function will grab the "current" object from our Firebase database. If the player1.state is "inactive", the current player is player one. Otherwise, if player2.state is "inactive", the current player is player2. If both states are not "inactive", then the game is full. 
You'll call on another function (Issue #34), which will change the state in Firebase to "joining". Pass that function the string "player1", or "player2", depending on which spot the user is taking. 
For this function, you'll be setting the global variables currPlayer, and otherPlayer to "player1" or "player2". I would recommend writing the function so that if the player successfully joins, we set those variables, and return true. If the game is full, return false. */


/* Issue #34 */
/* Write a function that takes a string, "player1", or "player2". With that given string, set the current.player1/2.state to "joining" */
function setPlayerState(current) {
	if (current === "player1" || current === "player2") {
		db.ref(`current/${current}/state`).set("joining")
	} return	
}


/* Issue #35 */
/* Write a function that takes a string, "player1", or "player2". With that given string, set the onDisconnect method in firebase to revert the current.player1/2 object to it's base form. Look at issue in github for specifics. */
function loadDisconnect(player) {
	var ref = db.ref(`current/${player}`);
	ref.onDisconnect().set({
		state: "inactive",
		userID: "",
		code: ""
	});
}


/* Issue #37 */
/* This function will take the current player string, a username string, and the avatar URL. It will be called when the user successfully logs in. With those pieces or information, you'll set the current.player1/2 object with the corresponding information. See Github issue and pinned Firebase database layout for details. */


/* Issue #25 */
/* Write a function that will take a string, which is the username. With that string, create and return a robohash url. See https://robohash.org/ and Github issue for details. */


/* Issue #30 */
/* This function will be fired when both the current.player1/2.state values are "active". This will likely use a Firebase .on("value", function that will listen for changes to the "current" object. If both player states are "active", and the currPlayer is player1, get a random number using the function written for Issue #38, then check if that question has been asked in this "cycle" already using the function written for Issue #39. This will return false if it has been asked, or the question object if it has not.  
If it hasn't been asked, call the function for Issue #40 and pass it the question object, and number, to set the current question and mark it as asked. */


/* Issue #38 */
/* Write a function that generates a random number 1-20, and formats it in our database question format (_01, _02, etc.), then returns that formatted number. */


/* Issue #39 */
/* Write a function that will be passed a string which is a question number ("_01", "_02"). Use that string to read the question from Firebase. 
If the question's asked property is false, return the question object. Otherwise, return false. */


/* Issue #40 */
/* Write a function that will be passed a question object and the question number. Set the currQuestion variable as that object, and set the question."number".asked property to true in Firebase. */





/*
INPUT EVALUATION FUNCTION 
 	This function takes the user input string from the text area, 
	the current question object,  
	the function to run if they pass, 
	and the function to run if they failed.
	Fail function will be passed an object with a message property with the failure message
*/
function checkUserCode(str, question, passFunc, failFunc) {

	if (typeof (Worker) === undefined) {		// check if browser supports web workers 
		alert('No webworker supported');
		return false;
	}
	/* Initialize Variables */
	var myWorker = null, currTest = 0, failed = false, 
		URL = window.URL || (window.webkitURL);

	window.URL = URL;

	question.tests.forEach(function(test) {
		var functionString = buildFunctionString(test);

		console.log(functionString);

		/* (Stack Overflow comment) we are creating a new javascript file using blob. We just use the string passed to the function, and assign it to the Blob(content,type). */
		var workerData = new Blob([functionString], { type: "text/javascript" });

		initWorker(workerData, test);
	});


	function initWorker(data, test) {
		/* (Stack Overflow comment) create the new web worker as we dont have an external file, we have to create a url for our blob using createObjectURL. link will look like blob:d3958f5c-0777-0845-9dcf-2cb28783acaf */
		myWorker = new Worker(window.URL.createObjectURL(data));

		/* listen for messages sent back by the worker */
		myWorker.onmessage = function (e) {
			clearTimeout(timeoutError);		// clear the error timeout so it doesn't fire
			handleWorkerReturn(e, test, myWorker);		// pass return to handler function
		};

		myWorker.onerror = function (e) {
			stopWorker(myWorker);
			clearTimeout(timeoutError);
			failed = true;
			failFunc(e);
		}

		/* if the worker is running for longer than 5 seconds, throw timeout */
		var timeoutError = setTimeout(function() {
			clearTimeout(timeoutError);
			stopWorker(myWorker);

			/* check if already failed */
			if(!failed) {
				failed = true;
				var obj = {
					message: "TIMEOUT ERROR: Function provided likely has an infinite loop"
				}
				failFunc(obj);
			}
		}, 5 * 1000);
	}

	function stopWorker(w){
		/* stop and delete the worker when it's done */
		w.onmessage = null;
		w.terminate();
		delete w;
	}

	function handleWorkerReturn(e, test, worker) {
		/* if the return matches the expected pass value, 
			increment the current test counter
			if the counter equals the number of tests, then run pass function */
		if(e.data === test.passVal) {
			currTest += 1;
			if(currTest === question.tests.length) {
				stopWorker(worker);
				passFunc();
			}
		} else {
			stopWorker(worker);
			failed = true;

			var obj = {
				message: `Expected result: ${test.passVal}.  Result received: ${e.data}`
			}

			failFunc(obj);
		}
	}

	function buildFunctionString(test) {
		var f = question.function;
		var args = buildArgList(f.args);
		var params = buildArgList(test.params);

		var fullStr = `function ${f.name}(${args}) { \n ${str} \n }  `+
					`postMessage( ${f.name}(${params}) ); `;

		return fullStr;
	}

	function buildArgList(a) {
		var list = "";

		a.forEach(function(arg){
			if(list.length === 0) {
				list += arg;
			} else {
				list += `, ${arg}`;
			}
		});

		return list;
	}
}

// function to capture tabs in text area---tab key is "9"
function captureTabPress(event){
	var key = event.keyCode;
	if(key===9){
		event.preventDefault();

// current position of cursor
		var curPos = this.selectionStart;	
//from beginning to cursor position
		var startStr = $(this).val().substring(0, curPos);
		var endStr = $(this).val().substring(curPos);
//string interpolation
		var newStr = `${startStr}\t${endStr}`;
		$(this).val(newStr);
//moving cursor to post tab
		this.selectionStart = curPos + 1;
		this.selectionEnd = curPos + 1;
	} 
}

















