// firebaseConfig.js
// Firebase initialization, used by both admin.html and index.html

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyAVWEfIsLDQXpFuNBsczVjM7tMaLiHyAmE",
  authDomain: "s4ds-2590f.firebaseapp.com",
  projectId: "s4ds-2590f",
  storageBucket: "s4ds-2590f.appspot.com",
  messagingSenderId: "21704377539",
  appId: "1:21704377539:web:0c2bf8700b626ef13a8e76",
  measurementId: "G-PLM46ZP9HJ"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
