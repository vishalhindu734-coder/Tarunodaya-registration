import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth, signInAnonymously } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBI9xh-UurI87XU3Htyg96AR488FTrSsNk",
  authDomain: "youthevent2.firebaseapp.com",
  projectId: "youthevent2",
  storageBucket: "youthevent2.firebasestorage.app",
  messagingSenderId: "370207001275",
  appId: "1:370207001275:web:56deadb69de9b8f8dff79e",
  measurementId: "G-Z2609VKFE1"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);

// Auto-sign in anonymously if needed
if (typeof window !== 'undefined') {
  signInAnonymously(auth).catch(err => {
    console.warn("Anonymous auth auto-signin notice:", err?.message || err);
  });
}

