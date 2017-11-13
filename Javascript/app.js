// Initialize Firebase database
var config = {
	apiKey: "AIzaSyBQvtQvPuAfLIyeLNPhIXdvU8gWNTtMU9I",
	authDomain: "project1testing-377b6.firebaseapp.com",
	databaseURL: "https://project1testing-377b6.firebaseio.com",
	projectId: "project1testing-377b6",
	storageBucket: "project1testing-377b6.appspot.com",
	messagingSenderId: "547730341651"
};
var config = {
	apiKey: "AIzaSyBpqb28_j0cWU_-3hiiLDwYZd-w20TPToM",
	authDomain: "project-1-40c23.firebaseapp.com",
	databaseURL: "https://project-1-40c23.firebaseio.com",
	projectId: "project-1-40c23",
	storageBucket: "project-1-40c23.appspot.com",
	messagingSenderId: "692133169214"
};
firebase.initializeApp(config);


/*$("#new-user-modal").hide();
$("#sign-out").hide();
$("#second-page-layout").hide();
$("#third-page-layout").hide();
$("#fourth-page-layout").hide();*/

$(".modal").show();


var db = firebase.database();
var currPlayer = "";
var otherPlayer = "";

var currQuestion = "";

// Checks if both players active. Grabs question if they are.
db.ref("current").on("value", checkIfBothActive);					
// Grabs new question from FB when Obj changes. 
db.ref("current/question").on("value", getNewQuestion);
// Listens for a winner
db.ref("current/winner").on("value", showWinner);

// Handle code check button click
$("#check-code").click(handleCodeSubmission);


var loginHandler = {
	
	chosenName: "",
	currPlayer: "",
	//capture user id from firebase
	userID: "",

	showNewUserForm: function(){
		$("#login-modal").hide();
		$("#new-user-modal").show();
	},

	//create a new user with email and password
	submitNewUser: function(){

		email = $('#new-user-name-input').val().trim();
		newUserName = $('#user-handle-input').val().trim();
		this.chosenName = newUserName;
		password = $('#new-password-input').val();//.trim();
		passwordAgain = $('#new-password-input-verify').val();//.trim();

		if (password === passwordAgain){
			//create new account with email and password
			//check if account already made
			firebase.auth().createUserWithEmailAndPassword(email, password).catch(function(error) {
				// Handle Errors here.
				var errorCode = error.code;
				var errorMessage = error.message;
				//call create user profile here
				if (errorCode == 'auth/email-already-in-use') {
					alertModal('Account already in use');
					clearEls('#user-name-input', '#password-input', '#password-again-input');
				} else {
					alertModal(errorMessage);
				}
				console.log(error);
			});

		} else {
			alertModal("Passwords do not match")
			clearEls('#password-input', '#password-again-input');
		}

	},

	login: function(){

		email = $('#user-name-input').val();
		password = $('#password-input').val();

		clearEls('#user-name-input', '#password-input');

		//sign in existing user
		firebase.auth().signInWithEmailAndPassword(email, password).catch(function(error) {
			// Handle Errors here.
			var errorCode = error.code;
			var errorMessage = error.message;
			if(errorCode == 'auth/wrong-password'){
				alertModal("wrong password");
				$('#password-input').val("");
			}

		});

	},

	//add sign out event

	signout: function(){

		firebase.auth().signOut().then(function() {
			
		}).catch(function(error) {
			// An error happened.
		});
	},

	//Set an authentication state observer and get user data
	//currently signed in user

	authenticationListener: function(){

		firebase.auth().onAuthStateChanged(function(user) {
			
			if (user) {
				// user is signed in
				$(".modal").hide();
				// close sign in modal here

				//capture unique user id at
				loginHandler.userID = user.uid;

				db.ref().once('value').then(function(snapshot) {

					if (snapshot.child('users').child(loginHandler.userID).exists()){ 
					//return the user profile associated with the id
						loginHandler.setPlayerStatus();

					} else { //if the user id signed in does not have a profile, push one
						loginHandler.userProfile();
					}
				});
			
			} else {
				loginHandler.clearPlayer();

				// user is signed out
				// re-open up sign-in modal
				$("#login-modal").show();
			}
		});
	},

	//pushes userprofile to database
	userProfile: function(){ 
		//https://stackoverflow.com/questions/42885707/using-push-method-to-create-new-child-location-without-unique-key
		db.ref('users').child(this.userID).set({
			username: loginHandler.chosenName,
			score: "", //latestScore
			stats: "", //currentStats
			avatar: "",
		}).then(function() {
			loginHandler.setPlayerStatus();
		});
	},
	
	//sets which player logging in user is 
	setPlayerStatus: function(){

		db.ref().once('value').then(function(snapshot) {

			var p1 = snapshot.val().current.player1;
			var p2 = snapshot.val().current.player2;
			var localUsername = snapshot.val().users[loginHandler.userID].username;
			var uid = loginHandler.userID;

			if (p1.uid === uid || p2.uid === uid){
				//if a player is already assigned
				alert("player already assigned");

			} else {

				if (p1.state === 'inactive'){
					loginHandler.currPlayer = "player1";
					alert('player1 catch')
					setActivePlayer('player1', uid, localUsername)
				} else if (p2.state === "inactive"){
					loginHandler.currPlayer = "player2";
					alert('player2 catch')
					setActivePlayer('player2', uid, localUsername)
				}

			}

		});
	},

	setActivePlayer: function(player, uid, username) {
		db.ref('current').child(player).set({
			state: "active",
			uid: uid, 
			code: "",
			avatar: `https://robohash.org/${username}.png?size=200x200`,
			username: username
		});

		setLocalPlayers(player);
	},
	
	//forces the current player to clear out their player status
	clearPlayer: function(){
		if (this.currPlayer !== ""){
			db.ref('current').child(loginHandler.currPlayer).set({
				state: "inactive",
				uid: "", 
				code: "",
				avatar: "",
				username: ""
			});
		}
	},

	//pushes userprofile to db
	userProfile: function(){ 
		//https://stackoverflow.com/questions/42885707/using-push-method-to-create-new-child-location-without-unique-key
		db.ref('users').child(this.userID).set({
			username: loginHandler.chosenName,
			score: "", //latestScore
			stats: "" //currentStats
		});
	}
}

