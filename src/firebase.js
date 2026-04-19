/* eslint-disable no-unused-vars */
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getDatabase } from "firebase/database";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCqx4BKYfcVFyEzeruloUflwzhRIAG7fw8",
  authDomain: "dss-supplier-5f490.firebaseapp.com",
  projectId: "dss-supplier-5f490",
  storageBucket: "dss-supplier-5f490.firebasestorage.app",
  messagingSenderId: "186574528880",
  appId: "1:186574528880:web:80c4fabbed09e3c614afb5"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getDatabase(app);
