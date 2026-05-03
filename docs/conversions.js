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

const SI_UNITS = {
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
  bit: ["", "k", "M", "G"]
};

/* =========================
   DERIVED (type 4)
========================= */

const DERIVED_UNITS = [
  { from: "dm³", to: "L", factor: 1 },
  { from: "L", to: "dm³", factor: 1 },
  { from: "cm³", to: "mL", factor: 1 },
  { from: "mL", to: "cm³", factor: 1 },
  { from: "m³", to: "L", factor: 1e3 },
  { from: "L", to: "m³", factor: 1e-3 }
];

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
  { from: "mm³", to: "m³", factor: 1e-9 }
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
  if (score >= 3) return "hard";
  if (score >= 2) return "medium";
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

  const bases = Object.keys(SI_UNITS);
  const base = bases[Math.floor(Math.random() * bases.length)];
  const allowed = SI_UNITS[base];

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

  /* =========================
     CAS DERIVÉS (type 4)
  ========================= */
  if (DERIVED_UNITS.some(u =>
    u.from === item.from && u.to === item.to
  )) {
    return 4;
  }

  /* =========================
     CAS PHYSIQUE SIMPLE (type 3)
  ========================= */
  if (["mol", "Hz", "Pa", "N", "W", "J"].includes(clean)) {
    return 3;
  }

  /* PHYSIQUE COMPLEXE (liste objet) */
  if (PHYSICS.some(u =>
    u.from === item.from && u.to === item.to
  )) {
    return 3;
  }

  /* =========================
     SURFACES / VOLUMES (type 3 MAIS SUBTYPE geom)
  ========================= */
  if (SURFACES_VOLUMES.some(u =>
    u.from === item.from && u.to === item.to
  )) {
    return 3;
  }

  /* =========================
     TYPE 1 (conversion simple)
  ========================= */
  return 1;
}

/* =========================
   SOUS-TYPES TYPE 3
========================= */

function getType3Subtype(item) {

  const base = item.from || item;

  /* =========================
     NETTOYAGE ROBUSTE UNITÉS COMPOSÉES
  ========================= */
  const clean = base
    .replace(/·/g, "")
    .replace(/⁻¹/g, "")
    .replace(/⁻²/g, "")
    .replace(/⁻³/g, "")
    .replace(/(G|M|k|h|da|d|c|m|µ|n)/g, "");

  /* =========================
     FRÉQUENCE
  ========================= */
  if (clean === "Hz") return "freq";

  /* =========================
     PHYSIQUE SIMPLE
  ========================= */
  if (["Pa", "N", "W", "J", "mol"].includes(clean)) {
    return "physics";
  }

  /* =========================
     SURFACES / VOLUMES (FIX IMPORTANT)
  ========================= */
  if (SURFACES_VOLUMES.some(u =>
    u.from === item.from && u.to === item.to
  )) {
    return "geom";
  }

  /* =========================
     PAR DÉFAUT
  ========================= */
  return "physics";
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
    item
  };
}

/* =========================
   TABLEAU
========================= */

function buildTable(from, to) {

  const scale = ["G","M","k","h","da","","d","c","m","µ","n"];

  const exp = {
    "G": 9, "M": 6, "k": 3, "h": 2, "da": 1,
    "": 0, "d": -1, "c": -2, "m": -3, "µ": -6, "n": -9
  };

  const getPrefix = (u) => {
    const match = u.match(/^(G|M|k|h|da|d|c|m|µ|n)/);
    return match ? match[0] : "";
  };

  const f = getPrefix(from);
  const t = getPrefix(to);

  const cells = scale.map(p => {

    const isStart = p === f;
    const isEnd = p === t;

    let color = "white";
    if (isStart) color = "#7CFC00";
    else if (isEnd) color = "violet";

    return `
      <div class="cell"
        style="color:${color};font-weight:${isStart || isEnd ? 'bold' : 'normal'};">
        ${p}<br>
        <span>10<sup>${exp[p]}</sup></span>
      </div>
    `;
  }).join("");

  return { cells, step: exp[t] - exp[f], exp, f, t };
}

/* =========================
   FEEDBACK (CORRIGÉ)
========================= */

