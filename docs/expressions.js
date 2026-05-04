let score = 0;
let current = 0;

let timeLeft = 180;
let timer = null;

let gameOver = false;

let currentQuestion = null;

/* =========================
   BASE DE DONNÉES
========================= */

const QUESTIONS = [

  {
    difficulty: "easy",
    domain: "electricite",
    expr: "U = R \\times I",
    baseVars: ["U", "R", "I"],
    targetPool: ["R", "I"],
    law: "Loi d’Ohm",
    image: "images/ohm.jpg"
  },

  {
    difficulty: "medium",
    domain: "gravitation",
    expr: "E = m \\times c^2",
    baseVars: ["E", "m", "c"],
    displayVars: { "c": "c^2" },
    targetPool: ["m", "c"],
    law: "Énergie de masse",
    image: "images/einstein.jpg"
  },

  {
    difficulty: "easy",
    domain: "mouvement",
    expr: "v = \\frac{d}{t}",
    baseVars: ["v", "d", "t"],
    targetPool: ["t", "d"],
    law: "Relation vitesse",
    image: "images/speed.jpg"
  },

  {
    difficulty: "hard",
    domain: "gravitation",
    expr: "v = \\sqrt{\\frac{G M}{R}}",
    baseVars: ["v","G","M","R"],
    targetPool: ["R","M"],
    law: "Lois des orbites",
    image: "images/orbit.jpg"
  },

  {
    difficulty: "hard",
    domain: "gravitation",
    expr: "T = \\sqrt{\\frac{R^3}{G M}}",
    baseVars: ["T","R","G","M"],
    targetPool: ["R","M"],
    law: "Loi de Kepler",
    image: "images/kepler.jpg"
  }
];

/* =========================
   UTIL VARIABLES
========================= */

function getVars(q, target) {
  return q.baseVars.filter(v => v !== target);
}

function formatVar(q, v) {
  return q.displayVars?.[v] || v;
}

/* =========================
   ICONES
========================= */

function formatDomain(domain) {

  const d = domain.toLowerCase();

  if (d.includes("chimie")) return "⚗️ Chimie";
  if (d.includes("atomistique")) return "⚛️ Atomistique";
  if (d.includes("synthese")) return "🧬 Synthèse chimique";

  if (d.includes("mouvement")) return "🏃 Mouvement";
  if (d.includes("forces")) return "💪 Forces";

  if (d.includes("onde")) return "🌊 Ondes";
  if (d.includes("lentilles")) return "🔭 Lentilles";

  if (d.includes("electricite")) return "⚡ Électricité";
  if (d.includes("gravitation")) return "🌍 Gravitation";

  if (d.includes("fluide")) return "💧 Fluides";

  if (d.includes("thermodynam")) return "🔥 Thermodynamique";

  if (d.includes("quantique")) return "🧠 Quantique";

  if (d.includes("energie")) return "⚙️ Énergie";

  return "📚 Physique";
}

/* =========================
   SOLVEUR
========================= */

function solve(q, target) {

  const e = q.expr;

  if (e.includes("\\times") && !e.includes("^")) {

    const [left, right] = e.split("=");
    const vars = right.split("\\times").map(v => v.trim());

    if (target === vars[0])
      return { result: `${target} = \\frac{${left.trim()}}{${vars[1]}}`, type: "division" };

    if (target === vars[1])
      return { result: `${target} = \\frac{${left.trim()}}{${vars[0]}}`, type: "division" };
  }

  if (e.includes("\\frac")) {

    if (target === "t")
      return { result: `t = \\frac{d}{v}`, type: "inverse" };

    if (target === "d")
      return { result: `d = v \\times t`, type: "product" };
  }

  if (e.includes("c^2")) {

    if (target === "m")
      return { result: `m = \\frac{E}{c^2}`, type: "division_power" };

    if (target === "c")
      return { result: `c = \\sqrt{\\frac{E}{m}}`, type: "sqrt" };
  }

  if (e.includes("\\sqrt") && e.includes("G") && !e.includes("R^3")) {

    if (target === "R")
      return { result: `R = \\frac{G M}{v^2}`, type: "square_division" };

    if (target === "M")
      return { result: `M = \\frac{R v^2}{G}`, type: "square_division" };
  }

  if (e.includes("R^3")) {

    if (target === "R")
      return { result: `R = \\sqrt[3]{T^2 G M}`, type: "cube_root" };

    if (target === "M")
      return { result: `M = \\frac{R^3}{G T^2}`, type: "power_division" };
  }

  return { result: `${target} = ?`, type: "unknown" };
}

