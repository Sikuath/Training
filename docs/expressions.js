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

  // =========================
  // 1. ACTIVE (test direct)
  // =========================
  {
    difficulty: "easy",
    domain: "electricite",
    expr: "U = R \\times I",
    baseVars: ["U", "R", "I"],
    targetPool: ["R", "I"],
    law: "Loi d’Ohm",
    image: "images/ohm.jpg"
  },

  // =========================
  // 2. MASSE VOLUMIQUE
  // =========================
  // { difficulty:"easy", domain:"chimie", expr:"rho = m / V", baseVars:["rho","m","V"], targetPool:["m","V"], law:"Masse volumique", image:"images/chimie.jpg" },

  // 3. DENSITÉ
  // { difficulty:"easy", domain:"chimie", expr:"d = rho / rho0", baseVars:["d","rho","rho0"], targetPool:["rho"], law:"Densité", image:"images/chimie.jpg" },

  // 4. CONCENTRATION MASSIQUE
  // { difficulty:"easy", domain:"chimie", expr:"Cm = m / V", baseVars:["Cm","m","V"], targetPool:["m","V"], law:"Concentration massique", image:"images/chimie.jpg" },

  // 5. CONCENTRATION MOLAIRE
  // { difficulty:"easy", domain:"chimie", expr:"C = n / V", baseVars:["C","n","V"], targetPool:["n","V"], law:"Concentration molaire", image:"images/chimie.jpg" },

  // 6. QUANTITÉ DE MATIÈRE
  // { difficulty:"easy", domain:"chimie", expr:"n = m / M", baseVars:["n","m","M"], targetPool:["m","M"], law:"Quantité de matière", image:"images/chimie.jpg" },

  // 7. DILUTION
  // { difficulty:"medium", domain:"chimie", expr:"C1 V1 = C2 V2", baseVars:["C1","V1","C2","V2"], targetPool:["C1","C2"], law:"Dilution", image:"images/chimie.jpg" },

  // 8. POIDS
  // { difficulty:"easy", domain:"forces", expr:"P = m g", baseVars:["P","m","g"], targetPool:["m"], law:"Poids", image:"images/forces.jpg" },

  // 9. FORCE GRAVITATIONNELLE
  // { difficulty:"medium", domain:"gravitation", expr:"F = G \\frac{m1 m2}{r^2}", baseVars:["F","m1","m2","r"], targetPool:["r","m1"], law:"Newton gravitation", image:"images/gravity.jpg" },

  // 10. DOPPLER (simplifié)
  // { difficulty:"hard", domain:"ondes", expr:"f' = f \\frac{v+vr}{v+vs}", baseVars:["f'","f","v","vr","vs"], targetPool:["f"], law:"Effet Doppler", image:"images/doppler.jpg" },

  // 11. SNELL DESCARTES
  // { difficulty:"medium", domain:"ondes", expr:"n1 \\sin(i) = n2 \\sin(r)", baseVars:["n1","n2","i","r"], targetPool:["n1","n2"], law:"Réfraction", image:"images/refraction.jpg" },

  // 12. GRANDISSEMENT LENTILLE
  // { difficulty:"medium", domain:"lentilles", expr:"G = A'B' / AB", baseVars:["G","A'B'","AB"], targetPool:["G"], law:"Grandissement", image:"images/lens.jpg" },

  // 13. BEER LAMBERT
  // { difficulty:"hard", domain:"chimie", expr:"A = epsilon l C", baseVars:["A","epsilon","l","C"], targetPool:["C"], law:"Beer-Lambert", image:"images/chimie.jpg" },

  // 14. TITRAGE
  // { difficulty:"medium", domain:"chimie", expr:"nA/a = nB/b", baseVars:["nA","nB","a","b"], targetPool:["nA","nB"], law:"Titrage", image:"images/titrage.jpg" },

  // 15. THERMIQUE
  // { difficulty:"medium", domain:"energie", expr:"Q = m c (Tf - Ti)", baseVars:["Q","m","c","Tf","Ti"], targetPool:["m","Q"], law:"Chaleur", image:"images/thermo.jpg" },

  // 16. COULOMB
  // { difficulty:"medium", domain:"electricite", expr:"F = k \\frac{q1 q2}{r^2}", baseVars:["F","q1","q2","r"], targetPool:["r","q1"], law:"Coulomb", image:"images/coulomb.jpg" },

  // 17. STATIQUE FLUIDES
  // { difficulty:"medium", domain:"fluide", expr:"P = rho g h", baseVars:["P","rho","g","h"], targetPool:["h"], law:"Hydrostatique", image:"images/fluide.jpg" },

  // 18. MARIOTTE
  // { difficulty:"medium", domain:"thermodynamique", expr:"P V = cste", baseVars:["P","V"], targetPool:["P","V"], law:"Boyle-Mariotte", image:"images/gaz.jpg" },

  // 19. PUISSANCE
  // { difficulty:"easy", domain:"energie", expr:"P = E / t", baseVars:["P","E","t"], targetPool:["E","t"], law:"Puissance", image:"images/energie.jpg" },

  // 20. JOULE
  // { difficulty:"easy", domain:"electricite", expr:"E = R I^2 t", baseVars:["E","R","I","t"], targetPool:["E","R"], law:"Effet Joule", image:"images/joule.jpg" },

  // =========================================================
  // 21 → 40 (comportent mécanique + ondes + quantique + etc)
  // =========================================================

  // 21. CINÉTIQUE
  // { difficulty:"easy", domain:"energie", expr:"Ec = 1/2 m v^2", baseVars:["Ec","m","v"], targetPool:["m","v"], law:"Énergie cinétique", image:"images/ec.jpg" },

  // 22. POTENTIEL PESANTEUR
  // { difficulty:"easy", domain:"energie", expr:"Ep = m g h", baseVars:["Ep","m","h"], targetPool:["m","h"], law:"Énergie potentielle", image:"images/ep.jpg" },

  // 23. ONDE
  // { difficulty:"easy", domain:"ondes", expr:"v = lambda f", baseVars:["v","lambda","f"], targetPool:["lambda","f"], law:"Célérité onde", image:"images/onde.jpg" },

  // 24. PHOTON
  // { difficulty:"hard", domain:"quantique", expr:"E = h f", baseVars:["E","h","f"], targetPool:["E","f"], law:"Photon", image:"images/photon.jpg" },

  // 25. RADIOACTIVITÉ
  // { difficulty:"hard", domain:"quantique", expr:"N = N0 e^{-lambda t}", baseVars:["N","N0","t"], targetPool:["t"], law:"Radioactivité", image:"images/radio.jpg" },

  // 26. PH
  // { difficulty:"medium", domain:"chimie", expr:"pH = -log(H+)", baseVars:["pH","H+"], targetPool:["H+"], law:"pH", image:"images/ph.jpg" },

  // 27. KEPLER 3
  // { difficulty:"hard", domain:"gravitation", expr:"T^2 = k R^3", baseVars:["T","R"], targetPool:["R","T"], law:"Kepler III", image:"images/kepler.jpg" },

  // 28. BERNOULLI
  // { difficulty:"hard", domain:"fluide", expr:"P + 1/2 rho v^2 = cste", baseVars:["P","v","rho"], targetPool:["v"], law:"Bernoulli", image:"images/fluide.jpg" },

  // 29. ARCHIMEDE
  // { difficulty:"medium", domain:"fluide", expr:"F = rho V g", baseVars:["F","rho","V"], targetPool:["V"], law:"Poussée Archimède", image:"images/fluide.jpg" },

  // 30. VENTURI
  // { difficulty:"hard", domain:"fluide", expr:"v1 S1 = v2 S2", baseVars:["v1","v2","S1","S2"], targetPool:["v1","v2"], law:"Venturi", image:"images/fluide.jpg" },

  // 31. GAZ PARFAIT
  // { difficulty:"hard", domain:"thermodynamique", expr:"PV = nRT", baseVars:["P","V","n","T"], targetPool:["n","T"], law:"Gaz parfait", image:"images/gaz.jpg" },

  // 32. STEFAN BOLTZMANN
  // { difficulty:"hard", domain:"energie", expr:"P = sigma T^4", baseVars:["P","T"], targetPool:["T"], law:"Rayonnement", image:"images/thermo.jpg" },

  // 33. RC
  // { difficulty:"hard", domain:"electricite", expr:"tau = R C", baseVars:["tau","R","C"], targetPool:["R","C"], law:"Circuit RC", image:"images/rc.jpg" },

  // 34. DIFFRACTION
  // { difficulty:"hard", domain:"ondes", expr:"theta = lambda / a", baseVars:["theta","lambda","a"], targetPool:["a"], law:"Diffraction", image:"images/ondes.jpg" },

  // 35. INTERFÉRENCE
  // { difficulty:"hard", domain:"ondes", expr:"i = lambda D / a", baseVars:["i","lambda","D","a"], targetPool:["a"], law:"Interférences", image:"images/ondes.jpg" },

  // 36. SON
  // { difficulty:"medium", domain:"ondes", expr:"L = 10 log(I/I0)", baseVars:["L","I"], targetPool:["I"], law:"Intensité sonore", image:"images/son.jpg" },

  // 37. ACCÉLÉRATION NORMALE
  // { difficulty:"medium", domain:"mouvement", expr:"a = v^2 / R", baseVars:["a","v","R"], targetPool:["R"], law:"Mouvement circulaire", image:"images/mouvement.jpg" },

  // 38. CHARGE ÉLECTRIQUE
  // { difficulty:"easy", domain:"electricite", expr:"q = n e", baseVars:["q","n"], targetPool:["n"], law:"Charge électrique", image:"images/electricite.jpg" },

  // 39. LENTILLE
  // { difficulty:"hard", domain:"lentilles", expr:"1/f = 1/d0 + 1/di", baseVars:["f","d0","di"], targetPool:["d0","di"], law:"Conjugaison", image:"images/lens.jpg" },

  // 40. GROSSISSEMENT LUNETTE
  // { difficulty:"hard", domain:"optique", expr:"G = fo / fe", baseVars:["G","fo","fe"], targetPool:["G"], law:"Lunette astronomique", image:"images/optique.jpg" },

];

