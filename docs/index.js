import {
  incrementVisitorCount,
  getVisitorCount,
  shouldCountVisit,
  markVisit
} from "./scoreService.js";

window.addEventListener("DOMContentLoaded", async () => {

  // 🔥 On incrémente UNE seule fois par jour
  if (shouldCountVisit()) {
    await incrementVisitorCount();
    markVisit();
  }

  // 🔥 On affiche le compteur
  const count = await getVisitorCount();

  const el = document.getElementById("visitorCount");
  if (el) {
    el.textContent = `👥 ${count} visiteurs`;
  }
});