/* =========================
   FEEDBACK TYPE
========================= */

function getFeedback(type) {

  switch (type) {
    case "division": return "On divise les deux côtés";
    case "inverse": return "On inverse la fraction";
    case "division_power": return "On divise en tenant compte de la puissance";
    case "sqrt": return "On élève au carré des deux côtés";
    case "square_division": return "On isole puis on supprime la racine";
    case "cube_root": return "On élève à la puissance 3";
    case "power_division": return "On combine racines et puissances";
    default: return "On réarrange l’équation";
  }
}

/* =========================
   EXPLICATION
========================= */

function explainSolve(q, target) {

  const s = solve(q, target);

  return [
    `Équation : ${q.expr}`,
    `Variable : ${target}`,
    `Méthode : ${s.type}`,
    `Résultat : ${s.result}`
  ];
}

/* =========================
   DISTRACTEURS INTELLIGENTS
========================= */

function randInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function generateDistractors(q, target, correct, vars) {

  const a = vars[0];
  const b = vars[1];

  const wrong = [];

  const expr = q.expr;

  const noise = () => {
    const k = randInt(2, 3); // 2 ou 3
    return k;
  };

  /* =========================
     1. CAS RACINE (√)
  ========================= */

  if (correct.includes("\\sqrt")) {

    const k = noise();

    wrong.push(`${target} = \\frac{${a}}{${b}}`);
    wrong.push(`${target} = \\frac{${a}^${k}}{${b}}`);
    wrong.push(`${target} = \\sqrt{${a} \\times ${b}}`);
    wrong.push(`${target} = \\frac{${a}}{${b}^${k}}`);
    wrong.push(`${target} = \\sqrt{${a}^${k} + ${b}}`);
  }

  /* =========================
     2. CAS PUISSANCE (^2)
  ========================= */

  else if (expr.includes("^2")) {

    const k = noise();

    wrong.push(`${target} = \\frac{${a}}{${b}}`);
    wrong.push(`${target} = \\sqrt{\\frac{${a}}{${b}}}`);
    wrong.push(`${target} = ${a} \\times ${b}`);
    wrong.push(`${target} = \\frac{${a}^${k}}{${b}}`);
    wrong.push(`${target} = \\sqrt{${a}^${k} ${b}}`);
  }

  /* =========================
     3. CAS FRACTION
  ========================= */

  else if (correct.includes("\\frac")) {

    const k = noise();

    wrong.push(`${target} = \\frac{${b}}{${a}}`);
    wrong.push(`${target} = ${a} \\times ${b}`);
    wrong.push(`${target} = ${a} + ${b}`);
    wrong.push(`${target} = \\frac{${a}^${k}}{${b}}`);
    wrong.push(`${target} = \\frac{${a}}{${b}^${k}}`);
  }

  /* =========================
     4. CAS PRODUIT
  ========================= */

  else {

    const k = noise();

    wrong.push(`${target} = \\frac{${a}}{${b}}`);
    wrong.push(`${target} = ${a} \\times ${b}`);
    wrong.push(`${target} = ${b} / ${a}`);
    wrong.push(`${target} = ${a}^${k} \\times ${b}`);
    wrong.push(`${target} = ${a} \\times ${b}^${k}`);
  }

  return wrong;
}

/* =========================
   QUESTION GENERATION
========================= */

function normalizeLatex(str) {
  return str
    .replace(/\s+/g, "")   // enlève espaces
    .replace(/\\,/g, "")   // enlève micro-espaces latex
    .trim();
}

function generateQuestion() {

  const q = QUESTIONS[Math.floor(Math.random() * QUESTIONS.length)];
  const target = q.targetPool[Math.floor(Math.random() * q.targetPool.length)];

  const solved = solve(q, target);
  const correctRaw = solved.result;

  const vars = getVars(q, target);

  const a = formatVar(q, vars[0]);
  const b = formatVar(q, vars[1]);

  /* =========================
     1. DISTRACTEURS
  ========================= */

  let distractors = generateDistractors(q, target, correctRaw, vars);

  /* =========================
     2. NETTOYAGE + UNICITÉ
  ========================= */

  const allRaw = [correctRaw, ...distractors];

  const seen = new Set();
  const unique = [];

  let correctIndex = -1;

  allRaw.forEach((item) => {

    const norm = normalizeLatex(item);

    if (!seen.has(norm)) {
      seen.add(norm);
      unique.push(item);
    }
  });

  /* =========================
     3. GARANTIR 4 CHOIX MINIMUM
  ========================= */

  while (unique.length < 4) {
    unique.push(`${target} = ?`);
  }

  /* =========================
     4. MELANGE
  ========================= */

  const choices = unique.sort(() => Math.random() - 0.5);

  /* =========================
     5. RECHERCHE INDEX CORRECT
  ========================= */

  correctIndex = choices.findIndex(
    c => normalizeLatex(c) === normalizeLatex(correctRaw)
  );

  /* =========================
     6. SECURITE FALLBACK
  ========================= */

  if (correctIndex === -1) correctIndex = 0;

  currentQuestion = {
    ...q,
    target,
    choices,
    answer: correctIndex
  };
}

