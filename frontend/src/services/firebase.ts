// src/services/firebase.ts
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyB1oS7TaJnPue1jz_VnEDGvz32BaGE2wR4",
    authDomain: "liquid-bitcoin-yield-engine.firebaseapp.com",
    projectId: "liquid-bitcoin-yield-engine",
    storageBucket: "liquid-bitcoin-yield-engine.firebasestorage.app",
    messagingSenderId: "247407682978",
    appId: "1:247407682978:web:8f4535897587e6b2e07efb",
    measurementId: "G-CQS2STXK2T"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
