// src/utils/firebase.ts
import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth'; // <--- ADD THIS IMPORT!
import { getAnalytics } from "firebase/analytics"; // Keep if you want analytics

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBi6JRRbjgUGYCE_B1UkUgd4FXg2UzyBes",
  authDomain: "my-art-gallery-ef544.firebaseapp.com",
  projectId: "my-art-gallery-ef544",
  storageBucket: "my-art-gallery-ef544.firebasestorage.app",
  messagingSenderId: "1052326715022",
  appId: "1:1052326715022:web:feb066588b56d0b5f8f3df",
  measurementId: "G-J7ZWWB99J4"
};

// Initialize Firebase
// Check if app is already initialized to prevent errors in Next.js development mode
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

// Initialize Firebase Authentication
const auth = getAuth(app); // <--- ADD THIS LINE!

// Initialize Firebase Analytics (optional, remove if not needed)
const analytics = typeof window !== 'undefined' && getAnalytics(app); // Analytics needs window context

export { app, auth, analytics }; // <--- Export auth (and analytics if you keep it)