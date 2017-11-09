$("#new-user-modal").hide();
$("#sign-out").hide();

var email = "";
var password = "";
var passwordAgain = "";
var chosenName = "";

//capture user id from firebase
var userID = "";
// user.uid

// Initialize Firebase
var config = {
  apiKey: "AIzaSyBQvtQvPuAfLIyeLNPhIXdvU8gWNTtMU9I",
  authDomain: "project1testing-377b6.firebaseapp.com",
  databaseURL: "https://project1testing-377b6.firebaseio.com",
  projectId: "project1testing-377b6",
  storageBucket: "project1testing-377b6.appspot.com",
  messagingSenderId: "547730341651"
};
firebase.initializeApp(config);

var database = firebase.database();


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

    if (userID in database.ref('users')){ //return the user profile associated with the id

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
function userProfile(){ 
  //https://stackoverflow.com/questions/42885707/using-push-method-to-create-new-child-location-without-unique-key
  database.ref('users').child(userID).set({

    username: chosenName,
    score: "", //latestScore
    stats: "", //currentStats
    avatar: ""

  });

}

function setPlayerStatus(){

  var player1state = "";
  var player2state = "";
  var localUsername = "";

  database.ref().once('value').then(function(snapshot) {
    // var username = (snapshot.val());
    player1state = (snapshot.child('current').child('player1').child('state').val());
    player2state = (snapshot.child('current').child('player2').child('state').val());
    localUsername = (snapshot.child('users').child(userID).child('username').val());
    console.log(player1state);
    console.log(player2state);
    console.log(localUsername);

    if (player1state === 'none'){// || player1state === "joining"

      alert('player1 catch')

      database.ref('current').child('player1').set({

        state: "active",
        uid: userID, 
        code: "",
        avatar: `https://robohash.org/${localUsername}.png?size=200x200`

      });

    } else if (player2state === "none"){// || player2state === "joining"


      alert('player2 catch')

      database.ref('current').child('player2').set({

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

