import {
  incrementVisitorCount,
  getVisitorCount,
  shouldCountVisit,
  markVisit,
  getGameStats
} from "./scoreService.js";

window.addEventListener("DOMContentLoaded", async () => {

  // =========================
  // COMPTEUR VISITEURS
  // =========================

  if (shouldCountVisit()) {
    await incrementVisitorCount();
    markVisit();
  }

  const count = await getVisitorCount();

  const visitor = document.getElementById("visitorCount");
  if (visitor) {
    visitor.textContent = `👥 ${count} visiteurs`;
  }

  // =========================
  // TABLEAU DES STATS
  // =========================

  const games = [
    ["significatifs", "📐 Chiffres significatifs"],
    ["conversions",   "🔢 Conversions"],
    ["expressions",   "🧮 Expressions"],
    ["incertitudes",  "📏 Incertitudes"]
];

  const stats = await Promise.all(
    games.map(([id]) => getGameStats(id))
  );

  const board = document.getElementById("statsBoard");

  if (!board) return;

  board.innerHTML = `
  <h3>📊 Statistiques des jeux</h3>

  <table class="stats-table">
  <thead>
  <tr>
  <th>Mini-jeu</th>
  <th>Record</th>
  <th>Joueurs</th>
  </tr>
  </thead>

  <tbody>
  ${games.map(([id, nom], i) => `
  <tr>
  <td>${nom}</td>
  <td>${stats[i].best}</td>
  <td>${stats[i].players}</td>
  </tr>
  `).join("")}
  </tbody>
  </table>
  `;
});

   // =========================
  // JEU ALEATOIRE
  // =========================

document.addEventListener("DOMContentLoaded", () => {

  const games = [
    "significatifs.html",
    "conversions.html",
    "expressions.html",
    "incertitudes.html"
  ];

  const btn = document.getElementById("randomGameBtn");

  if (btn) {
    btn.addEventListener("click", () => {

      const random = games[Math.floor(Math.random() * games.length)];

      window.location.href = random;
    });
  }
});