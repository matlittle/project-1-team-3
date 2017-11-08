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

$(document).ready(function()
{

	$(".secondPageLayout").fadeOut();
	$(".thirdPageLayout").fadeOut();
	$(".fourthPageLayout").fadeOut();
	

	 
	$("#readyUp").click(function(){                     // this will fade out the initial start page
		$(".firstPageLayout").fadeOut();                // fades out first page 
		$(".secondPageLayout").fadeIn();            // fades in second page 
	});


	$("").click(function()
	{
		$("").fadeOut();
		// fades in the question page on button click
		$(".").fadeOut();
		$("").fadeIn();

	});
});





/*
INPUT EVALUATION FUNCTION 
 	This function takes the user input string from the text area, 
	the current question object,  
	the function to run if they pass, 
	and the function to run if they failed 
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


