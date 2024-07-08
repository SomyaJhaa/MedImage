// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
//import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBubN_2MxEFI7MNKo-yf4zgYl5O9EZo-cY",
  authDomain: "first-cac5b.firebaseapp.com",
  projectId: "first-cac5b",
  storageBucket: "first-cac5b.appspot.com",
  messagingSenderId: "416471197747",
  appId: "1:416471197747:web:8a148f8ab1812e205edb46",
  measurementId: "G-8P22QWEDEE"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
//const analytics = getAnalytics(app);
export default app;