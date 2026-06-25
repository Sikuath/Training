let score = 0;
let timeLeft = 180;
let timer = null;

let gameOver = false;
let currentQuestion = null;

/* =========================
   FEEDBACK
========================= */

document.addEventListener("DOMContentLoaded", () => {
  const box = document.getElementById("feedbackBox");
  if (box) box.innerHTML = "";
});

/* =========================
   BASE QUESTIONS
========================= */

function generateQuestion() {

  const mode = getMode();

  // génération unique (évite duplication de code)
  const ex = incTypeA.generateUncertaintyQuestion();

  // adaptation légère selon difficulté (optionnel mais utile)
  if (mode === "easy") {

    return {
      ...ex,
      mode: "easy",

      // option pédagogique : affichage simplifié
      hint: "Mesures simples, dispersion faible"
    };
  }

  if (mode === "medium") {

    return {
      ...ex,
      mode: "medium",

      hint: "Utilise moyenne et incertitude type A"
    };
  }

  // HARD
  return {
    ...ex,
    mode: "hard",

    hint: "Résultat attendu sous forme x ± u avec unités"
  };
}

/* =========================
   MODE
========================= */

function getMode() {
  if (score >= 10) return "hard";
  if (score >= 5) return "medium";
  return "easy";
}

/* =========================
   LOAD
========================= */

function load() {

  currentQuestion = generateQuestion();
  window.currentQuestion = currentQuestion;

  // -------------------------
  // CONTEXTE PHYSIQUE
  // -------------------------

  if (currentQuestion.raw?.context) {

    const context = currentQuestion.raw.context;

    // Image instrument

    const img = document.getElementById("instrumentImg");

    if (img) {
      img.src = context.instrument;
      img.alt = context.label;
    }

    // Domaine

    const domainLabel =
      document.getElementById("domainLabel");

    if (domainLabel) {
      domainLabel.textContent = context.domain;
    }

    // Grandeur physique

    const quantityLabel =
      document.getElementById("quantityLabel");

    if (quantityLabel) {
      quantityLabel.textContent =
        `${context.label} (${context.variable})`;
    }
  }

  // -------------------------
  // RENDU QUESTION
  // -------------------------

  let html = "";

  if (currentQuestion.type === "typeA") {
    html = incTypeA.render(currentQuestion);
  }

  document.getElementById("question").innerHTML = html;

  // -------------------------
  // CHOIX
  // -------------------------

  const container = document.getElementById("choices");

  if (container) {

    container.innerHTML = "";

    if (currentQuestion.choices) {

      currentQuestion.choices.forEach((c, i) => {

        const btn = document.createElement("button");

        btn.textContent = c;

        btn.onclick = () => submit(i);

        container.appendChild(btn);
      });
    }
  }

  // -------------------------
  // FEEDBACK BAS
  // -------------------------

  const feedback =
    document.getElementById("feedback");

  if (feedback) {
    feedback.textContent = "";
  }
}

/* =========================
   SUBMIT
========================= */

function submit(index) {

  if (gameOver) return;

  const q = window.currentQuestion;
  const choice = q.choices?.[index];

  const center = document.getElementById("feedback");
  center.innerHTML = "";

  const context = q.raw.context;

  const meanTrue = q.answer.mean;
  const uRaw = q.answer.uncertainty;
  const sig = q.raw?.sig ?? 2;

  const uExpected = roundUpSig(uRaw, sig);

  const decimals = Math.max(
    0,
    (uExpected.toString().split(".")[1] || "").length
  );

  const meanExpected = Number(meanTrue.toFixed(decimals));

  const meanOk =
    choice?.mean !== undefined &&
    Math.abs(choice.mean - meanExpected) < 1e-9;

  const uOk =
    choice?.u !== undefined &&
    Math.abs(choice.u - uExpected) < 1e-9;

  // =========================
  // BONNE RÉPONSE
  // =========================
  if (meanOk && uOk) {

    playGoodSound();
    score++;
    updateUI();

    center.innerHTML = `
      <p style="color: lightgreen; font-weight: bold;">
        ✔ Bonne réponse
      </p>
    `;

    window.incFeedback.showFeedback("success", {
      message: "✔ Bonne réponse"
    });

    setTimeout(() => load(), 1200);

    return;
  }

  // =========================
  // MAUVAISE RÉPONSE
  // =========================

  playBadSound();

  center.innerHTML = "";

  window.incFeedback.showFeedback("typeA", {
    meanOk,
    uOk,

    meanExpected: formatFR(meanExpected, decimals),
    uExpected: formatFR(uExpected, decimals),

    // 🔥 ICI LE FIX IMPORTANT
    variable: context.variable,
    unit: context.unit
  });

  setTimeout(() => endGame(), 2000);
}

/* =========================
   TIMER
========================= */

function startTimer() {

  clearInterval(timer);

  timer = setInterval(() => {

    if (gameOver) return;

    timeLeft--;

    document.getElementById("timer").textContent = timeLeft + "s";

    if (timeLeft <= 0) endGame();

  }, 1000);
}

/* =========================
   START
========================= */

function startGame() {

  score = 0;
  timeLeft = 180;
  gameOver = false;

  load();
  updateUI();
  startTimer();

  document.getElementById("startBtn").style.display = "none";
  document.getElementById("stopBtn").style.display = "inline-block";
}

/* =========================
   END GAME (IMPORTANT SCOREBOARD)
========================= */

function endGame() {

  if (gameOver) return;

  gameOver = true;
  clearInterval(timer);

  setTimeout(() => {
    window.location.href =
      "gameover.html?game=incertitudes&score=" + score;
  }, 1500);
}
function quitGame() {

  if (gameOver) return;

  const confirmQuit = confirm("Quitter la partie ?");

  if (!confirmQuit) return;

  gameOver = true;
  clearInterval(timer);

  window.location.href = "index.html";
}

window.quitGame = quitGame;

/* =========================
   UI
========================= */

function updateUI() {

  document.getElementById("score").textContent = score;

  const mode = getMode();
  document.getElementById("mode").textContent = mode;
}

/* =========================
   SOUND
========================= */

function playGoodSound() {
  const s = document.getElementById("goodSound");
  if (s) s.play();
}

function playBadSound() {
  const s = document.getElementById("badLight");
  if (s) s.play();
}

/* =========================
   EXPORT
========================= */

window.startGame = startGame;
window.submit = submit;
window.endGame = endGame;
