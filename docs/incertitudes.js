import {
  getBestPlayer
} from "./scoreService.js";

let score = 0;
let timeLeft = 300;
let timer = null;

let gameOver = false;
let currentQuestion = null;
let gameStarted = false;

/* =========================
   BOUTONS
========================= */
function toggleGame() {

  if (!gameStarted) {
    startGame();
    gameStarted = true;

    const btn = document.getElementById("gameBtn");
    btn.textContent = "Fin";
  } 
  else {
    quitGame();
  }
}

function updateButtons() {

  const compat = document.getElementById("compatBtn");
  const incompat = document.getElementById("incompatBtn");
  const validate = document.getElementById("validateBtn");

  const isTypeD = currentQuestion?.type === "typeD";

  if (isTypeD) {
    if (validate) validate.style.display = "none";
    if (compat) compat.style.display = "inline-block";
    if (incompat) incompat.style.display = "inline-block";
  } 
  else {
    if (validate) validate.style.display = "inline-block";
    if (compat) compat.style.display = "none";
    if (incompat) incompat.style.display = "none";
  }
}

function renderTypeDButtons() {

  const container = document.getElementById("exerciseButtons");
  if (!container) return;

  container.innerHTML = "";

  const btn1 = document.createElement("button");
  btn1.textContent = "✔ Compatible";
  btn1.onclick = () => incTypeD.answerTypeD(true);

  const btn2 = document.createElement("button");
  btn2.textContent = "❌ Non compatible";
  btn2.onclick = () => incTypeD.answerTypeD(false);

  container.appendChild(btn1);
  container.appendChild(btn2);
}

function submitIncompatible() {
  const q = window.currentQuestion;
  if (!q) return;

  // faux = non compatible
  window.incTypeD.answerTypeD(false);
}

function submitCompatible() {
  const q = window.currentQuestion;
  if (!q) return;

  // vrai = compatible
  window.incTypeD.answerTypeD(true);
}

function setButtonsEnabled(enabled) {

  [
    "validateBtn",
    "compatBtn",
    "incompatBtn",
    "gameBtn"
  ].forEach(id => {
    const btn = document.getElementById(id);
    if (btn) btn.disabled = !enabled;
  });

}

/* =========================
   RECUP DATA
========================= */
let bestPlayer = {
    name: "---",
    score: 0
};

async function loadBestPlayer() {

    try {
        bestPlayer = await getBestPlayer("incertitudes");
    }
    catch (e) {
        console.error(e);
    }

    updateHUD();
}
function updateHUD() {

    document.getElementById("best").textContent = bestPlayer.score;
    document.getElementById("bestName").textContent = bestPlayer.name;
}

/* =========================
   PROGRESS BAR
========================= */

function updateProgress(score, bestscore) {

    if (!bestscore || bestscore <= 0) {
        bestscore = 1;
    }

    const percent = Math.min(100, (score / bestscore) * 100);

    const bar = document.getElementById("progress");

    bar.style.width = percent + "%";
}

function refreshProgress() {
    updateProgress(score, bestPlayer.score);
}

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

  const { type, raw } = currentQuestion;

  // =========================
  // CONTEXTE PHYSIQUE
  // =========================

  let context = null;

  switch (type) {

    case "typeA":
      context = raw.context;
      break;

    case "typeB":
    case "typeC":
    case "typeD":
      context = raw.relation;
      break;
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

  switch (type) {

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
  // BOUTONS UI (TON SYSTÈME ACTUEL)
  // =========================

  // IMPORTANT : Type D a ses propres boutons HTML injectés
  if (type === "typeD") {

    // laisse le renderTypeD gérer ses boutons
    // MAIS on évite updateButtons qui peut casser l'affichage
    if (typeof updateButtons === "function") {
      updateButtons();
    }

  } else {

    // types A/B/C utilisent le système global (validateBtn etc)
    if (typeof updateButtons === "function") {
      updateButtons();
    }
  }

  // =========================
  // MATHJAX
  // =========================

  if (window.MathJax) {
    if (MathJax.typesetPromise) {
      setTimeout(() => MathJax.typesetPromise(), 0);
    } else {
      MathJax.typeset();
    }
  }
}

/* =========================
   SUBMIT
========================= */

function submit() {

  if (gameOver) return;

  const q = window.currentQuestion;
  if (!q || !q.raw) return;

  // =========================
  // ROUTAGE PAR TYPE
  // =========================
  switch (q.type) {

    case "typeB":
      return window.validateTypeB();

    case "typeC":
      return window.validateTypeC();

    case "typeD":
      // Le type D utilise les boutons Compatible / Non compatible
      return;

    case "typeA":
    default:
      break;
  }

  // =========================
  // TYPE A
  // =========================

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

  if (meanOk && uOk) {

    playGoodSound();
    score++;
    updateUI();
    refreshProgress();

    window.incFeedback.showFeedback("success", {
      message: "✔ Bonne réponse"
    });

    setTimeout(nextQuestion, 200);
    return;
  }

  playBadSound();

  window.incFeedback.showFeedback("typeA", {
    meanOk,
    uOk,
    variable: context.variable,
    unit: context.unit,
    meanExpected: formatFR(meanExpected, decimals),
    uExpected: formatFR(uExpected, decimals)
  });

  setTimeout(() => endGame(), 6000);
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

async function startGame() {

  score = 0;
  timeLeft = 300;
  gameOver = false;

  await loadBestPlayer();

  load();
  updateUI();
  updateHUD();
  refreshProgress();

  startTimer();
  gameStarted = true;

  const btn = document.getElementById("gameBtn");
  if (btn) {
    btn.textContent = "Fin";
    btn.disabled = false;
  }
}

/* =========================
   END GAME (IMPORTANT SCOREBOARD)
========================= */

function endGame() {

  if (gameOver) return;
  gameOver = true;

  clearInterval(timer);

  gameStarted = false;

  const btn = document.getElementById("gameBtn");
  if (btn) {
    btn.disabled = true;
    btn.textContent = "Fin";
  }

  const finalScore = Number(score || 0);

  window.location.href = "gameover.html?game=incertitudes&score=" + finalScore;
}

function quitGame() {

  if (gameOver) return;

  const confirmQuit = confirm("Quitter la partie ?");

  if (!confirmQuit) return;

  gameOver = true;
  clearInterval(timer);

  const btn = document.getElementById("gameBtn");
  if (btn) btn.textContent = "Démarrer";
  window.location.href = "index.html";
}

window.quitGame = quitGame;

/* =========================
   UI
========================= */

function updateUI() {

  const s = document.getElementById("score");
  if (s) s.textContent = score;

  const modeEl = document.getElementById("mode");

  if (modeEl) {
    const mode = getMode();
    modeEl.textContent = mode;

    modeEl.style.color =
      mode === "easy" ? "#7CFC00" :
      mode === "medium" ? "#FFD700" :
      "#FF4500";
  }
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

function nextQuestion() {
  load();
}
window.addEventListener("DOMContentLoaded", loadBestPlayer);
window.submitIncompatible = submitIncompatible;
window.submitCompatible = submitCompatible;
window.toggleGame = toggleGame;
window.submit = submit;
window.setButtonsEnabled = setButtonsEnabled;
window.refreshProgress = refreshProgress;
window.nextQuestion = nextQuestion;
window.startGame = startGame;
window.endGame = endGame;
window.updateUI = updateUI;
window.playGoodSound = playGoodSound;
window.playBadSound = playBadSound;
window.getScore = () => score;
window.setScore = (v) => { score = v; };