import firebase from "firebase";

var firebaseConfig = {
  apiKey: "AIzaSyAKt575GdMEOih-L5wNvEsHxUM75XCRK_U",
  authDomain: "e-commerce-app-b62a8.firebaseapp.com",
  databaseURL: "https://e-commerce-app-b62a8.firebaseio.com",
  projectId: "e-commerce-app-b62a8",
  storageBucket: "e-commerce-app-b62a8.appspot.com",
  messagingSenderId: "231876068069",
  appId: "1:231876068069:web:3ca20eb9464bda835f0a0c",
  measurementId: "G-W9EMG2GMKE",
};

const Firebase = firebase.initializeApp(firebaseConfig);

export default Firebase;
