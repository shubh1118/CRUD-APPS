import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyBi6JRRbjgUGYCE_B1UkUgd4FXg2UzyBes",
  authDomain: "my-art-gallery-ef544.firebaseapp.com",
  projectId: "my-art-gallery-ef544",
  storageBucket: "my-art-gallery-ef544.firebasestorage.app",
  messagingSenderId: "1052326715022",
  appId: "1:1052326715022:web:feb066588b56d0b5f8f3df",
  measurementId: "G-J7ZWWB99J4",
};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

const auth = getAuth(app);

const analytics = typeof window !== "undefined" && getAnalytics(app);

export { app, auth, analytics };
