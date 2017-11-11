// Initialize Firebase database
var config = {
  apiKey: "AIzaSyBQvtQvPuAfLIyeLNPhIXdvU8gWNTtMU9I",
  authDomain: "project1testing-377b6.firebaseapp.com",
  databaseURL: "https://project1testing-377b6.firebaseio.com",
  projectId: "project1testing-377b6",
  storageBucket: "project1testing-377b6.appspot.com",
  messagingSenderId: "547730341651"
};
firebase.initializeApp(config);


$("#new-user-modal").hide();
$("#sign-out").hide();
$("#second-page-layout").hide();
$("#third-page-layout").hide();
$("#fourth-page-layout").hide();



var email = "";
var password = "";
var passwordAgain = "";
var chosenName = "";
//capture user id from firebase
var userID = "";
// user.uid
var db = firebase.database();
var currPlayer = "";
var otherPlayer = "";

var currQuestion = "";

var timernumber = 1; 			//remove later
var newtimer = 3;				// remove later						

/*
// TAKE THIS OUT WHEN WE ARE PUTTING IT ALL TOGETHER!!!!
$(document).ready(function(){
	$("#ready-up").click(function(){			// this will fade out the initial start page
		$("#first-page-layout").hide();		// fades out first page 
		$("#second-page-layout").show();		// fades in second page
		timerRun();
		
	});

});


//this code will need to be deleted, its Wills benefit to see how to page responds to each page
function timerRun() {
	timerIntervaId = setInterval(decrement, 1000);
}

function decrement() {
	timernumber--;
	if ( timernumber ===0)
	{
		stop();
		$("#second-page-layout").hide();
		$("#third-page-layout").show();
		
	}
	fourthPageDecrement();
}

function fourthPageTimer() {
	console.log("Hello");
	fourthPageTimerIntervaId = setInterval(fourthPageDecrement, 1000);
}

function fourthPageDecrement() {
	newtimer--;
	if ( newtimer ===0)
	{
		console.log("Hello");
		stop();
		$("#third-page-layout").hide();
		$("#fourth-page-layout").show();
		console.log("Hello");
	}
}
// End of my benefit js stuff
*/

$("#add-newuser-btn").on("click", function(event){

	$("#login-modal").hide();
	$("#new-user-modal").show();

});

//create a new user with email and password
$("#submit-newuser-btn").on("click", function(event){
	event.preventDefault();

	email = $('#new-user-name-input').val().trim();
	//$('#user-name-input').val("");

	chosenName = $('#user-handle-input').val().trim();
	//$('#user-name-input').val("");

	password = $('#new-password-input').val();//.trim();
	//$('#password-input').val("");

	passwordAgain = $('#new-password-input-verify').val();//.trim();
	//$('#password-again-input').val("");

	if (password === passwordAgain){
	//create new account with email and password
	//check if account already made
	firebase.auth().createUserWithEmailAndPassword(email, password).catch(function(error) {
		// Handle Errors here.
		var errorCode = error.code;
		var errorMessage = error.message;
		//call create user profile here
		if (errorCode == 'auth/email-already-in-use') {
			alert('Account already in use');
			$('#user-name-input').val("");
			$('#password-input').val("");
			$('#password-again-input').val("");
		} else {
			alert(errorMessage);
		}
		console.log(error);
	});

	} else {
		alert('passwords do not match')
		$('#password-input').val("");
		$('#password-again-input').val("");
	}
});

//modal login
$("#login-btn").on("click", function(event){

	event.preventDefault();

	// $("#sign-out").show();

	email = $('#user-name-input').val();//.trim();
	$('#user-name-input').val("");

	password = $('#password-input').val();//.trim();
	$('#password-input').val("");

	//sign in existing user
	firebase.auth().signInWithEmailAndPassword(email, password).catch(function(error) {
		// Handle Errors here.
		var errorCode = error.code;
		var errorMessage = error.message;
		if(errorCode == 'auth/wrong-password'){
			alert("wrong password");
			$('#password-input').val("");
		}

	});

});

//add sign out event
$("#sign-out").on("click", function(event){
	event.preventDefault();

	firebase.auth().signOut().then(function() {
		// Sign-out successful.
	}).catch(function(error) {
		// An error happened.
	});

});


