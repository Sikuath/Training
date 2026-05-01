function getRanking() {
  return JSON.parse(localStorage.getItem("ranking") || "[]");
}

function saveRanking(data) {
  localStorage.setItem("ranking", JSON.stringify(data));
}

function addScore(name, score) {

  let ranking = getRanking();

  if (!Array.isArray(ranking)) ranking = [];

  ranking.push({ name, score });

  ranking.sort((a, b) => b.score - a.score);

  ranking = ranking.slice(0, 10);

  saveRanking(ranking);
}

function getBestScore() {
  const ranking = getRanking();
  if (!ranking.length) return 0;
  return Math.max(...ranking.map(e => e.score));
}
