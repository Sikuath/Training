import { initializeApp } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-app.js";
import {
  getFirestore,
  collection,
  addDoc,
  getDocs,
  getDoc,
  setDoc,
  updateDoc,
  doc,
  increment,
  query,
  where,
  orderBy,
  limit
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";

/* =========================
   CONFIG FIREBASE
========================= */

const firebaseConfig = {
  apiKey: "AIzaSyCUFUBpQSo4B1K4INcmYmZlgLXz5NII0GA",
  authDomain: "score-training-github.firebaseapp.com",
  projectId: "score-training-github",
  storageBucket: "score-training-github.firebasestorage.app",
  messagingSenderId: "301790945003",
  appId: "1:301790945003:web:cc451bc62b22e231d8a8ae",
  measurementId: "G-YD5V4T8EEX"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

/* =========================
   WRITE
========================= */

export async function addScore(game, name, score) {

  await addDoc(collection(db, "scores"), {
    game,
    name,
    score,
    timestamp: Date.now()
  });

}

/* =========================
   READ
========================= */

export async function getRanking(game) {

  const q = query(
    collection(db, "scores"),
    where("game", "==", game),
    orderBy("score", "desc"),
    limit(10)
  );

  const snap = await getDocs(q);

  const ranking = [];

  snap.forEach(doc => ranking.push(doc.data()));

  return ranking;
}
export async function getBestPlayer(game) {

  const q = query(
    collection(db, "scores"),
    where("game", "==", game),
    orderBy("score", "desc"),
    limit(1)
  );

  const snap = await getDocs(q);

  if (snap.empty)
    return { name: "---", score: 0 };

  return snap.docs[0].data();
}

/* =========================
   VISITEURS
========================= */

export async function incrementVisitorCount() {

  const ref = doc(db, "stats", "global");

  const snap = await getDoc(ref);

  if (!snap.exists()) {

    await setDoc(ref, {
      visitors: 1
    });

  } else {

    await updateDoc(ref, {
      visitors: increment(1)
    });

  }
}


export async function getVisitorCount() {

  const ref = doc(db, "stats", "global");

  const snap = await getDoc(ref);

  if (!snap.exists()) return 0;

  return snap.data().visitors || 0;
}

function getTodayKey() {
  return new Date().toISOString().slice(0, 10); // YYYY-MM-DD
}

export function shouldCountVisit() {
  const last = localStorage.getItem("lastVisit");
  const today = getTodayKey();

  return last !== today;
}

export function markVisit() {
  localStorage.setItem("lastVisit", getTodayKey());
}