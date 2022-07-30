import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: `${process.env.REACT_APP_FIREBASE_API_KEY}`,
  authDomain: "house-marketplace-app-af827.firebaseapp.com",
  projectId: "house-marketplace-app-af827",
  storageBucket: "house-marketplace-app-af827.appspot.com",
  messagingSenderId: "396937336082",
  appId: "1:396937336082:web:1843087dd8f282bd314fcb",
};

// Initialize Firebase
initializeApp(firebaseConfig);

export const db = getFirestore();