//################### end handler object

//jquery handlers for login object

$("#new-user-modal").hide();
$("#sign-out").hide();

//event listener for login state change
loginHandler.authenticationListener();

//open new user submission form
$("#add-newuser-btn").on("click", function(event){
	loginHandler.showNewUserForm();
});

//create a new user with email and password
$("#submit-newuser-btn").on("click", function(event){
	event.preventDefault();
	loginHandler.submitNewUser();
});

//modal login
$("#login-btn").on("click", function(event){
	event.preventDefault();
	loginHandler.login();
});

$("#sign-out").on("click", function(event){
	event.preventDefault();
	loginHandler.signout();
});


//###########################################################################

//need to get out username and return to terry

//github authentication

//on disconnect even 



// End of Kyles Log In Code

//Function to clear elements values
function clearEls() {
	arguments.forEach( function(el) {
		$(el).val("");
	});
}


// Capture User Input Section 

// Set the interval for code checks
function startInterval() {
	var pushInterval = setInterval(function() {
		var currStr = $("#current-player textarea").val();
		pushChanges(currStr);
	}, 100);
}

// Enable Tab character in textareas for coding
$("textarea").keydown(captureTabPress);

// Push data to firebase for the current player
function pushChanges(str) {
	db.ref(`/current/${currPlayer}/code`).set(str);
}

// Listener and updater for other player's code
function listenForCodeUpdates() {
	db.ref(`/current/${otherPlayer}/code`).on("value", function(data) {
		updateOtherPlayer(data.val());
	});
}

// Function to update other player
function updateOtherPlayer(str) {
	$("#other-player textarea").text(str);
}


/* Function to set local current and other player */
function setLocalPlayers(str) {
	if (str === "player1") {
		currPlayer = str;
		otherPlayer = "player2"
	} else if (str === "player2") {
		currPlayer = str;
		otherPlayer = "player1"
	}
}

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
function checkIfBothActive(snapshot) {
	var currObj =snapshot.val();

	if (currPlayer === "player1" &&
	currObj.player1.state === "active" &&
	currObj.player2.state === "active") {
		db.ref("questions").once("value", getRandomQuestion);
	}
}


