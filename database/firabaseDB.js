import * as firebase from 'firebase';

const firebaseConfig = {
  apiKey: "AIzaSyDCg7YYgFIyFY_4SS9vTfZ4ACYhWqhnrGY",
  authDomain: "myproject-f3517.firebaseapp.com",
  databaseURL: "https://myproject-f3517.firebaseio.com",
  projectId: "myproject-f3517",
  storageBucket: "myproject-f3517.appspot.com",
  messagingSenderId: "565896528358",
  appId: "1:565896528358:web:e8bfe607c588004f71d627"
};


firebase.initializeApp(firebaseConfig);

/*
if(!firebase.apps.length){
    // Initialize Firebase
    firebase.initializeApp(firebaseConfig);
  }
*/

export default firebase;