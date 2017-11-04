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





/*Input Evaluation Function*/

function checkUserCode(str, question, passFunc, failFunc) {

	if (typeof (Worker) === undefined) {        // check if browser supports web workers 
		alert('No webworker supported');
		return false;
	}

	var myWorker = null,
		URL = window.URL || (window.webkitURL);      // initialize variables

	window.URL = URL;

	var currTest = 0;

	question.tests.forEach(function(test) {
		var functionString = buildFunctionString(test);

		console.log(functionString);

		/* (Stack Overflow comment) we are creating a new javascript file using blob. We just use the string passed to the function, and assign it to the Blob(content,type). */
		var workerData = new Blob([functionString], { type: "text/javascript" });
		console.log("workerData: ", workerData);

		initWorker(workerData, test);
	});


	function initWorker(data, test) {
		/* (Stack Overflow comment) create the new web worker as we dont have an external file, we have to create a url for our blob using createObjectURL. link will look like blob:d3958f5c-0777-0845-9dcf-2cb28783acaf */
		myWorker = new Worker(window.URL.createObjectURL(data));
		console.log("myWorker: ", myWorker);

		/* listen for messages sent back by the worker */
		myWorker.onmessage = function (e) {
			clearTimeout(timeoutError);     // clear the error timeout so it doesn't fire
			handleWorkerReturn(e, test);      // pass return to handler function
		};

		var timeoutError = setTimeout(function() {
			/* if the worker is running for longer than 5 seconds, throw timeout */
			console.log("Timeout error thrown");
			failFunc();
			stopWorker(myWorker);
		}, 5 * 1000);
	}

	function stopWorker(w){
		/* stop and delete the worker when it's done */
		w.terminate();
		delete w;
	}

	function handleWorkerReturn(e, test) {
		console.log(e);
		console.log(e.data);
		console.log("test: ", test, "    test.passVal: ", test.passVal);

		/* if the return matches the expected pass value, 
			increment the current test counter
			if the counter equals the number of tests, then run pass function */
		if(e.data === test.passVal) {
			currTest += 1;
			if(currTest === question.tests.length) {
				passFunc();
				stopWorker(myWorker);
			}
		} else {
			failFunc();
			stopWorker(myWorker);
		}
	}

	function buildFunctionString(test) {
		var f = question.function;
		var args = buildArgList(f.args);
		var params = buildArgList(test.params);

		var fullStr = `function ${f.name}(${args}) { `;
		fullStr += `${str} } `;

		fullStr += `postMessage( ${f.name}(${params}) );`;

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

/* TEST VALUES */
testString = "return num1 + num2;";

testQuestion = {
	question: "Actual question",
	asked: "false",
	function: {
		name: "myFunc",
		args: ["num1", "num2"],
	},
	tests: [{
		params: ["1", "2"],
		passVal: 3
	},
	{
		params: ["3", "4"],
		passVal: 7
	}]
}

checkUserCode(testString, testQuestion, passedTests, failedTests); 

function passedTests() {
	console.log("passed");
}

function failedTests() {
	console.log("failed");
}
