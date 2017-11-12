$("#new-user-modal").hide();
$("#sign-out").hide();

  // Initialize Firebase
var config = {
    apiKey: "AIzaSyBQvtQvPuAfLIyeLNPhIXdvU8gWNTtMU9I",
    authDomain: "project1testing-377b6.firebaseapp.com",
    databaseURL: "https://project1testing-377b6.firebaseio.com",
    projectId: "project1testing-377b6",
    storageBucket: "project1testing-377b6.appspot.com",
    messagingSenderId: "547730341651"
  }

firebase.initializeApp(config);

var db = firebase.database()


var loginHandler = {

  // email: "",
  // password: "",
  // passwordAgain: "",
  
  chosenName: "",

  currPlayer: "",

  //capture user id from firebase
  userID: "",
  // user.uid

//############

  showNewUserForm: function(){

    $("#login-modal").hide();
    $("#new-user-modal").show();

  },

//########


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

  },

//########

  login: function(){

    email = $('#user-name-input').val();
      $('#user-name-input').val("");

    password = $('#password-input').val();
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

  },

//##################
//add sign out event

  signout: function(){

    firebase.auth().signOut().then(function() {
      
    }).catch(function(error) {
      // An error happened.
    });

  },

//#####################

  //Set an authentication state observer and get user data
  //currently signed in user

  authenticationListener: function(){

    firebase.auth().onAuthStateChanged(function(user) {
      
      if (user) {
        
        // user is signed in
        $("#sign-out").show();
        $("#new-user-modal").hide();
        $("#login-modal").hide();
        // show an html element with user name of currently signed in
        // close sign in modal here

        //capture unique user id at
        loginHandler.userID = user.uid;

        db.ref().once('value').then(function(snapshot) {

          if (snapshot.child('users').child(this.userID).exists()){ //return the user profile associated with the id

            //console.log("user has profile")

          } else { //if the user id signed in does not have a profile, push one

            //console.log("user does not have profile")
            loginHandler.userProfile();

          }

        });

        //still need login with unique username
        loginHandler.setPlayerStatus();
      
      } else {

        loginHandler.clearPlayer();

        // user is signed out
        // re-open up sign-in modal
        $("#login-modal").show();
        // change html element to show user signed out
        $("#sign-out").hide();
      }
    });

  },

//#####################


  //pushes userprofile to database
  userProfile: function(){ 
    //https://stackoverflow.com/questions/42885707/using-push-method-to-create-new-child-location-without-unique-key
    db.ref('users').child(this.userID).set({

      username: loginHandler.chosenName,
      score: "", //latestScore
      stats: "", //currentStats
      avatar: "",

    });

  },

//######################
  
  //sets which player logging in user is 
  setPlayerStatus: function(){

    var player1state = "";
    var player2state = "";
    var localUsername = "";
    var playerAssigned1 = "";
    var playerAssigned2 = "";

    db.ref().once('value').then(function(snapshot) {

      player1state = (snapshot.child('current').child('player1').child('state').val());
      player2state = (snapshot.child('current').child('player2').child('state').val());

      playerAssigned1 = (snapshot.child('current').child('player1').child('uid').val());
      playerAssigned2 = (snapshot.child('current').child('player2').child('uid').val());

      localUsername = (snapshot.child('users').child(this.userID).child('username').val());

      if (playerAssigned1 === this.userID || playerAssigned2 === this.userID){//if a player is not already assigned

        alert("player already assigned");

      } else {

        if (player1state === 'inactive'){

          loginHandler.currPlayer = "player1";

          alert('player1 catch')

          db.ref('current').child('player1').set({

            state: "active",
            uid: loginHandler.userID, 
            code: "",
            avatar: `https://robohash.org/${localUsername}.png?size=200x200`,
            username: localUsername

          });

        } else if (player2state === "inactive"){

          loginHandler.currPlayer = "player2";

          alert('player2 catch')

          db.ref('current').child('player2').set({

            state: "active",
            uid: loginHandler.userID, 
            code: "",
            avatar: `https://robohash.org/${localUsername}.png?size=200x200`,
            username: localUsername

          });

        }

      }

    });

  },

//######################
  
  //forces the current player to clear out their player status
  clearPlayer: function(){

    if (this.currPlayer !== ""){

      db.ref('current').child(this.currPlayer).set({

        state: "inactive",
        uid: "", 
        code: "",
        avatar: "",
        username: ""

      });

    }

  },

//#######################

  //pushes userprofile to db
  userProfile: function(){ 
    //https://stackoverflow.com/questions/42885707/using-push-method-to-create-new-child-location-without-unique-key
    db.ref('users').child(this.userID).set({

      username: this.chosenName,
      score: "", //latestScore
      stats: "" //currentStats

    });

  },

}

//###################

//jquery handlers for login

//might need to move event.preventdefaults into these functions

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


//event listenr for login state change
loginHandler.authenticationListener();

//#########################

function fullGame(){

  var player1state = "";
  var player2state = "";

  db.ref('current').once('value').then(function(snapshot) {
    
    player1state = (snapshot.child('player1').child('state').val());
    player2state = (snapshot.child('player2').child('state').val());
    if (player1state === 'inactive' || player2state === 'inactive'){
      console.log("spots open");
    } else {
      alert("game is full - try again later")
    }
  });
}


//#######################github auth###/////////////////////


$("#github-sign-in").on("click", function(event){

  var provider = new firebase.auth.GithubAuthProvider();

  provider.addScope('repo');

  firebase.auth().signInWithPopup(provider).then(function(result) {
    // This gives you a GitHub Access Token. You can use it to access the GitHub API.
    var token = result.credential.accessToken;
    // The signed-in user info.
    var user = result.user;
    // ...
  }).catch(function(error) {
    // Handle Errors here.
    var errorCode = error.code;
    var errorMessage = error.message;
    // The email of the user's account used.
    var email = error.email;
    // The firebase.auth.AuthCredential type that was used.
    var credential = error.credential;
    // ...
  });

});