//Set an authentication state observer and get user data
//currently signed in user
firebase.auth().onAuthStateChanged(function(user) {
	if (user) {

		// user is signed in
		$("#sign-out").show();
		$("#new-user-modal").hide();
		$("#login-modal").hide();
		// show an html element with user name of currently signed in
		// close sign in modal here

		//capture unique user id at
		userID = user.uid;

		if (userID in db.ref('users')){ //return the user profile associated with the id

			console.log("user has profile")

		} else { //if the user id signed in does not have a profile, push one

			userProfile();

		}

		//still need login with unique username

		setPlayerStatus();

		
	} else {
		// user is signed out
		// re-open up sign-in modal
		$("#login-modal").show();
		// change html element to show user signed out
		$("#sign-out").hide();
	}
});


//pushes userprofile to database
function userProfile() { 
	//https://stackoverflow.com/questions/42885707/using-push-method-to-create-new-child-location-without-unique-key
	db.ref('users').child(userID).set({
		username: chosenName,
		score: "", //latestScore
		stats: "", //currentStats
		avatar: ""
	});
}

function setPlayerStatus() {

	var player1state = "";
	var player2state = "";
	var localUsername = "";

	db.ref().once('value').then(function(snapshot) {
		// var username = (snapshot.val());
		player1state = (snapshot.child('current').child('player1').child('state').val());
		player2state = (snapshot.child('current').child('player2').child('state').val());
		localUsername = (snapshot.child('users').child(userID).child('username').val());
		console.log(player1state);
		console.log(player2state);
		console.log(localUsername);

		if (player1state === 'none') {// || player1state === "joining"

			alert('player1 catch')

			db.ref('current').child('player1').set({

				state: "active",
				uid: userID, 
				code: "",
				avatar: `https://robohash.org/${localUsername}.png?size=200x200`

			});

		} else if (player2state === "none") {// || player2state === "joining"


			alert('player2 catch')

			db.ref('current').child('player2').set({

				state: "active",
				uid: userID, 
				code: "",
				avatar: `https://robohash.org/${localUsername}.png?size=200x200`

			});

		} else {

			alert("game is full please try again later");

		}

	});

}

//need to get out username and return to terry

//github authentication

//on disconnect even 



// End of Kyles Log In Code




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


/* Issue #30 */
/* This function will be fired when both the current.player1/2.state values are "active". This will likely use a Firebase .on("value", function that will listen for changes to the "current" object. If both player states are "active", and the currPlayer is player1, get a random question using the function written for Issue #46.
*/
db.ref("current").on("value", function(snapshot) {
	var currObj =snapshot.val();

	if (currPlayer === "player1" &&
	currObj.player1.state === "active" &&
	currObj.player2.state === "active") {
		var newQuestion = getRandomQuestion();
		setCurrentFBQuestion(newQuestion);
	}
});



/* Issue #46 */
/* Write a function that will read the current questions object from Firebase. From those questions, filter out the ones that have already been asked. From the unasked questions, choose a random one, and return that question number. */
function getRandomQuestion() {
	db.ref("questions").once("value", function(snapshot) {
		var qObj = snapshot.val();
		var qKeys = Object.getOwnPropertyNames(qObj);
		var unaskedQuestions = jQuery.grep(qKeys, function(question){
			return !qObj[question].asked;
		})

		if (unaskedQuestions.length === 0){
			resetQuestions();
			return getRandomQuestion();
		}

		var randomNum = Math.floor(Math.random()*unaskedQuestions.length);

		return unaskedQuestions[randomNum];

		/*var chosenQuestion = qObj[unaskedQuestions[randomNum]]

		db.ref(`questions/${unaskedQuestions[randomNum]}/asked`).set(true);

		return chosenQuestion;*/
	})
}

function resetQuestions() {
	db.ref("questions").once("value", function(snapshot) {
		var qKeys = Object.getOwnPropertyNames(snapshot.val());
		qKeys.forEach(function(key){
			db.ref(`questions/${key}/asked`).setWithPriority(false, 2);
		})
	})
}


/* Issue #40 */
/* Write a function that will be passed a question number. Set the Firebase current question to that question number.  */
function setCurrentFBQuestion(qNum) {
	db.ref("current/question").set(qNum);
}


/* Issue #59 */
/* Function that will listen for changes to current question, and grab that question from Firebase when it does change. */
db.ref("current/question").on("value", function(snapshot) {
	var qNum = snapshot.val();

	db.ref(`questions/${qNum}`).once("value", function(snapshot) {
		currQuestion = snapshot.val();
	});
});


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

















