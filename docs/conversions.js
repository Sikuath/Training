let score = 0;
let current = 0;

let questions = [];

let timeLeft = 180;
let timer = null;

let gameOver = false;

/* =========================
   MODE (niveau courant)
========================= */

let mode = "easy";

/* =========================
   TABLES DE CONVERSION
========================= */

const EASY = [
  { from: "km", to: "m", factor: 1000 },
  { from: "m", to: "km", factor: 0.001 },
  { from: "g", to: "kg", factor: 0.001 },
  { from: "kg", to: "g", factor: 1000 },
  { from: "L", to: "mL", factor: 1000 },
  { from: "mL", to: "L", factor: 0.001 }
];

const MEDIUM = [
  { from: "cm", to: "m", factor: 0.01 },
  { from: "mm", to: "m", factor: 0.001 },
  { from: "g", to: "mg", factor: 1000 },
  { from: "mg", to: "g", factor: 0.001 },

  { from: "V", to: "mV", factor: 1000 },
  { from: "A", to: "mA", factor: 1000 },
  { from: "W", to: "kW", factor: 0.001 },
  { from: "J", to: "kJ", factor: 0.001 },
  { from: "Pa", to: "kPa", factor: 0.001 }
];

const HARD = [
  { q: "g/mL → g/L", compute: v => v * 1000 },
  { q: "g/L → kg/m³", compute: v => v },
  { q: "W/m² → W/cm²", compute: v => v / 10000 },
  { q: "Pa → N/m²", compute: v => v },
  { q: "J → W·s", compute: v => v }
];

/* =========================
   NIVEAU SELON SCORE
========================= */

function computeMode(score) {
  if (score >= 13) return "hard";
  if (score >= 5) return "medium";
  return "easy";
}

/* =========================
   POOL ACTIF
========================= */

function getPool() {
  if (mode === "easy") return EASY;
  if (mode === "medium") return MEDIUM;
  return HARD;
}

/* =========================
   GENERATION QUESTIONS
========================= */

function generateQuestions() {

  questions = [];

  const pool = getPool();

  for (let i = 0; i < 200; i++) {

    let item = pool[Math.floor(Math.random() * pool.length)];

    if (mode === "hard") {

      let value = +(Math.random() * 10).toFixed(2);

      questions.push({
        q: `${value} ${item.q}`,
        a: item.compute(value)
      });

    } else {

      let value = +(Math.random() * 100).toFixed(2);

      questions.push({
        q: `${value} ${item.from} en ${item.to} ?`,
        a: +(value * item.factor).toFixed(6)
      });
    }
  }

  questions = questions.sort(() => Math.random() - 0.5);
}

/* =========================
   START GAME
========================= */

function startGame() {

  score = 0;
  current = 0;
  gameOver = false;

  mode = "easy"; // reset niveau

  generateQuestions();

  timeLeft = 180;

  document.getElementById("startBtn").style.display = "none";
  document.getElementById("validateBtn").style.display = "inline-block";
  document.getElementById("stopBtn").style.display = "inline-block";

  startTimer();
  load();
  updateUI();
}

/* =========================
   TIMER
========================= */

function startTimer() {

  clearInterval(timer);

  timer = setInterval(() => {

    if (gameOver) return;

    timeLeft--;

    const t = document.getElementById("timer");
    if (t) t.textContent = timeLeft + "s";

    if (timeLeft <= 0) {
      endGame();
    }

  }, 1000);
}

/* =========================
   LOAD QUESTION
========================= */

function load() {

  const q = questions[current];

  document.getElementById("question").textContent = q.q;
  document.getElementById("answer").value = "";
  document.getElementById("feedback").textContent = "";
}

/* =========================
   PARSE INPUT
========================= */

function parseInput(value) {
  if (!value) return NaN;
  return Number(value.replace(",", "."));
}

/* =========================
   SUBMIT (ERREUR = GAME OVER)
========================= */

function submitAnswer() {

  if (gameOver) return;

  const raw = document.getElementById("answer").value;
  const input = parseInput(raw);

  const good = questions[current].a;

  const epsilon = 0.001;

  if (!isNaN(input) && Math.abs(input - good) < epsilon) {

    score++;
    current++;

    // 🔥 mise à jour du mode APRÈS bonne réponse
    mode = computeMode(score);

    if (current >= questions.length) {
      endGame();
      return;
    }

    load();

  } else {

    document.getElementById("feedback").innerHTML =
      "✘ Faux<br>✔ Réponse : <b>" + good + "</b>";

    endGame();
  }

  updateUI();
}

/* =========================
   END GAME
========================= */

function endGame() {

  if (gameOver) return;

  gameOver = true;

  clearInterval(timer);

  setTimeout(() => {
    window.location.href =
      "gameover.html?game=conversions&score=" + score;
  }, 500);
}

/* =========================
   UI
========================= */

function updateUI() {

  const s = document.getElementById("score");
  if (s) s.textContent = score;

  const m = document.getElementById("mode");
  if (m) m.textContent = mode;
}