function showFeedback(isCorrect) {

  const fb = document.getElementById("feedback");
  if (!fb) return;

  fb.classList.add("active");

  const type = getExerciseType(currentQuestion.item);

  if (isCorrect) return;

  playBadSound();

  const value = currentQuestion.value;
  const result = toScientific(currentQuestion.a);

  let content = "";

  /* =========================
     TYPE 4 (PAR CŒUR)
  ========================= */
  if (type === 4) {

    content = `
      <div class="feedback-box">
        <div>📌 <b>Question :</b><br>${currentQuestion.q}</div>

        <div style="margin-top:10px;color:#ff4d4d;font-weight:bold;">
          😏 Désolé très cher mais ça, c’est à connaître par cœur !!!
        </div>

        <div style="margin-top:10px">
          👉 ${currentQuestion.from} = ${currentQuestion.to}
        </div>
      </div>
    `;
  }

  /* =========================
     TYPE 1 / 2 (TABLE + RECETTE)
  ========================= */
  else if (type === 1 || type === 2) {

    const table = buildTable(currentQuestion.from, currentQuestion.to);

    const expFrom = table.exp[table.f];
    const expTo = table.exp[table.t];

    const yellowValue = `<span style="color:yellow;font-weight:bold;">${formatFR(value)}</span>`;
    const startUnit = `<span style="color:#7CFC00;font-weight:bold;">${currentQuestion.from}</span>`;
    const endUnit = `<span style="color:violet;font-weight:bold;">${currentQuestion.to}</span>`;

    const numerator = `<span style="color:#7CFC00">10<sup>${expFrom}</sup></span>`;
    const denominator = `<span style="color:violet">10<sup>${expTo}</sup></span>`;
    const powerResult = `10<sup>${expFrom - expTo}</sup>`;

    content = `
      <div class="feedback-box">

        <div>📌 <b>Question :</b><br>
          ${yellowValue} ${startUnit} → ${endUnit}
        </div>

        <div class="table-row">${table.cells}</div>

        <div>
          🧠 <b>Recette magique :</b><br><br>

          <div style="font-size:20px;text-align:center;">
            <div>${numerator}</div>
            <div style="border-top:2px solid #fff;width:120px;margin:5px auto;"></div>
            <div>${denominator}</div>
          </div>

          <br>

          🔎 ${powerResult} <br><br>

          🧮 Résultat : ${yellowValue} ${startUnit} = ${yellowValue} × ${powerResult} ${endUnit}
        </div>

      </div>
    `;
  }

  /* =========================
     TYPE 3 + PHYSICS
  ========================= */
  else {

    const subtype = getType3Subtype(currentQuestion.item);

    const yellowValue = `<span style="color:yellow;font-weight:bold;">${formatFR(value)}</span>`;
    const startUnit = `<span style="color:#7CFC00;font-weight:bold;">${currentQuestion.from}</span>`;
    const endUnit = `<span style="color:violet;font-weight:bold;">${currentQuestion.to}</span>`;

    const isComposite =
      currentQuestion.from.includes("·") ||
      currentQuestion.from.includes("⁻") ||
      currentQuestion.to.includes("·") ||
      currentQuestion.to.includes("⁻");

    if (isComposite) {

      content = `
        <div class="feedback-box">

          <div>📌 <b>Question :</b><br>
            ${yellowValue} ${startUnit} → ${endUnit}
          </div>

          <div style="margin-top:10px">
            🔥 Tu es sur une unité composée !
          </div>

          <div style="margin-top:10px">
            🧮 Résultat : ${yellowValue} ${startUnit} = ${result} ${endUnit}
          </div>

          <div style="margin-top:10px">
            💪 Essaie de décomposer les unités étape par étape pour retrouver le facteur entre les deux grandeurs !
          </div>

        </div>
      `;
    }

    else {

      const table = buildTable(currentQuestion.from, currentQuestion.to);

      const expFrom = table.exp[table.f];
      const expTo = table.exp[table.t];
      const delta = expFrom - expTo;

      const factor = `10<sup>${delta}</sup>`;

      content = `
        <div class="feedback-box">

          <div>📌 <b>Question :</b><br>
            ${yellowValue} ${startUnit} → ${endUnit}
          </div>

          <div style="margin-top:10px">
            📦 Unité de départ : ${startUnit}
          </div>

          <div style="margin-top:10px">
            📦 Unité d’arrivée : ${endUnit}
          </div>

          <div class="table-row" style="filter: grayscale(1); opacity:0.9;">
            ${table.cells}
          </div>

          <div style="margin-top:10px">
            🧮 Résultat : ${yellowValue} ${startUnit} = ${result} ${endUnit}
          </div>

          <div style="margin-top:10px">
            🚀 Maintenant, ton défi : retrouve par toi-même le facteur de conversion entre ces deux unités !
          </div>

        </div>
      `;
    }
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
