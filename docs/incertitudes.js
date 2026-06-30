let score = 0;
let timeLeft = 300;
let timer = null;

let gameOver = false;
let currentQuestion = null;

// =========================
// MODE DE JEU
// =========================

const MODE_DISTRIBUTION = {
  easy: [
    ["typeD", 70],
    ["typeC", 30]
  ],

  medium: [
    ["typeA", 70],
    ["typeC", 15],
    ["typeD", 15]
  ],

  hard: [
    ["typeB", 40],
    ["typeA", 60]
  ]
};

function weightedRandom(choices) {

  const total = choices.reduce((sum, [, w]) => sum + w, 0);

  let r = Math.random() * total;

  for (const [type, weight] of choices) {
    r -= weight;
    if (r <= 0) return type;
  }

  return choices[choices.length - 1][0];
}

function pickExerciseType() {

  const mode = getMode();

  const choices = MODE_DISTRIBUTION[mode];

  return weightedRandom(choices);
}

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

  const type = pickExerciseType();
  const mode = getMode();

  let ex;

  switch (type) {

    case "typeA":
      ex = incTypeA.generateUncertaintyQuestion();
      break;

    case "typeB":
      ex = incTypeB.generateTypeBQuestion();
      break;

    case "typeC":
      ex = incTypeC.generateTypeCQuestion();
      break;

    case "typeD":
      ex = incTypeD.generateTypeDQuestion();
      break;

    default:
      ex = incTypeA.generateUncertaintyQuestion();
  }

  return {
    ...ex,
    mode,
    type,
    hint: `Mode: ${mode} | Exercice: ${type}`
  };
}

/* =========================
   MODE
========================= */

function getMode() {
  if (score >= 8) return "hard";
  if (score >= 4) return "medium";
  return "easy";
}

/* =========================
   LOAD
========================= */

function load() {

  currentQuestion = generateQuestion();
  window.currentQuestion = currentQuestion;

  // =========================
  // CONTEXTE PHYSIQUE
  // =========================

  const type = currentQuestion.type;
  let context = null;

  if (type === "typeA") {
    context = currentQuestion.raw.context;
  }

  if (type === "typeB") {
    context = currentQuestion.raw.relation;
  }

  if (type === "typeC") {
    context = currentQuestion.raw.relation;
  }

  if (type === "typeD") {
    context = currentQuestion.raw.relation;
  }

  if (context) {

    const img = document.getElementById("instrumentImg");
    if (img) {
      img.src = context.instrument;
      img.alt = context.label;
    }

    const domain = document.getElementById("domainLabel");
    if (domain) {
      domain.textContent = context.domain;
    }

    const quantity = document.getElementById("quantityLabel");
    if (quantity) {
      quantity.textContent =
        `${context.label} (${context.variable})`;
    }
  }

  // =========================
  // AFFICHAGE QUESTION
  // =========================

  const container = document.getElementById("question");

  if (!container) return;

  switch (currentQuestion.type) {

    case "typeA":
      container.innerHTML = incTypeA.render(currentQuestion);
      break;

    case "typeB":
      container.innerHTML = incTypeB.renderTypeB(currentQuestion);
      break;

    case "typeC":
      container.innerHTML = incTypeC.renderTypeC(currentQuestion);
      break;

    case "typeD":
      container.innerHTML = incTypeD.renderTypeD(currentQuestion);
      break;
  }

  // =========================
  // RESET FEEDBACK
  // =========================

  const feedback = document.getElementById("feedback");
  if (feedback) feedback.textContent = "";

  // =========================
  // MATHJAX
  // =========================

  if (window.MathJax) {
    MathJax.typesetPromise();
  }
}

/* =========================
   SUBMIT
========================= */

function submit() {

  if (gameOver) return;

  const q = window.currentQuestion;
  if (!q || !q.raw) return;

  const center = document.getElementById("feedback");
  if (!center) return;

  const context = q.raw.context;

  const meanUser = parseFloat(
    document.getElementById("meanInput")?.value?.replace(",", ".")
  );

  const uUser = parseFloat(
    document.getElementById("uInput")?.value?.replace(",", ".")
  );

  if (isNaN(meanUser) || isNaN(uUser)) {
    center.innerHTML = "⚠ Entrée invalide";
    return;
  }

  const meanTrue = q.answer.mean;
  const uRaw = q.answer.uncertainty;
  const sig = q.raw.sig ?? 2;

  const uExpected = roundUpSig(uRaw, sig);

  const decimals = Math.max(
    0,
    (uExpected.toString().split(".")[1] || "").length
  );

  const meanExpected = Number(meanTrue.toFixed(decimals));

  const meanOk = Math.abs(meanUser - meanExpected) < 1e-9;
  const uOk = Math.abs(uUser - uExpected) < 1e-9;

  center.innerHTML = "";

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

    setTimeout(nextQuestion, 800);
    return;
  }

  // =========================
  // MAUVAISE RÉPONSE
  // =========================
  playBadSound();

  window.incFeedback.showFeedback("typeA", {
    meanOk,
    uOk,
    variable: context.variable,
    unit: context.unit,
    meanExpected: formatFR(meanExpected, decimals),
    uExpected: formatFR(uExpected, decimals)
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
  timeLeft = 300;
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

  const finalScore = Number(score || 0);

  const nameInput = document.getElementById("playerName");
  const playerName = nameInput?.value?.trim() || "Anonymous";

  import("./scoreService.js").then(({ addScore }) => {

    addScore("incertitudes", playerName, finalScore)
      .catch(console.error);

  });

  setTimeout(() => {
    window.location.href =
      "gameover.html?game=incertitudes&score=" + finalScore;
  }, 800);
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

function nextQuestion() {

  if (gameOver) return;

  setTimeout(() => {
    load();
  }, 300);
}
