import { QUESTIONS } from "./exp_questions.js";
import { DISTRACTOR_PATTERNS } from "./exp_distractors.js";
import { generateDistractors } from "./exp_distractors.js"
import { toLatex, displayExpr } from "./exp_latex.js";
import { showFeedback } from "./exp_feedback.js";
import { EXPRESSION_TYPES } from "./exp_types.js";
import {
  getBestPlayer
} from "./scoreService.js";

/* =========================================================
   GLOBAL
========================================================= */

let score = 0;
let current = 0;
let timeLeft = 180;
let timer = null;
let gameOver = false;
let currentQuestion = null;
let recentQuestions = [];

/* =========================
   RECUP DATA
========================= */
let bestPlayer = {
    name: "---",
    score: 0
};

async function loadBestPlayer() {

    try {
        bestPlayer = await getBestPlayer("expressions");
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

/* =========================================================
   COMPARAISON
========================================================= */

function isEqual(a, b, type) {
  return normalize(a, type) === normalize(b, type);
}

/* =========================================================
   CLEAN
========================================================= */

function cleanExpr(expr) {
  if (!expr) return "";
  return expr.replace(/\s+/g, "").trim();
}

/* =========================================================
   NORMALIZE
========================================================= */

function normalizeChoice(c) {

  if (!c) return "";

  if (c.includes("=")) return c;

  return `${currentQuestion.target} = ${c}`;
}

/* =========================================================
   SHUFFLE
========================================================= */

function shuffle(array) {

  const arr = [...array];

  for (let i = arr.length - 1; i > 0; i--) {

    const j = Math.floor(Math.random() * (i + 1));

    [arr[i], arr[j]] = [arr[j], arr[i]];
  }

  return arr;
}

/* =========================================================
   QUESTION ET DIFFICULTE
========================================================= */

function getCurrentMode() {

  if (score > 10) return "hard";
  if (score > 4) return "medium";

  return "easy";
}

function pickQuestionByDifficulty() {

  const mode = getCurrentMode();

  let pool = [];

  if (mode === "easy") {

    // 100 % easy
    pool = QUESTIONS.filter(q =>
      q.difficulty === "easy"
    );

  } else if (mode === "medium") {

    // 50 % easy / 50 % medium
    const roll = Math.random();

    pool = QUESTIONS.filter(q =>
      q.difficulty === (roll < 0.5 ? "easy" : "medium")
    );

  } else {

    // 30 % medium / 70 % hard
    const roll = Math.random();

    pool = QUESTIONS.filter(q =>
      q.difficulty === (roll < 0.3 ? "medium" : "hard")
    );
  }

  return pool[Math.floor(Math.random() * pool.length)];
}

/* =========================================================
   GENERATE QUESTION
========================================================= */

function cleanChoice(str) {
  if (!str) return "";

  return str
    .replace(/\s*=\s*$/, "")   // enlève "=" final
    .trim();
}

function generateQuestion() {

  let q;
  let attempts = 0;

  do {

    q = pickQuestionByDifficulty();

    attempts++;

  } while (
    recentQuestions.includes(q.law) &&
    attempts < 50
  );

  recentQuestions.push(q.law);

  if (recentQuestions.length > 10) {
    recentQuestions.shift();
  }

  const target =
    q.targetPool[Math.floor(Math.random() * q.targetPool.length)];

  // 🔥 vraie réponse brute
  const rawCorrect =
    q.answers[target];

  // 🔥 normalisation unique (CRITIQUE)
  const correct =
    cleanExpr(cleanChoice(rawCorrect));

  // 🔥 génération des distracteurs
  let distractors =
    generateDistractors(q, target, correct)
      .map(cleanExpr);

  // 🔥 sécurité absolue : on retire toute collision avec la bonne réponse
  distractors =
    distractors.filter(d => d !== correct);

  // 🔥 on supprime doublons
  distractors =
    [...new Set(distractors)];

  // 🔥 on s’assure qu’on a 3 choix
  while (distractors.length < 3) {

    const fn =
      DISTRACTOR_PATTERNS.DEFAULT[
        Math.floor(Math.random() * DISTRACTOR_PATTERNS.DEFAULT.length)
      ];

    const val =
      cleanExpr(fn(q.lhs, null, null, target));

    if (val !== correct && !distractors.includes(val)) {
      distractors.push(val);
    }
  }

  // 🔥 assemblage final
  let choices = [
    correct,
    ...distractors.slice(0, 3)
  ];

  choices = shuffle(choices);

  currentQuestion = {

    ...q,

    target,

    choices,

    answer: choices.indexOf(correct),

    correct
  };
}

/* =========================================================
   LOAD
========================================================= */

function load() {

  const q = currentQuestion;

  document.getElementById("question").innerHTML = `

    <b>Notion abordée :</b> ${q.law}<br><br>

    D’après la relation : \\(${toLatex(q.expr)}\\)<br><br>

    Donner la bonne expression pour la variable <b>\\(${toLatex(q.target)}\\)</b>

  `;

  renderChoices(q);

  const fb =
    document.getElementById("feedback");

  if (fb) fb.innerHTML = "";

  const dom =
    document.getElementById("imageDomain");

  if (dom)
    dom.innerHTML =
      formatDomain(q.domain);

  const law =
    document.getElementById("imageTitle");

  if (law)
    law.innerHTML =
      `🔬 ${q.law}`;

  showImage(q);

  if (window.MathJax) {

    setTimeout(() => {

      if (MathJax.typesetPromise) {
        MathJax.typesetPromise();
      } else {
        MathJax.typeset();
      }

    },50);
  }
}

/* =========================================================
   CHOICES
========================================================= */

function renderChoices(q) {

  const container =
    document.getElementById("choices");

  container.innerHTML = "";

  q.choices.forEach((c,i) => {

    const btn =
      document.createElement("button");

    // 🔥 sécurité : split contrôlé
    let [lhs, rhs] = normalizeChoice(c).split("=");

    lhs = lhs ? lhs.trim() : "";
    rhs = rhs ? rhs.trim() : "";

    // 🔥 fallback critique (évite "U/I =")
    if (!rhs) {
      rhs = ""; // ou "?"
    }

    btn.innerHTML =
      `\\(${toLatex(lhs)} = ${toLatex(rhs)}\\)`;

    btn.onclick =
      () => submitAnswer(i);

    container.appendChild(btn);
  });

  if (window.MathJax) {
    MathJax.typeset();
  }
}

/* =========================================================
   SUBMIT
========================================================= */

function submitAnswer(i) {

  if (gameOver) return;

  if (i === currentQuestion.answer) {

    playGoodSound();

    score++;
    current++;

    updateUI();

    generateQuestion();
    load();

  } else {

    playBadSound();

    showFeedback(currentQuestion, EXPRESSION_TYPES, toLatex);

    endGame();
  }
}

/* =========================================================
   TIMER
========================================================= */

function startTimer() {

  clearInterval(timer);

  timer = setInterval(() => {

    if (gameOver) return;

    timeLeft--;

    const t = document.getElementById("timer");
    if (t) t.textContent = timeLeft + "s";

    if (timeLeft <= 0) endGame();

  }, 2000);
}

/* =========================================================
   START
========================================================= */

function startGame() {

  clearInterval(timer);

  QUESTIONS.forEach(q => {
    if (q.image) new Image().src = q.image;
  });

  score = 0;
  current = 0;
  gameOver = false;
  timeLeft = 180;

  generateQuestion();

  requestAnimationFrame(() => {
    load();
    updateUI();
  });

  startTimer();
}

/* =========================================================
   END
========================================================= */
function endGame() {

  if (gameOver) return;
  gameOver = true;

  clearInterval(timer);

  const finalScore = Number(score || 0);

  setTimeout(() => {

    window.location.href =
      "gameover.html?game=expressions&score=" + finalScore;

  }, 8000);
}
/* =========================================================
   QUITGAME
========================================================= */

function quitGame() {

  if (gameOver) return;

  const confirmQuit = confirm("Êtes-vous sûr de vouloir quitter la partie ?");

  if (!confirmQuit) return;

  gameOver = true;
  clearInterval(timer);

  window.location.href = "index.html";
}

/* =========================================================
   UI
========================================================= */

function updateUI() {

  document.getElementById("score")
    .textContent = score;

  const mode =

    score > 10
      ? "hard"

      : score > 4
        ? "medium"

        : "easy";

  const m =
    document.getElementById("mode");

  if (m)
    m.textContent = mode;
}

/* =========================================================
   IMAGE
========================================================= */

function showImage(q) {

  const img =
    document.getElementById("illustration");

  if (!img) return;

  if (!q.image) {

    img.style.display = "none";
    return;
  }

  img.src = q.image;

  img.style.display = "block";
}

/* =========================================================
   DOMAIN
========================================================= */

function formatDomain(domain) {

  const d = domain.toLowerCase();

  if (d.includes("chimie"))
    return "⚗️ Chimie";

  if (d.includes("electric"))
    return "⚡ Électricité";

  if (d.includes("onde"))
    return "🌊 Ondes";

  if (d.includes("grav"))
    return "🌍 Gravitation";

  if (d.includes("energie"))
    return "⚙️ Énergie";

  if (d.includes("fluide"))
    return "💧 Fluides";

  if (d.includes("thermo"))
    return "🔥 Thermodynamique";

  if (d.includes("lent"))
    return "🔭 Optique";

  return "📚 Physique";
}

/* =========================================================
   SOUNDS
========================================================= */

function playSound(id) {

  const s =
    document.getElementById(id);

  if (!s) return;

  s.currentTime = 0;

  s.play().catch(()=>{});
}

function playGoodSound() {
  playSound("goodSound");
}

function playBadSound() {
  playSound("badLight");
}

/* =========================================================
   EXPORT GLOBAL HTML
========================================================= */

window.startGame = startGame;
window.quitGame = quitGame;
window.addEventListener("DOMContentLoaded", updateHUD);