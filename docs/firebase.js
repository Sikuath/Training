// firebase.js

import { initializeApp } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-app.js";

import { getFirestore } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyCUFUBpQSo4B1K4INcmYmZlgLXz5NII0GA",
  authDomain: "score-training-github.firebaseapp.com",
  projectId: "score-training-github",
  storageBucket: "score-training-github.firebasestorage.app",
  messagingSenderId: "301790945003",
  appId: "1:301790945003:web:cc451bc62b22e231d8a8ae"
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
