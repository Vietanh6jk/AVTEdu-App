// Import the functions you need from the SDKs you need
const { initializeApp } = require('firebase/app');
const analytics = require('firebase/analytics');
const { getAuth } = require('firebase/auth');
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCEhP5B7untyKlqL2NxB6Omfa9zxNgRGJU",
  authDomain: "evtedu-app.firebaseapp.com",
  projectId: "evtedu-app",
  storageBucket: "evtedu-app.appspot.com",
  messagingSenderId: "726536765718",
  appId: "1:726536765718:web:701de4686a32e4c2949037",
  measurementId: "G-35LDCBEEHF"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const defaultAuth = getAuth(app);


module.exports = {
  defaultAuth, app
};


