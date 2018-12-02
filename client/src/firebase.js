// src/firebase.js
//
import firebase from 'firebase'

  var config = {
 };
  firebase.initializeApp(config);
export const  provider = new firebase.auth.GoogleAuthProvider();
export const auth = firebase.auth();


export default firebase;