/* =========================
   LATEX
========================= */

function toLatex(expr) {
  if (!expr) return "";

  return expr
    // enlever espaces
    .replace(/\s+/g, "")

    // fractions complexes (parenthèses)
    .replace(/\(([^)]+)\)\/\(([^)]+)\)/g, "\\frac{$1}{$2}")

    // fractions simples
    .replace(/([a-zA-Z0-9]+)\/([a-zA-Z0-9]+)/g, "\\frac{$1}{$2}")

    // sqrt
    .replace(/sqrt\(([^)]+)\)/g, "\\sqrt{$1}")

    // puissances
    .replace(/\^(\d+)/g, "^{$1}")

    // multiplication
    .replace(/\*/g, " \\times ");
}

/* =========================
   PARSER
========================= */

function parseExpr(expr) {
  return expr
    .replace(/\s/g, "")
    .replace("\\times", "*")
    .replace("\\frac{([^}]*)}{([^}]*)}", "($1)/($2)");
}

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

function solveUniversal(q, target) {

  const e = parseExpr(q.expr);

  // extraction brute gauche / droite
  const [L, R] = e.split("=");

  // CAS 1 : produit
  if (R.includes("*")) {

    const [a, b] = R.split("*");

    if (target === a)
      return { result: `${a} = ${L}/${b}`, type: "division" };

    if (target === b)
      return { result: `${b} = ${L}/${a}`, type: "division" };
  }

  // CAS 2 : fraction
  if (R.includes("/")) {

    const [a, b] = R.split("/");

    if (target === a)
      return { result: `${a} = ${L}*${b}`, type: "multiplication" };

    if (target === b)
      return { result: `${b} = ${a}/${L}`, type: "inverse" };
  }

  // CAS 3 : puissance 2
  if (R.includes("^2")) {

    if (target === "c")
      return { result: `c = sqrt(${L}/m)`, type: "sqrt" };

    if (target === "m")
      return { result: `m = ${L}/c^2`, type: "division_power" };
  }

  // CAS 4 : racine
  if (R.includes("sqrt")) {

    if (target === "R")
      return { result: `R = (GM)/v^2`, type: "square" };

    if (target === "M")
      return { result: `M = (Rv^2)/G`, type: "square" };
  }

  return { result: `${target} = ?`, type: "unknown" };
}

