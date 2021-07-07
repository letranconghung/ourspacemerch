var provider = new firebase.auth.OAuthProvider('microsoft.com');
provider.setCustomParameters({
  // Force re-consent.
  prompt: 'consent',
  // Target specific email with login hint.
  login_hint: 'username@acsians.acsi.edu.sg',
  tenant: '3b2f12de-4d54-490b-908f-dc26b91244dc'
});
provider.addScope('files.readwrite.all');
firebase.auth().getRedirectResult().then(result=>{
  var credential = result.credential;

  var accessToken = credential.accessToken;
  var idToken = credential.idToken;
  console.log("received redirect");
  console.log(credential);
})
.catch(error=>{
  console.log("error: ", error.message);
});

firebase.auth().onAuthStateChanged(user=>{
  if(user){
    var uid = user.uid;
    console.log("user:", user, "uid: ", uid);
  }else{
    console.log("not logged in");
  }
});

function signIn(){
  console.log("firebase signIn called");
  firebase.auth().signInWithRedirect(provider);
}

function signOut(){
  console.log("firebase signOut called");
  firebase.auth().signOut().then(()=>{
    console.log('sign out successful');
  }).catch(e=>{
    console.log("firebase signout error:", e);
  })
}

