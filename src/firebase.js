// src/firebase.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCYi-6vZqsSsI6X1hhXHcABR--MlD3-mTY",
  authDomain: "ellez-site.firebaseapp.com",
  projectId: "ellez-site",
  storageBucket: "ellez-site.appspot.com",
  messagingSenderId: "161384067066",
  appId: "1:161384067066:web:930f110220098cd8023e43",
  measurementId: "G-6HE4SQY29B"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);