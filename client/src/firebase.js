// src/firebase.js
//
import firebase from 'firebase'

  var config = {
    apiKey: "AIzaSyAgVtPmMElvVaG33Rf7lXw6J3h02lui0F0",
    authDomain: "datboi-coin.firebaseapp.com",
    databaseURL: "https://datboi-coin.firebaseio.com",
    projectId: "datboi-coin",
    storageBucket: "",
    messagingSenderId: "1044269580151"
  };
  firebase.initializeApp(config);
export const  provider = new firebase.auth.GoogleAuthProvider();
export const auth = firebase.auth();


export default firebase;
