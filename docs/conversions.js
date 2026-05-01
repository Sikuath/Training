let score = 0;
let current = 0;

let timeLeft = 180;
let timer = null;

let gameOver = false;

let currentQuestion = null;

/* =========================
   SON (inchangé)
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
   PREFIXES SI (BASE DU MOTEUR)
========================= */

const PREFIXES = {
  "": 1,
  "n": 1e-9,
  "µ": 1e-6,
  "m": 1e-3,
  "c": 1e-2,
  "d": 1e-1,
  "da": 1e1,
  "h": 1e2,
  "k": 1e3,
  "M": 1e6,
  "G": 1e9
};

/* =========================
   UNITES DE BASE (physique)
========================= */

const UNITS = {
  m: ["", "m", "c", "k"],           // m, cm, mm, km
  g: ["", "m", "k"],                // g, mg, kg
  s: ["", "m", "µ"],                // s, ms, µs
  A: ["", "m", "k"],                // A, mA, kA
  V: ["", "m", "k"],                // V, mV, kV
  W: ["", "m", "k"],                // W, mW, kW
  J: ["", "m", "k"],                // J, mJ, kJ
  Pa: ["", "k"],                    // Pa, kPa
  Hz: ["", "k", "M"],               // Hz, kHz, MHz
  bit: ["", "k", "M", "G"],         // bit, kbit, Mbit, Gbit
  N: ["", "k"]                      // N, kN
};

/* =========================
   MODE DIFFICULTE
========================= */

function getMode() {
  if (score >= 10) return "hard";
  if (score >= 5) return "medium";
  return "easy";
}

/* =========================
   GENERATION UNITE SIMPLE
========================= */

function randomSIUnit() {

  const bases = Object.keys(UNITS);
  const base = bases[Math.floor(Math.random() * bases.length)];

  const allowed = UNITS[base];

  let p1, p2;

  // 🔥 éviter même unité → même unité (inutile)
  do {
    p1 = allowed[Math.floor(Math.random() * allowed.length)];
    p2 = allowed[Math.floor(Math.random() * allowed.length)];
  } while (p1 === p2);

  // 🔥 sécurité : si prefixe inconnu
  if (!(p1 in PREFIXES) || !(p2 in PREFIXES)) {
    return randomSIUnit(); // retry propre
  }

  return {
    from: p1 + base,
    to: p2 + base,
    factor: PREFIXES[p1] / PREFIXES[p2]
  };
}

/* =========================
   GENERATION QUESTION
========================= */

function generateQuestion() {

  const mode = getMode();

  let value;

  if (mode === "easy") {
    value = Math.floor(Math.random() * 10 + 1);
  }

  else if (mode === "medium") {
    value = +(Math.random() * 100).toFixed(2);
  }

  else {
    value = +(Math.random() * 50).toFixed(2);
  }

  const item = randomSIUnit();

  currentQuestion = {
    q: `${formatFR(value)} ${item.from} → ${item.to}`,
    a: value * item.factor
  };
}

/* =========================
   FORMAT FR
========================= */

function formatFR(x) {
  return String(x).replace(".", ",");
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

  document.getElementById("question").textContent =
    currentQuestion.q;

  document.getElementById("answer").value = "";
  document.getElementById("feedback").textContent = "";
}

/* =========================
   INPUT
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
      formatFR(good) +
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
      formatFR(currentQuestion.a) +
      "</b>";
  }

  setTimeout(() => {

    window.location.href =
      "gameover.html?game=conversions&score=" + score;

  }, 2000);
}

/* =========================
   UI
========================= */

function updateUI() {
  const s = document.getElementById("score");
  if (s) s.textContent = score;
}
