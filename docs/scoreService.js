f"unction getRanking(game) {
  return JSON.parse(localStorage.getItem("ranking_" + game) || "[]");
}

function saveRanking(game, data) {
  localStorage.setItem("ranking_" + game, JSON.stringify(data));
}

function addScore(game, name, score) {

  let ranking = getRanking(game);

  if (!Array.isArray(ranking)) ranking = [];

  ranking.push({ name, score });

  ranking.sort((a, b) => b.score - a.score);

  ranking = ranking.slice(0, 10);

  saveRanking(game, ranking);
}

function getBestScore(game) {
  const ranking = getRanking(game);
  if (!ranking.length) return 0;
  return Math.max(...ranking.map(e => e.score));
}
