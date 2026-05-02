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
   FORMAT FR
========================= */

function formatFR(x) {
  return String(x).replace(".", ",");
}

/* =========================
   TYPE EXO
========================= */

function getExerciseType(item) {

  const base = item.from || item;
  const clean = base.replace(/(G|M|k|h|da|d|c|m|µ|n)/, "");

  if (["mol", "Hz", "Pa", "N", "W", "J"].includes(clean)) {
    return 3;
  }

  if (PHYSICS.includes(item)) return 3;
  if (SURFACES_VOLUMES.includes(item)) return 2;
  return 1;
}

/* =========================
   SCIENTIFIC FORMAT
========================= */

function toScientific(x) {
  if (x === 0) return "0";

  const exp = Math.floor(Math.log10(Math.abs(x)));
  const mantissa = x / Math.pow(10, exp);

  return `${mantissa.toFixed(3)} × 10<sup>${exp}</sup>`;
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
    const r = Math.random();

    if (r < 0.4) item = PHYSICS[Math.floor(Math.random() * PHYSICS.length)];
    else if (r < 0.7) item = SURFACES_VOLUMES[Math.floor(Math.random() * SURFACES_VOLUMES.length)];
    else item = randomSIUnit();
  }

  currentQuestion = {
    q: `${formatFR(value)} ${item.from} → ${item.to}`,
    a: value * item.factor,
    value,
    from: item.from,
    to: item.to,
    item: item
  };
}

/* =========================
   TABLEAU (VISUEL UNIQUEMENT)
========================= */

function buildTable(from, to) {

  const scale = ["G","M","k","h","da","","d","c","m","µ","n"];

  const exp = {
    "G": 9, "M": 6, "k": 3, "h": 2, "da": 1,
    "": 0, "d": -1, "c": -2, "m": -3, "µ": -6, "n": -9
  };

  const getPrefix = (u) =>
    (u.match(/(G|M|k|h|da|d|c|m|µ|n)/) || [""])[0];

  const f = getPrefix(from);
  const t = getPrefix(to);

  const step = exp[t] - exp[f]; // 🔥 on passe directement en puissance

  const cells = scale.map(p => {

    const isStart = p === f;
    const isEnd = p === t;

    return `
      <div class="cell"
        style="color:${isStart || isEnd ? '#7CFC00' : 'white'};font-weight:${isStart || isEnd ? 'bold' : 'normal'};">
        ${p}<br>
        10<sup>${exp[p]}</sup>
      </div>
    `;
  }).join("");

  return { cells, step };
}

/* =========================
   FEEDBACK (RAISONNEMENT 10^n)
========================= */

function showFeedback(isCorrect) {

  const fb = document.getElementById("feedback");
  fb.classList.add("active");

  const type = getExerciseType(currentQuestion.item);

  if (isCorrect) return;

  playBadSound();

  const value = currentQuestion.value;
  const result = toScientific(currentQuestion.a);

  let content = "";

  if (type === 1 || type === 2) {

    const t = buildTable(currentQuestion.from, currentQuestion.to);

    const expStep = t.step;

    content = `
      <div class="feedback-box">

        <div>📌 <b>Question :</b><br>${currentQuestion.q}</div>

        <div class="table-row">${t.cells}</div>

        <div>
          🧠 Raisonnement en puissances de 10 :<br><br>

          Je compare les préfixes → différence d’exposants = ${expStep}<br><br>

          Donc :<br>
          1 unité source = 10<sup>${expStep}</sup> unité cible<br><br>

          ${value} × 10<sup>${expStep}</sup> = ${result}
        </div>

      </div>
    `;
  }

 else {

    const exp = Math.log10(currentQuestion.a / currentQuestion.value);
    const expFix = exp.toFixed(0);

    const from = currentQuestion.from;
    const to = currentQuestion.to;

    content = `
      <div class="feedback-box">

        <div>📌 <b>Question :</b><br>${currentQuestion.q}</div>

        <div>
          🧠 <b>Raisonnement pas à pas :</b><br><br>

          1️⃣ Je connais la relation entre les unités :<br>
          <b>1 ${from} = 10<sup>${expFix}</sup> ${to}</b><br><br>

          2️⃣ Donc pour convertir, je multiplie par ce facteur :<br>
          <b>facteur = 10<sup>${expFix}</sup></b><br><br>

          3️⃣ Application numérique :<br>
          ${value} × 10<sup>${expFix}</sup><br><br>

          4️⃣ Résultat :<br>
          ${result}
        </div>

      </div>
    `;
}
  fb.innerHTML = content;
}

/* =========================
   RESTE INCHANGÉ
========================= */

function submitAnswer() {

  if (gameOver) return;

  const input = Number(document.getElementById("answer").value.replace(",", "."));
  const good = currentQuestion.a;

  const epsilon = Math.abs(good) * 1e-4 + 1e-6;

  if (!isNaN(input) && Math.abs(input - good) < epsilon) {

    playGoodSound();

    score++;
    current++;

    updateUI();

    generateQuestion();
    load();

  } else {

    showFeedback(false);
    setTimeout(() => endGame(), 2500);
  }
}

function load() {
  document.getElementById("question").innerHTML = currentQuestion.q;
  document.getElementById("answer").value = "";
  document.getElementById("feedback").classList.remove("active");
}

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

function endGame() {

  if (gameOver) return;

  gameOver = true;

  clearInterval(timer);

  setTimeout(() => {
    window.location.href =
      "gameover.html?game=conversions&score=" + score;
  }, 20000);
}

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
