// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth"; // For user authentication
import { getFirestore } from "firebase/firestore"; // For the database

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDnS38oF0dh0EcLAR-77BOq3BFaRPjqfGY",
  authDomain: "purrlysapp.firebaseapp.com",
  projectId: "purrlysapp",
  storageBucket: "purrlysapp.firebasestorage.app",
  messagingSenderId: "1013207923337",
  appId: "1:1013207923337:web:7960576c47c6d5f1102458",
  measurementId: "G-8MFVD1EKZ3"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize and export the essential Firebase services that we will use
export const auth = getAuth(app);
export const db = getFirestore(app);