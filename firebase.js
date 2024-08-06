// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDtADGUK_xAp4gECghtjCqvggrr6xyYdqU",
  authDomain: "inventory-management-6df67.firebaseapp.com",
  projectId: "inventory-management-6df67",
  storageBucket: "inventory-management-6df67.appspot.com",
  messagingSenderId: "217416177985",
  appId: "1:217416177985:web:6a58db0b0b7ef73f59e9c0",
  measurementId: "G-FELXBFE30T"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);    