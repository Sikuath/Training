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
   PREFIXES SI
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
  N: ["", "k"],
  mol: ["", "m"],
  bit: ["", "k", "M", "G"]
};

/* =========================
   SURFACES / VOLUMES
========================= */

const SURFACES_VOLUMES = [
  { from: "m²", to: "dm²", factor: 1e2 },
  { from: "dm²", to: "m²", factor: 1e-2 },

  { from: "m²", to: "cm²", factor: 1e4 },
  { from: "cm²", to: "m²", factor: 1e-4 },

  { from: "m²", to: "mm²", factor: 1e6 },
  { from: "mm²", to: "m²", factor: 1e-6 },

  { from: "m³", to: "dm³", factor: 1e3 },
  { from: "dm³", to: "m³", factor: 1e-3 },

  { from: "m³", to: "cm³", factor: 1e6 },
  { from: "cm³", to: "m³", factor: 1e-6 },

  { from: "m³", to: "mm³", factor: 1e9 },
  { from: "mm³", to: "m³", factor: 1e-9 },

  { from: "dm³", to: "L", factor: 1 },
  { from: "L", to: "dm³", factor: 1 },

  { from: "cm³", to: "mL", factor: 1 },
  { from: "mL", to: "cm³", factor: 1 }
];

/* =========================
   PHYSIQUE
========================= */

const PHYSICS = [
  { from: "m·s⁻¹", to: "km·h⁻¹", factor: 3.6 },
  { from: "km·h⁻¹", to: "m·s⁻¹", factor: 1 / 3.6 },

  { from: "W·m⁻²", to: "W·cm⁻²", factor: 1e-4 },
  { from: "W·cm⁻²", to: "W·m⁻²", factor: 1e4 },

  { from: "g·L⁻¹", to: "kg·m⁻³", factor: 1 },
  { from: "kg·m⁻³", to: "g·L⁻¹", factor: 1 }
];

/* =========================
   MODE
========================= */

function getMode() {
  if (score >= 6) return "hard";
  if (score >= 3) return "medium";
  return "easy";
}

/* =========================
   VALEURS
========================= */

function randomValue(max) {
  const r = Math.random();
  let decimals;

  if (r < 0.3) decimals = 0;
  else if (r < 0.5) decimals = 1;
  else if (r < 0.7) decimals = 2;
  else if (r < 0.85) decimals = 3;
  else decimals = 4;

  const value = Math.random() * max;

  return decimals === 0
    ? Math.floor(value) + 1
    : +value.toFixed(decimals);
}

/* =========================
   UNITÉ SIMPLE
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
   FORMAT
========================= */

function formatFR(x) {
  return String(x).replace(".", ",");
}

/* =========================
   TABLEAU PÉDAGOGIQUE (VERSION CASES HORIZONTALES + COULEURS)
========================= */

function buildTable(from, to) {

  const exp = {
    "G": 9,
    "M": 6,
    "k": 3,
    "": 0,
    "c": -2,
    "m": -3,
    "µ": -6,
    "n": -9
  };

  const f = (from.match(/(n|µ|m|c|k|M|G)/) || [""])[0];
  const t = (to.match(/(n|µ|m|c|k|M|G)/) || [""])[0];

  const e1 = exp[f] ?? 0;
  const e2 = exp[t] ?? 0;

  const diff = e1 - e2;

  const formatExp = (e, color = "white") =>
    `<span style="color:${color};">10<sup>${e}</sup></span>`;

  return `
<div class="explication">

<h3>📊 Tableau de conversion</h3>

<div class="table-row">

  <div class="cell start" style="background:transparent;color:#7CFC00;">
    ${from}<br>
    ${formatExp(e1, "#7CFC00")}
  </div>

  <div class="cell" style="background:transparent;color:white;">
    →
  </div>

  <div class="cell end" style="background:transparent;color:#7CFC00;">
    ${to}<br>
    ${formatExp(e2, "#7CFC00")}
  </div>

</div>

<p>
🔁 Écart d’exposants : <b>${diff}</b>
</p>

<p>
📌 Donc on multiplie par :
<b>10<sup>${diff}</sup></b>
</p>

<p>
💡 Déplacement dans le tableau :
<br>
- vers la droite → on descend les puissances (division)
<br>
- vers la gauche → on monte les puissances (multiplication)
</p>

</div>
`;
}

/* =========================
   GENERATION
========================= */

function generateQuestion() {

  const mode = getMode();

  let value;

  if (mode === "easy") value = randomValue(10);
  else if (mode === "medium") value = randomValue(100);
  else value = +(Math.random() * 50).toFixed(2);

  let item;

  if (mode === "easy") item = randomSIUnit();

  else if (mode === "medium") {
    item = Math.random() < 0.3
      ? SURFACES_VOLUMES[Math.floor(Math.random() * SURFACES_VOLUMES.length)]
      : randomSIUnit();
  }

  else {
    item = Math.random() < 0.4
      ? PHYSICS[Math.floor(Math.random() * PHYSICS.length)]
      : randomSIUnit();
  }

  currentQuestion = {
    q: `${formatFR(value)} ${item.from} → ${item.to}`,
    a: value * item.factor,
    value,
    from: item.from,
    to: item.to
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
  document.getElementById("question").innerHTML = currentQuestion.q;
  document.getElementById("answer").value = "";
  document.getElementById("feedback").textContent = "";
}

/* =========================
   SUBMIT
========================= */

function submitAnswer() {

  if (gameOver) return;

  const input = Number(document.getElementById("answer").value.replace(",", "."));
  const good = currentQuestion.a;

  const fb = document.getElementById("feedback");

  const epsilon = Math.abs(good) * 1e-4 + 1e-6;

  if (!isNaN(input) && Math.abs(input - good) < epsilon) {

    playGoodSound();

    score++;
    current++;

    updateUI();

    generateQuestion();
    load();

  } else {

    playBadSound();

    fb.innerHTML =
      "❌ Faux<br><br>" +
      buildTable(currentQuestion.from, currentQuestion.to);

    setTimeout(() => endGame(), 2000);
  }
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
  }, 1500);
}

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