/* =========================
   FEEDBACK TYPE
========================= */

function buildFeedback(type, q, target) {

  const map = {
    division: "On divise les deux côtés de l’équation",
    multiplication: "On multiplie pour isoler la variable",
    inverse: "On inverse la fraction",
    sqrt: "On élève au carré des deux côtés",
    square: "On isole puis on simplifie la racine",
    division_power: "On tient compte des puissances lors de l’isolation",
    unknown: "Réarrangement algébrique classique"
  };

  return `
    🧠 Méthode : ${map[type] || "Étape algébrique"}<br>
    📌 On part de : \\(${q.expr}\\)<br>
    🎯 Variable isolée : <b>${target}</b>
  `;
}

/* =========================
   EXPLICATION
========================= */

function explainSolve(q, target) {

  const s = solveUniversal(q, target);

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

function generateDistractors(q, target, correct, vars) {

  const [a, b] = vars.length >= 2 ? vars : [vars[0], vars[0]];

  const wrong = [];

  const k = Math.random() < 0.5 ? 2 : 3;

  /* =========================
     BASE ERREURS
  ========================= */

  if (a && b) {
    wrong.push(`${target} = ${b}/${a}`);
    wrong.push(`${target} = ${a}*${b}`);
    wrong.push(`${target} = ${a}+${b}`);
  }

  /* =========================
     PUISSANCES / RACINES
  ========================= */

  if (correct.includes("sqrt") || correct.includes("\\sqrt")) {

    wrong.push(`${target} = (${a})^${k}/${b}`);
    wrong.push(`${target} = sqrt(${a}*${b})`);
    wrong.push(`${target} = ${a}/(${b}^${k})`);
  }

  if (correct.includes("^2")) {

    wrong.push(`${target} = sqrt(${a}/${b})`);
    wrong.push(`${target} = (${a})^${k}/${b}`);
  }

  /* =========================
     ERREURS PHYSIQUES
  ========================= */

  wrong.push(`${target} = 2*(${correct.split("=")[1]})`);
  wrong.push(`${target} = (${a}-${b})`);

  /* =========================
     UNIQUE + LIMITATION
  ========================= */

  return [...new Set(wrong)].slice(0, 3);
}

/* =========================
   QUESTION GENERATION
========================= */

function normalizeLatex(str) {
  return str
    .replace(/\s+/g, "")
    .replace(/\\times/g, "*")
    .replace(/\\frac{([^}]*)}{([^}]*)}/g, "($1)/($2)")
    .replace(/\\sqrt{([^}]*)}/g, "sqrt($1)")
    .replace(/[{}]/g, "")
    .trim();
}

