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
        $("#sign-out").show();
        $("#new-user-modal").hide();
        $("#login-modal").hide();
        // show an html element with user name of currently signed in
        // close sign in modal here

        //capture unique user id at
        loginHandler.userID = user.uid;

        db.ref().once('value').then(function(snapshot) {

          if (snapshot.child('users').child(loginHandler.userID).exists()){ //return the user profile associated with the id

            //console.log("user has profile")

            loginHandler.setPlayerStatus();

          } else { //if the user id signed in does not have a profile, push one

            //console.log("user does not have profile")
            loginHandler.userProfile();

            loginHandler.setPlayerStatus();

          }

        });
      
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

      localUsername = (snapshot.child('users').child(loginHandler.userID).child('username').val());

      //############new

      if (playerAssigned1 === loginHandler.userID){//if a player is not already assigned

        alert("player already assigned");

        loginHandler.currPlayer = "player1";
        loginHandler.persistence();

        loginHandler.reactivate('player1')

      } else if(playerAssigned2 === loginHandler.userID){

        alert("player already assigned");

        loginHandler.currPlayer = "player2";
        loginHandler.persistence();

        loginHandler.reactivate('player2')
       
      //############new

      } else {

        if (player1state === 'inactive'){

          loginHandler.currPlayer = "player1";

          //############new
          loginHandler.deactivate('player1');
          loginHandler.persistence();
          //###############NEW

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

          //############new
          loginHandler.deactivate('player2');
          loginHandler.persistence();
          //###############NEW

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

  },

  //####################new

  persistence: function(){

    firebase.auth().setPersistence(firebase.auth.Auth.Persistence.SESSION).then(function() {

      loginHandler.deactivate(loginHandler.currPlayer);
      // Existing and future Auth states are now persisted in the current
      // session only. Closing the window would clear any existing state even
      // if a user forgets to sign out.
      // ...
      // New sign-in will be persisted with session persistence.
      return firebase.auth().signInWithEmailAndPassword(email, password);
    })
    .catch(function(error) {
      // Handle Errors here.
      var errorCode = error.code;
      var errorMessage = error.message;
    });

  },

  deactivate: function(player){

    var ref = db.ref(`current/${player}/state`);

    ref.onDisconnect().set("inactive");
      
  },

  reactivate: function(player){

    var ref = db.ref(`current/${player}/state`);

    ref.set("active");
      
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


//## full game function if you want to use it


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
//###########in dev does not work please ignore this shitty code##############


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