/* =========================
   LOAD
========================= */

function load() {

  const q = currentQuestion;

  // ❌ on retire domain de la box question
  document.getElementById("question").innerHTML =
    `D’après la relation : \\(${q.expr}\\)<br><br>
     Variable : <b>${q.target}</b>`;

  renderChoices(q);

  document.getElementById("feedback").innerHTML = "";

  if (window.MathJax) MathJax.typeset();

  setTimeout(() => showImage(q), 0);

  // 🔥 ZONE DROITE ENRICHIE
  const dom = document.getElementById("imageDomain");
  const law = document.getElementById("imageTitle");

  if (dom) dom.innerHTML = q.domain ? formatDomain(q.domain) : "";
  if (law) law.innerHTML = q.law ? `🔬 ${q.law}` : "";
}

/* =========================
   CHOICES
========================= */

function renderChoices(q) {

  const container = document.getElementById("choices");
  container.innerHTML = "";

  q.choices.forEach((c, i) => {

    const btn = document.createElement("button");
    btn.innerHTML = `\\(${c}\\)`;
    btn.onclick = () => submitAnswer(i);
    container.appendChild(btn);
  });

  if (window.MathJax) MathJax.typeset();
}

/* =========================
   IMAGE
========================= */

function showImage(q) {

  const img = document.getElementById("illustration");

  if (!q?.image) {
    img.style.display = "none";
    return;
  }

  const temp = new Image();

  temp.onload = () => {
    img.src = q.image;
    img.style.display = "block";
  };

  temp.src = q.image;
}

/* =========================
   SUBMIT
========================= */

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
    showFeedback();
    setTimeout(endGame, 2000);
  }
}

/* =========================
   FEEDBACK FINAL
========================= */

function showFeedback() {

  const q = currentQuestion;
  const steps = explainSolve(q, q.target);
  const solved = solve(q, q.target);

  const fb = document.getElementById("feedback");

  fb.innerHTML = `
    ❌ Mauvaise réponse<br><br>
    ✔ Bonne réponse : \\(${solved.result}\\)<br><br>
    🧠 Explication :
    <br><br>
    ${steps.map(s => {
      if (s.includes("=")) return `• \\(${s}\\)`;
      return `• ${s}`;
    }).join("<br>")}
  `;

  if (window.MathJax) {
    setTimeout(() => MathJax.typeset(), 0);
  }
}

/* =========================
   TIMER / GAME (inchangé)
========================= */

function startTimer() {

  clearInterval(timer);

  timer = setInterval(() => {

    if (gameOver) return clearInterval(timer);

    timeLeft--;

    const t = document.getElementById("timer");
    if (t) t.textContent = timeLeft + "s";

    if (timeLeft <= 0) endGame();

  }, 1000);
}

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

function endGame() {

  if (gameOver) return;
  gameOver = true;

  clearInterval(timer);

  let ranking = JSON.parse(localStorage.getItem("ranking") || "[]");

  ranking.push({ score });

  ranking.sort((a,b) => b.score - a.score);

  localStorage.setItem("ranking", JSON.stringify(ranking));

  setTimeout(() => {
    window.location.href = "gameover.html?score=" + score;
  }, 8000);
}

function updateUI() {
  document.getElementById("score").textContent = score;

  const mode =
    score > 5 ? "hard" :
    score > 2 ? "medium" : "easy";

  const m = document.getElementById("mode");
  m.textContent = mode;
}

function playSound(id) {
  const s = document.getElementById(id);
  if (!s) return;
  s.currentTime = 0;
  s.play().catch(()=>{});
}

function playGoodSound() { playSound("goodSound"); }
function playBadSound() { playSound("badLight"); }
