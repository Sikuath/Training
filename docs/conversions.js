let score = 0;
let current = 0;

let timeLeft = 180;
let timer = null;

let gameOver = false;

let currentQuestion = null;

/* =========================
   SON
========================= */

function playSound(id) {
  const s = document.getElementById(id);
  if (!s) return;

  try {
    s.pause();
    s.currentTime = 0;

    const p = s.play();
    if (p !== undefined) p.catch(() => {});
  } catch (e) {}
}

function playGoodSound() {
  playSound("goodSound");
}

function playBadSound() {
  playSound("badLight");
}

/* =========================
   POOLS
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
  { from: "dm", to: "m", factor: 0.1 },

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
  { q: "kg/m³ → g/cm³", compute: v => v / 1000 },
  { q: "m/s → km/h", compute: v => v * 3.6 },
  { q: "km/h → m/s", compute: v => v / 3.6 },
  { q: "W/m² → W/cm²", compute: v => v / 10000 },
  { q: "Pa → N/m²", compute: v => v },
  { q: "J → W·s", compute: v => v }
];

/* =========================
   MODE
========================= */

function getMode() {
  if (score >= 10) return "hard";
  if (score >= 5) return "medium";
  return "easy";
}

function getPool() {
  const mode = getMode();
  if (mode === "easy") return EASY;
  if (mode === "medium") return MEDIUM;
  return HARD;
}

/* =========================
   FORMAT FR
========================= */

function formatFR(x) {
  return String(x).replace(".", ",");
}

/* =========================
   SCIENTIFIQUE HTML
========================= */

function formatScientificHTML(str) {
  return str.replace(/\^(-?\d+)/g, "<sup>$1</sup>");
}

/* =========================
   NUMBER FORMAT SMART
========================= */

function formatSmartNumber(x) {

  if (x === 0) return "0";

  const abs = Math.abs(x);

  if (abs >= 1000 || abs < 0.01) {

    const exp = Math.floor(Math.log10(abs));
    const mantissa = x / Math.pow(10, exp);

    const m = mantissa
      .toFixed(3)
      .replace(/\.?0+$/, "")
      .replace(".", ",");

    return `${m} × 10^${exp}`;
  }

  return String(x)
    .replace(".", ",");
}

/* =========================
   GENERATION
========================= */

function generateQuestion() {

  const pool = getPool();
  const mode = getMode();

  const item = pool[Math.floor(Math.random() * pool.length)];

  let value;

  if (mode === "easy") value = Math.floor(Math.random() * 10 + 1);
  else if (mode === "medium") value = +(Math.random() * 100).toFixed(2);
  else value = +(Math.random() * 50).toFixed(2);

  value = Number(value);

  if (mode === "hard") {

    currentQuestion = {
      q: `${formatFR(value)} ${item.q}`,
      a: item.compute(value)
    };

  } else {

    currentQuestion = {
      q: `${formatFR(value)} ${item.from} en ${item.to} ?`,
      a: value * item.factor
    };
  }
}

/* =========================
   START
========================= */

function startGame() {

  score = 0;
  current = 0;
  gameOver = false;

  generateQuestion();

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

    if (timeLeft <= 0) endGame();

  }, 1000);
}

/* =========================
   LOAD
========================= */

function load() {

  document.getElementById("question").innerHTML =
    formatScientificHTML(currentQuestion.q);

  document.getElementById("answer").value = "";
  document.getElementById("feedback").textContent = "";
}

/* =========================
   PARSE
========================= */

function parseInput(v) {
  if (!v) return NaN;
  return Number(v.replace(",", ".").replace(/\s/g, ""));
}

/* =========================
   SUBMIT
========================= */

function submitAnswer() {

  if (gameOver) return;

  const input = parseInput(document.getElementById("answer").value);
  const good = currentQuestion.a;

  const epsilon = 0.001;

  if (!isNaN(input) && Math.abs(input - good) < epsilon) {

    playGoodSound();

    score++;
    current++;

    generateQuestion();
    load();

  } else {

    playBadSound();

    const fb = document.getElementById("feedback");

    fb.innerHTML =
      "✘ Faux<br>✔ Réponse : <b>" +
      formatScientificHTML(formatSmartNumber(good)) +
      "</b>";

    setTimeout(() => endGame(), 700);
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

  const fb = document.getElementById("feedback");

  if (fb && currentQuestion) {

    fb.innerHTML =
      "✔ Fin du jeu<br>✔ Réponse : <b>" +
      formatScientificHTML(formatSmartNumber(currentQuestion.a)) +
      "</b>";
  }

  setTimeout(() => {

    window.location.href =
      "gameover.html?game=conversions&score=" + score;

  }, 5000);
}

/* =========================
   UI
========================= */

function updateUI() {
  const s = document.getElementById("score");
  if (s) s.textContent = score;
}
