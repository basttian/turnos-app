<script>
  import { FirebaseApp, User, Doc, Collection } from "sveltefire";
  import firebase from "firebase/app";
  import "firebase/firestore";
  import "firebase/auth";
  import "firebase/performance";
  import "firebase/analytics";
  import { usuario } from './Store/store.js'
  
  let firebaseConfig = {
  // Your web app's Firebase configuration
    apiKey: "AIzaSyCCOnUvMBH56Jln9imAZo1Pio2Aesh1DOA",
    authDomain: "food-app-33495.firebaseapp.com",
    databaseURL: "https://food-app-33495.firebaseio.com",
    projectId: "food-app-33495",
    storageBucket: "food-app-33495.appspot.com",
    messagingSenderId: "1042636311170",
    appId: "1:1042636311170:web:c96148932ff111e551c29b",
    measurementId: "G-ZTFKMKZRD1"
  };

  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);
  firebase.analytics();

let isUserInLine = false;
let userPhone ="";

  firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
      // User is signed in.
      var displayName = user.displayName;
      var email = user.email;
      var emailVerified = user.emailVerified;
      var photoURL = user.photoURL;
      var isAnonymous = user.isAnonymous;
      var uid = user.uid;
      var providerData = user.providerData;
      var tel = user.phoneNumber;
      console.log(tel)
      isUserInLine = true;
      userPhone = tel;
      usuario.set(uid);
    } else {
      console.log("No User");
      isUserInLine = false;
    }
  });



  import LOGIN from "./Login.svelte";
  import HOME from "./Home.svelte";

</script>
<svelte:head>
<title>Food-App</title>
<script src="https://www.google.com/recaptcha/api.js?render=6LeQ_bUUAAAAACds7b5onjvvWkX8cyyr6eP1iDND"></script>
</svelte:head>

<!-- SIte Online
6Lewca4ZAAAAAL1HejWYnivEDTAZtsW-XPkW0mIX
 -->
 <!-- Localhost 
 6LeQ_bUUAAAAACds7b5onjvvWkX8cyyr6eP1iDND
  -->
<!-- <span class="uk-margin-small-right" uk-spinner="ratio: 3"></span> -->

{#if !isUserInLine}
<LOGIN/>
{:else}
<HOME />
{/if}


