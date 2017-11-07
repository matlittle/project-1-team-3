$("#new-user-modal").hide();
$("#sign-out").hide();

var email = "";
var password = "";
var passwordAgain = "";

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

  email = $('#new-user-name-input').val();//.trim();
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

  email = $('#user-name-input').val();//.trim();
    //$('#user-name-input').val("");

  password = $('#password-input').val();//.trim();
    //$('#password-input').val("");

  //sign in existing user
  firebase.auth().signInWithEmailAndPassword(email, password).catch(function(error) {
    // Handle Errors here.
    var errorCode = error.code;
    var errorMessage = error.message;

  });

});

//need to add sign out event
$("#sign-out").on("click", function(event){
  event.preventDefault();

// firebase.auth().signOut().then(function() {
//   // Sign-out successful.
// }).catch(function(error) {
//   // An error happened.
// });

});


//Set an authentication state observer and get user data
//currently signed in user
firebase.auth().onAuthStateChanged(function(user) {
  if (user) {
    //close sign in modal here?
    //$("#login-modal").hide();

    // user is signed in
    $("#sign-out").show();
    // show an html element with user name of currently signed in
    // close sign in modal here
    var email = user.email;
  } else {
    // user is signed out
    // re-open up sign-in modal
    // change html element to show user signed out
    $("#sign-out").hide();
  }
});

