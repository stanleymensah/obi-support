// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {getAuth} from 'firebase/auth';
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDkH0Pg0KudTRunCOgYAr0fgAwx0bWwiCY",
  authDomain: "obi-support.firebaseapp.com",
  projectId: "obi-support",
  storageBucket: "obi-support.firebasestorage.app",
  messagingSenderId: "60568151591",
  appId: "1:60568151591:web:a56558cf128da100e85002"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export {auth, db}