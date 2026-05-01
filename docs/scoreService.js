function getRanking() {
  return JSON.parse(localStorage.getItem("ranking") || "[]");
}

function saveRanking(data) {
  localStorage.setItem("ranking", JSON.stringify(data));
}

function addScore(name, score) {

  let ranking = getRanking();

  if (!Array.isArray(ranking)) ranking = [];

  ranking.push({
    name: name,
    score: score
  });

  ranking.sort((a, b) => b.score - a.score);

  ranking = ranking.slice(0, 10);

  saveRanking(ranking);
}
