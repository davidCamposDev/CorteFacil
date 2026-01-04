import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyB_FIoUWV3Yjgq37AyZDgd6ws0VAJiyyN8",
  authDomain: "cortefacil-2a9ba.firebaseapp.com",
  projectId: "cortefacil-2a9ba",
  storageBucket: "cortefacil-2a9ba.firebasestorage.app",
  messagingSenderId: "553794905615",
  appId: "1:553794905615:web:48d8c17d36ef0a7f11a57a",
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
