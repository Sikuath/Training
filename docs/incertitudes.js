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

  let ex;

  // SWITCH CENTRAL
  switch (window.INCERTITUDE_MODE) {

    case "typeA":
      ex = incTypeA.generateUncertaintyQuestion();
      break;

    case "typeB":
      ex = incTypeB.generateTypeBQuestion();
      break;

    case "typeC":
      ex = incTypeC.generateTypeCQuestion();
      break;

    default:
      ex = incTypeB.generateTypeBQuestion();
  }

  return {
    ...ex,
    mode,
    hint: `Mode actif : ${window.INCERTITUDE_MODE}`
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

  // =========================
  // CONTEXTE PHYSIQUE
  // =========================

  let context = null;

  if (window.INCERTITUDE_MODE === "typeA") {
    context = currentQuestion.raw.context;
  }

  if (window.INCERTITUDE_MODE === "typeB") {
    context = currentQuestion.raw.relation;
  }

  if (window.INCERTITUDE_MODE === "typeC") {
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

  switch (window.INCERTITUDE_MODE) {

    case "typeA":
      container.innerHTML = incTypeA.render(currentQuestion);
      break;

    case "typeB":
      container.innerHTML = incTypeB.renderTypeB(currentQuestion);
      break;
    
    case "typeC":
  container.innerHTML = incTypeC.renderTypeC(currentQuestion);
  break;
  }

  // =========================
  // RESET FEEDBACK
  // =========================

  const feedback = document.getElementById("feedback");
  if (feedback) feedback.textContent = "";

  // =========================
  // RENDU MATHJAX
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

function nextQuestion() {

  if (gameOver) return;

  setTimeout(() => {
    load();
  }, 300);
}
