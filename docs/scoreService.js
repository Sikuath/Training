import { db } from "./firebase.js";

import {
    collection,
    addDoc,
    getDocs,
    query,
    where,
    orderBy,
    limit
}
from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";


export async function addScore(game, name, score) {

    await addDoc(collection(db, "scores"), {

        game,
        name,
        score,
        timestamp: Date.now()

    });

}


export async function getRanking(game) {

    const q = query(
        collection(db, "scores"),
        where("game", "==", game),
        orderBy("score", "desc"),
        limit(10)
    );

    const snap = await getDocs(q);

 "   let ranking = [];

    snap.forEach(doc => ranking.push(doc.data()));

    return ranking;

}


export async function getBestScore(game) {

    const ranking = await getRanking(game);

    if (ranking.length === 0)
        return 0;

    return ranking[0].score;

}