function generateQuestion() {

  const q = QUESTIONS[Math.floor(Math.random() * QUESTIONS.length)];
  const target = q.targetPool[Math.floor(Math.random() * q.targetPool.length)];

  const solved = solveUniversal(q, target);
  const correctRaw = solved.result;

  const vars = getVars(q, target);
  const distractors = generateDistractors(q, target, correctRaw, vars);

  const all = [correctRaw, ...distractors];

  const seen = new Set();
  const unique = [];

  all.forEach(item => {
    const norm = normalizeLatex(item);
    if (!seen.has(norm)) {
      seen.add(norm);
      unique.push(item);
    }
  });

  while (unique.length < 4) {
    unique.push(`${target} = ?`);
  }

  const choices = unique.sort(() => Math.random() - 0.5);

  const answer = choices.findIndex(
    c => normalizeLatex(c) === normalizeLatex(correctRaw)
  );

  currentQuestion = {
    ...q,
    target,
    choices,
    answer: answer !== -1 ? answer : 0,
    solveType: solved.type,
    domain: q.domain || "Physique",
    law: q.law || "Relation fondamentale",
    image: q.image || ""
  };
}

/* =========================
   LOAD
========================= */

function load() {

  const q = currentQuestion;

  if (!q) {
    console.warn("⚠️ Aucune question chargée");
    return;
  }

  // =========================
  // QUESTION CENTRALE
  // =========================
  document.getElementById("question").innerHTML =
    `D’après la relation : \\(${q.expr}\\)<br><br>
     Quelle est la bonne expression pour la variable <b>${q.target}</b> ?`;

  renderChoices(q);

  // =========================
  // FEEDBACK RESET
  // =========================
  const fb = document.getElementById("feedback");
  if (fb) fb.innerHTML = "";

  // =========================
  // BOX GAUCHE (FIX IMPORTANT)
  // =========================
  const dom = document.getElementById("imageDomain");
  const law = document.getElementById("imageTitle");

  if (dom) dom.innerHTML = formatDomain(q?.domain || "");
  if (law) law.innerHTML = q?.law ? `🔬 ${q.law}` : "";

  // =========================
  // IMAGE (MAINTENANT FIABLE)
  // =========================
  showImage(q);

  // =========================
  // MATHJAX SAFE
  // =========================
  if (window.MathJax) {
    setTimeout(() => {
      MathJax.typesetPromise?.() || MathJax.typeset();
    }, 50);
  }
}

/* =========================
   CHOICES
========================= */

function renderChoices(q) {

  const container = document.getElementById("choices");
  container.innerHTML = "";

  q.choices.forEach((c, i) => {

    const btn = document.createElement("button");

    // 🔥 CONVERSION LATEX ICI
    const latex = toLatex(c);

    btn.innerHTML = `\\(${latex}\\)`;

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
  if (!img) return;

  if (!q?.image) {
    img.style.display = "none";
    return;
  }

  img.onload = () => {
    img.style.display = "block";
  };

  img.onerror = () => {
    console.warn("Image introuvable :", q.image);
    img.style.display = "none";
  };

  img.src = q.image;
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
  const solved = solveUniversal(q, q.target);
  const fb = document.getElementById("feedback");

  fb.innerHTML = `
    ❌ Mauvaise réponse<br><br>

    ✔ Bonne réponse : \\(${toLatex(solved.result)}\\)<br><br>

    🧠 Explication :<br><br>

    • Équation : \\(${q.expr}\\)<br>
    • Variable : <b>${q.target}</b><br>
    • Méthode : ${solved.type}<br>
    • Résultat : \\(${toLatex(solved.result)}\\)
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

  if (!currentQuestion) {
    console.error("❌ generateQuestion a échoué");
    return;
  }

  load();
  updateUI();
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
