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
   PREFIXES
========================= */

const PREFIXES = {
  "": 1,
  "n": 1e-9,
  "µ": 1e-6,
  "m": 1e-3,
  "c": 1e-2,
  "k": 1e3,
  "M": 1e6,
  "G": 1e9
};

/* =========================
   UNITES SIMPLES
========================= */

const UNITS = {
  m: ["", "m", "c", "k"],
  g: ["", "m", "k"],
  s: ["", "m", "µ"],
  A: ["", "m", "k"],
  V: ["", "m", "k"],
  W: ["", "m", "k"],
  J: ["", "m", "k"],
  Pa: ["", "k"],
  Hz: ["", "k", "M"],
  N: ["", "k"]
};

/* =========================
   UNITES COMPOSEES
========================= */

const COMPOUND = [
  ["g", "L"],
  ["kg", "m³"],
  ["m", "s"],
  ["W", "m²"]
];

/* =========================
   MODE
========================= */

function getMode() {
  if (score >= 3) return "hard";
  if (score >= 2) return "medium";
  return "easy";
}

/* =========================
   UNITE SIMPLE
========================= */

function randomSIUnit() {

  const bases = Object.keys(UNITS);
  const base = bases[Math.floor(Math.random() * bases.length)];
  const allowed = UNITS[base];

  let p1, p2;

  do {
    p1 = allowed[Math.floor(Math.random() * allowed.length)];
    p2 = allowed[Math.floor(Math.random() * allowed.length)];
  } while (p1 === p2);

  return {
    from: p1 + base,
    to: p2 + base,
    factor: PREFIXES[p1] / PREFIXES[p2]
  };
}

/* =========================
   UNITE COMPOSEE
========================= */

function randomCompoundUnit() {

  const pair = COMPOUND[Math.floor(Math.random() * COMPOUND.length)];

  const numBase = pair[0];
  const denBase = pair[1];

  const num = randomSIUnit();
  const den = randomSIUnit();

  if (!num.from.endsWith(numBase) || !den.from.endsWith(denBase)) {
    return randomCompoundUnit();
  }

  return {
    from: `${num.from}/${den.from}`,
    to: `${num.to}/${den.to}`,
    factor: num.factor / den.factor
  };
}

/* =========================
   FORMAT FR
========================= */

function formatFR(x) {
  return String(x).replace(".", ",");
}

/* =========================
   SCIENTIFIQUE
========================= */

function formatScientific(x) {

  if (x === 0) return "0";

  const abs = Math.abs(x);

  if (abs >= 1000 || abs < 0.01) {

    const exp = Math.floor(Math.log10(abs));
    const mant = x / Math.pow(10, exp);

    const m = mant
      .toFixed(3)
      .replace(/\.?0+$/, "")
      .replace(".", ",");

    return `${m} × 10<sup>${exp}</sup>`;
  }

  return String(x).replace(".", ",");
}

/* =========================
   GENERATION
========================= */

function generateQuestion() {

  const mode = getMode();

  let value;

  if (mode === "easy") value = Math.floor(Math.random() * 10 + 1);
  else if (mode === "medium") value = +(Math.random() * 100).toFixed(2);
  else value = +(Math.random() * 50).toFixed(2);

  const item = (mode === "hard")
    ? randomCompoundUnit()
    : randomSIUnit();

  currentQuestion = {
    q: `${formatFR(value)} ${item.from} → ${item.to}`,
    a: value * item.factor
  };
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

  const epsilon = Math.abs(good) * 1e-4 + 1e-6;

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
      formatScientific(good) +
      "</b>";

    setTimeout(() => endGame(), 1200);
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
      formatScientific(currentQuestion.a) +
      "</b>";
  }

  setTimeout(() => {

    window.location.href =
      "gameover.html?game=conversions&score=" + score;

  }, 8000);
}

/* =========================
   UI (FIX ICI)
========================= */

function updateUI() {

  const s = document.getElementById("score");
  if (s) s.textContent = score;

  const m = document.getElementById("mode");
  if (m) {
    const mode = getMode();
    m.textContent = mode;

    // option visuelle propre
    m.style.color =
      mode === "easy" ? "#00ff00" :
      mode === "medium" ? "#ffff00" :
      "#ff4444";
  }
}
