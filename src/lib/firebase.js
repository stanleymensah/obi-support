// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {getAuth} from 'firebase/auth';
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCwD3Q-mVkJxCe3RrH2PLAgvHo7iECPLeg",
  authDomain: "obi-support-5be65.firebaseapp.com",
  projectId: "obi-support-5be65",
  storageBucket: "obi-support-5be65.firebasestorage.app",
  messagingSenderId: "727221359174",
  appId: "1:727221359174:web:e1af3c4feb5a80cec6b047"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export {auth, db}