/* Issue #46 */
/* Write a function that will read the current questions object from Firebase. From those questions, filter out the ones that have already been asked. From the unasked questions, choose a random one, and return that question number. */
function getRandomQuestion(snapshot) {
	var qObj = snapshot.val();
	var qKeys = Object.getOwnPropertyNames(qObj);
	var unaskedQuestions = jQuery.grep(qKeys, function(question){
		return !qObj[question].asked;
	})

	if (unaskedQuestions.length === 0){
		resetQuestions();
		return;
	}

	var randomNum = Math.floor(Math.random()*unaskedQuestions.length);

	// Set question to asked
	db.ref(`questions/${unaskedQuestions[randomNum]}/asked`).set(true);

	setCurrentFBQuestion(unaskedQuestions[randomNum]);
}

function resetQuestions() {
	db.ref("questions").once("value", function(snapshot) {
		var qKeys = Object.getOwnPropertyNames(snapshot.val());
		var updateObj = {};

		qKeys.forEach(function(key){
			updateObj[`${key}/asked`] = false;
		});

		db.ref("questions").update(updateObj, function() {
			db.ref("questions").once("value", getRandomQuestion);
		});
	})
}


/* Issue #40 */
/* Write a function that will be passed a question number. Set the Firebase current question to that question number.  */
function setCurrentFBQuestion(qNum) {
	db.ref("current/question").set(qNum);
}


/* Issue #59 */
/* Function that will listen for changes to current question, and grab that question from Firebase when it does change. */
function getNewQuestion(snapshot) {
	var qNum = snapshot.val();

	if (qNum !== "") {
		db.ref(`questions/${qNum}`).once("value", function(snapshot) {
			currQuestion = snapshot.val();
		});
	}
}


/* Function to add question to page */
function displayCurrentQuestion() {
	$("#question-text").text(currQuestion.question);

	var name = currQuestion.function.name;
	var args = buildArgList(currQuestion.function.args);
	var startFunc = `function ${name}(${args}) {\n\t`;
	var endFunc = "\n}"

	var textArea = $("#current-player textarea");
	$(textArea).text(startFunc + endFunc);

	// Position cursor in correct spot
	textArea.selectionStart = startFunc.length;
	textArea.selectionEnd = startFunc.length;
}


/* Function to handle code submit button click */
function handleCodeSubmission() {
	var code = $("#current-player textarea").val();

	checkUserCode(code, currQuestion, codePassed, codeFailed);
}

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
		var functionString = buildFunctionString(test, question);

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
			
			if (!failed) { 
				failed = true;
				failFunc(e);
			}
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

	/* Build full function string for testing */
	function buildFunctionString(test, question) {
		var f = question.function;
		//var args = buildArgList(f.args);
		var params = buildArgList(test.params);

		var fullStr = `${str} postMessage( ${f.name}(${params}) ); `;

		// Change for now, since text area will have full function
		/*var fullStr = `function ${f.name}(${args}) { \n ${str} \n }  `+
					`postMessage( ${f.name}(${params}) ); `;*/

		return fullStr;
	}
}


/* Builds a function argument list from an array*/
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


/* Function which will run if the user code passes the tests */
function codePassed() {
	console.log("Code passed");

	db.ref("current/winner").setWithPriority(currPlayer, 2);
}


/* Reset the winner to empty */
function resetWinner() {
	// called prior to new rounds
	db.ref("current/winner").set("");
}


/* Function to run if the user code fails */
function codeFailed(err) {
	var errDiv = $("<div class='err-msg'>");
	var textEl = $("<p class='err-text'>").text(err.message);

	var okBtn = $("<input type='button' class='err-btn' value='OK'>")

	$("#current-player").append( $(errDiv).append(textEl, okBtn) );

	$(".err-btn").click(closeErrorMessage);
}


/* Function that checks for, and shows the winner */
function showWinner(snapshot) {
	var winner = snapshot.val();

	if (winner !== "") {
		if (winner === currPlayer) {
			console.log("you won");
		} else {
			console.log("other player won");
		}
	}
}


/* Close error message display */
function closeErrorMessage(e) {
	e.preventDefault();

	$( $(this).parent() ).remove();
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

// Function to create an alert modal and remove the need for actual alerts
function alertModal(str) {
	var modalDiv = $("<div class='alert-modal'>");
	var alertMsg = $("<p class='alert-text'>").text(str);

	var okBtn = $("<input type='button' class='alert-btn' value='OK'>")

	$("#modal-content").append( $(modalDiv).append(alertMsg, okBtn) );
	$(".modal").css("display", "block");
	$("#modal-content").css("display", "block");

	$(".alert-btn").click(closeAlert);

}

function closeAlert(event) {
	event.preventDefault();

	$( $(this).parent() ).remove();
}



