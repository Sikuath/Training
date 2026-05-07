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

  // 1. LOI D'OHM
  // { difficulty: "easy", domain: "electricite", expr: "U = R \\times I", baseVars: ["U", "R", "I"], targetPool: ["R", "I"], law: "Loi d’Ohm", image: "./images/ohm.jpg" },

  // 2. MASSE VOLUMIQUE
   { difficulty:"easy", domain:"chimie", expr:"rho = m/v", baseVars:["rho", "m","V"], targetPool:["m","V"], law:"Masse volumique", image:"./images/masse_volumique.jpg" },

  // 3. DENSITÉ
  // { difficulty:"easy", domain:"chimie", expr:"d = rho / rho0", baseVars:["d","rho","rho0"], targetPool:["rho"], law:"Densité", image:"./images/densite.jpg" },

  // 4. CONCENTRATION MASSIQUE
  // { difficulty:"easy", domain:"chimie", expr:"Cm = m / V", baseVars:["Cm","m","V"], targetPool:["m","V"], law:"Concentration massique", image:"./images/concentration_massique.jpg" },

  // 5. CONCENTRATION MOLAIRE
  // { difficulty:"easy", domain:"chimie", expr:"C = n / V", baseVars:["C","n","V"], targetPool:["n","V"], law:"Concentration molaire", image:"./images/concentration_molaire.jpg" },

  // 6. QUANTITÉ DE MATIÈRE
  // { difficulty:"easy", domain:"chimie", expr:"n = m / M", baseVars:["n","m","M"], targetPool:["m","M"], law:"Quantité de matière", image:"./images/quantite_matiere.jpg" },

  // 7. DILUTION
  // { difficulty:"medium", domain:"chimie", expr:"C1 V1 = C2 V2", baseVars:["C1","V1","C2","V2"], targetPool:["C1","C2"], law:"Dilution", image:"./images/dilution.jpg" },

  // 8. POIDS
  // { difficulty:"easy", domain:"forces", expr:"P = m g", baseVars:["P","m","g"], targetPool:["m"], law:"Poids", image:"./images/poids.jpg" },

  // 9. FORCE GRAVITATIONNELLE
  // { difficulty:"medium", domain:"gravitation", expr:"F = G \\frac{m1 m2}{r^2}", baseVars:["F","m1","m2","r"], targetPool:["r","m1"], law:"Newton gravitation", image:"./images/gravitation.jpg" },

  // 10. DOPPLER (simplifié)
  // { difficulty:"hard", domain:"ondes", expr:"f' = f \\frac{v+vr}{v+vs}", baseVars:["f'","f","v","vr","vs"], targetPool:["f"], law:"Effet Doppler", image:"./images/doppler.jpg" },

  // 11. SNELL DESCARTES
  // { difficulty:"medium", domain:"ondes", expr:"n1 \\sin(i) = n2 \\sin(r)", baseVars:["n1","n2","i","r"], targetPool:["n1","n2"], law:"Réfraction", image:"./images/refraction.jpg" },

  // 12. GRANDISSEMENT LENTILLE
  // { difficulty:"medium", domain:"lentilles", expr:"G = A'B' / AB", baseVars:["G","A'B'","AB"], targetPool:["G"], law:"Grandissement", image:"./images/lens.jpg" },

  // 13. BEER LAMBERT
  // { difficulty:"hard", domain:"chimie", expr:"A = epsilon l C", baseVars:["A","epsilon","l","C"], targetPool:["C"], law:"Beer-Lambert", image:"./images/spectroscopie.jpg" },

  // 14. TITRAGE
  // { difficulty:"medium", domain:"chimie", expr:"nA/a = nB/b", baseVars:["nA","nB","a","b"], targetPool:["nA","nB"], law:"Titrage", image:"./images/titrage.jpg" },

  // 15. THERMIQUE
  // { difficulty:"medium", domain:"energie", expr:"Q = m c (Tf - Ti)", baseVars:["Q","m","c","Tf","Ti"], targetPool:["m","Q"], law:"Chaleur", image:"./images/chaleur.jpg" },

  // 16. COULOMB
  // { difficulty:"medium", domain:"electricite", expr:"F = k \\frac{q1 q2}{r^2}", baseVars:["F","q1","q2","r"], targetPool:["r","q1"], law:"Coulomb", image:"./images/coulomb.jpg" },

  // 17. STATIQUE FLUIDES
  // { difficulty:"medium", domain:"fluide", expr:"P = rho g h", baseVars:["P","rho","g","h"], targetPool:["h"], law:"Hydrostatique", image:"./images/hydrostatique.jpg" },

  // 18. MARIOTTE
  // { difficulty:"medium", domain:"thermodynamique", expr:"P V = cste", baseVars:["P","V"], targetPool:["P","V"], law:"Boyle-Mariotte", image:"./images/manometre.jpg" },

  // 19. PUISSANCE
  // { difficulty:"easy", domain:"energie", expr:"P = E / t", baseVars:["P","E","t"], targetPool:["E","t"], law:"Puissance", image:"./images/puissance.jpg" },

  // 20. JOULE
  // { difficulty:"easy", domain:"electricite", expr:"E = R I^2 t", baseVars:["E","R","I","t"], targetPool:["E","R"], law:"Effet Joule", image:"./images/joule.jpg" },

  // 21. CINÉTIQUE
  // { difficulty:"easy", domain:"energie", expr:"Ec = 1/2 m v^2", baseVars:["Ec","m","v"], targetPool:["m","v"], law:"Énergie cinétique", image:"./images/energie_cinetique.jpg" },

  // 22. POTENTIEL PESANTEUR
  // { difficulty:"easy", domain:"energie", expr:"Ep = m g h", baseVars:["Ep","m","h"], targetPool:["m","h"], law:"Énergie potentielle", image:"./images/energie_pot_pes.jpg" },

  // 23. ONDE
  // { difficulty:"easy", domain:"ondes", expr:"v = lambda f", baseVars:["v","lambda","f"], targetPool:["lambda","f"], law:"Célérité onde", image:"./images/celerite.jpg" },

  // 24. PHOTON
  // { difficulty:"hard", domain:"quantique", expr:"E = h f", baseVars:["E","h","f"], targetPool:["E","f"], law:"Photon", image:"./images/energie_photon.jpg" },

  // 25. RADIOACTIVITÉ
  // { difficulty:"hard", domain:"quantique", expr:"N = N0 e^{-lambda t}", baseVars:["N","N0","t"], targetPool:["t"], law:"Radioactivité", image:"./images/radio.jpg" },

  // 26. PH
  // { difficulty:"medium", domain:"chimie", expr:"pH = -log(H+)", baseVars:["pH","H+"], targetPool:["H+"], law:"pH", image:"./images/acidite.jpg" },

  // 27. KEPLER 3
  // { difficulty:"hard", domain:"gravitation", expr:"T^2 = k R^3", baseVars:["T","R"], targetPool:["R","T"], law:"Kepler III", image:"./images/kepler.jpg" },

  // 28. BERNOULLI
  // { difficulty:"hard", domain:"fluide", expr:"P + 1/2 rho v^2 = cste", baseVars:["P","v","rho"], targetPool:["v"], law:"Bernoulli", image:"./images/bernoulli.jpg" },

  // 29. ARCHIMEDE
  // { difficulty:"medium", domain:"fluide", expr:"F = rho V g", baseVars:["F","rho","V"], targetPool:["V"], law:"Poussée Archimède", image:"./images/archimede.jpg" },

  // 30. VENTURI
  // { difficulty:"hard", domain:"fluide", expr:"v1 S1 = v2 S2", baseVars:["v1","v2","S1","S2"], targetPool:["v1","v2"], law:"Venturi", image:"./images/venturi.jpg" },

  // 31. GAZ PARFAIT
  // { difficulty:"hard", domain:"thermodynamique", expr:"PV = nRT", baseVars:["P","V","n","T"], targetPool:["n","T"], law:"Gaz parfait", image:"./images/gaz_parfait.jpg" },

  // 32. STEFAN BOLTZMANN
  // { difficulty:"hard", domain:"energie", expr:"P = sigma T^4", baseVars:["P","T"], targetPool:["T"], law:"Rayonnement", image:"./images/stefan.jpg" },

  // 33. RC
  // { difficulty:"hard", domain:"electricite", expr:"tau = R C", baseVars:["tau","R","C"], targetPool:["R","C"], law:"Circuit RC", image:"./images/rc.jpg" },

  // 34. DIFFRACTION
  // { difficulty:"hard", domain:"ondes", expr:"theta = lambda / a", baseVars:["theta","lambda","a"], targetPool:["a"], law:"Diffraction", image:"./images/diffraction.jpg" },

  // 35. INTERFÉRENCE
  // { difficulty:"hard", domain:"ondes", expr:"i = lambda D / a", baseVars:["i","lambda","D","a"], targetPool:["a"], law:"Interférences", image:"./images/interference.jpg" },

  // 36. SON
  // { difficulty:"medium", domain:"ondes", expr:"L = 10 log(I/I0)", baseVars:["L","I"], targetPool:["I"], law:"Intensité sonore", image:"./images/son.jpg" },

  // 37. ACCÉLÉRATION NORMALE
  // { difficulty:"medium", domain:"mouvement", expr:"a = v^2 / R", baseVars:["a","v","R"], targetPool:["R"], law:"Mouvement circulaire", image:"/.images/acceleration_normale.jpg" },

  // 38. CHARGE ÉLECTRIQUE
  // { difficulty:"easy", domain:"electricite", expr:"q = n e", baseVars:["q","n"], targetPool:["n"], law:"Charge électrique", image:"./images/quantite_elec.jpg" },

  // 39. LENTILLE
  // { difficulty:"hard", domain:"lentilles", expr:"1/f = 1/d0 + 1/di", baseVars:["f","d0","di"], targetPool:["d0","di"], law:"Conjugaison", image:"./images/lens1.jpg" },

  // 40. GROSSISSEMENT LUNETTE
  // { difficulty:"hard", domain:"optique", expr:"G = fo / fe", baseVars:["G","fo","fe"], targetPool:["G"], law:"Lunette astronomique", image:"./images/lunette.jpg" },

];

/* =========================
   SYMBOLES GRECS CENTRALISÉS
========================= */

/* =========================
   SYSTÈME DE SYMBOLES UNIFIÉ
========================= */

const SYMBOLS = {
  rho: "\\rho",
  alpha: "\\alpha",
  beta: "\\beta",
  gamma: "\\gamma",
  delta: "\\delta",
  lambda: "\\lambda",
  mu: "\\mu",
  sigma: "\\sigma",
  tau: "\\tau",
  phi: "\\phi",
  pi: "\\pi"
};

function toLatexSymbol(v) {
  const map = {
    rho: "\\rho",
    alpha: "\\alpha",
    beta: "\\beta",
    gamma: "\\gamma",
    delta: "\\delta",
    lambda: "\\lambda",
    mu: "\\mu",
    sigma: "\\sigma",
    tau: "\\tau",
    phi: "\\phi",
    pi: "\\pi"
  };

  return map[v] || v;
}

function toDisplayExpr(expr) {
  if (!expr) return "";

  return expr
    .replace(/rho/g, "\\rho")
    .replace(/lambda/g, "\\lambda")
    .replace(/sigma/g, "\\sigma")
    .replace(/pi/g, "\\pi")
    .replace(/tau/g, "\\tau")
    .replace(/\*/g, " \\times ")
    .replace(/\//g, " / ");
}

function toDisplayVar(v) {
  return SYMBOLS[v] || v;
}

function latexSafe(str) {
  return toLatexSafe(str);
}

/* transforme vers affichage LaTeX */
function toLatexSafe(str) {
  if (!str) return "";

  return str
    .split(/(\b[a-zA-Z]+\b)/g)
    .map(part => toLatexSymbol(part))
    .join("")
    .replace(/\*/g, " \\times ")
    .replace(/\//g, " / ")
    .replace(/\^(\d+)/g, "^{$1}")
    .replace(/sqrt\(([^)]+)\)/g, "\\sqrt{$1}");
}

/* normalisation logique (comparaison) */
function normalizeSymbol(str) {
  if (!str) return "";

  return str
    .replace(/\\rho/g, "rho")
    .replace(/\\lambda/g, "lambda")
    .replace(/\\sigma/g, "sigma")
    .replace(/\\pi/g, "pi")
    .replace(/\\tau/g, "tau")
    .replace(/\s+/g, "")
    .replace(/[{}]/g, "");
}

function toDisplayLatex(str) {
  if (!str) return "";

  return toLatexSafe(str);
}

/* =========================
   LATEX
========================= */

function toLatex(expr) {
  if (!expr) return "";
  return toLatexSafe(expr);
}

/* =========================
   PARSER
========================= */

function parseExpr(expr) {
  return expr
    .replace(/\s/g, "")

    // seulement conversion utile pour calcul
    .replace(/\\times/g, "*")

    // fraction propre
    .replace(/\\frac{([^}]*)}{([^}]*)}/g, "($1)/($2)");
}

/* =========================
   UTIL VARIABLES
========================= */

function getVars(q, target) {
  const clean = v => v.replace(/\\/g, "");
  return q.baseVars.filter(v => clean(v) !== clean(target));
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

  const clean = v => {
    if (!v) return "";

    return v
      .replace(/\\rho/g, "rho")
      .replace(/\\lambda/g, "lambda")
      .replace(/\\sigma/g, "sigma")
      .replace(/\\pi/g, "pi")
      .replace(/\\tau/g, "tau")
      .replace(/\\/g, "")
      .replace(/[(){}]/g, "")
      .replace(/\s+/g, "")
      .trim();
  };

  const e = parseExpr(q.expr);
  const partsEq = e.split("=");

  if (partsEq.length !== 2) {
    return {
      result: `${target} = ?`,
      type: "parse_error"
    };
  }

  const L = partsEq[0].trim();
  const R = partsEq[1].trim();

  const targetC = clean(target);

  // =========================
  // PRODUIT a*b
  // =========================
  if (R.includes("*") && !R.includes("/")) {

    const parts = R.split("*");

    if (parts.length === 2) {

      const a = parts[0];
      const b = parts[1];

      if (clean(a) === targetC)
        return {
          result: `${a} = \\frac{${L}}{${b}}`,
          type: "division"
        };

      if (clean(b) === targetC)
        return {
          result: `${b} = \\frac{${L}}{${a}}`,
          type: "division"
        };
    }
  }

  // =========================
  // FRACTION a/b
  // =========================
  if (R.includes("/")) {

    const parts = R.split("/");

    if (parts.length === 2) {

      const a = parts[0];
      const b = parts[1];

      if (clean(a) === targetC)
        return {
          result: `${a} = ${L} \\times ${b}`,
          type: "multiplication"
        };

      if (clean(b) === targetC)
        return {
          result: `${b} = \\frac{${a}}{${L}}`,
          type: "inverse"
        };
    }
  }

  // =========================
  // PUISSANCE
  // =========================
  const pow = R.match(/([a-zA-Z\\]+)\^(\d+)/);

  if (pow) {
    const base = pow[1];
    const n = parseInt(pow[2]);

    if (clean(base) === targetC) {

      if (n === 2)
        return {
          result: `${base} = \\sqrt{${L}}`,
          type: "sqrt"
        };

      return {
        result: `${base} = (${L})^{1/${n}}`,
        type: "root"
      };
    }
  }

  // =========================
  // RACINE
  // =========================
  const sqrt = R.match(/sqrt\(([^)]+)\)/);

  if (sqrt) {
    const inside = sqrt[1];

    if (clean(inside) === targetC) {
      return {
        result: `${inside} = (${L})^2`,
        type: "square"
      };
    }
  }

  // =========================
  // FALLBACK
  // =========================
  return {
    result: `${target} = ${L}`,
    type: "fallback"
  };
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
    📌 On part de : \\(${toDisplayExpr(q.expr)}\\)
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

  const t = target;

  const a = vars[0] || "x";
  const b = vars[1] || "y";

  const wrong = [];

  // =========================
  // Génération brute (logique pure)
  // =========================
  const candidates = [

    `${t} = ${b}/${a}`,
    `${t} = ${a}*${b}`,
    `${t} = ${a}+${b}`,

    `${a} = ${t}/${b}`,
    `${b} = ${t}/${a}`

  ];

  // =========================
  // FILTRE INTELLIGENT (clé)
  // =========================
  function isValid(expr) {

    const norm = normalizeLatex(expr);

    // 1. pas identique à la bonne réponse
    if (norm === normalizeLatex(correct)) return false;

    // 2. doit contenir une opération (évite "V = rho")
    if (!/[*/+\-]/.test(expr)) return false;

    // 3. pas de forme triviale : V = V / ...
    const left = expr.split("=")[0].trim();
    if (expr.includes(`${left}/`) || expr.includes(`${left}*`)) return false;

    // 4. éviter divisions absurdes : x/x
    const parts = expr.split(/[*/]/);
    if (parts.length === 2 && parts[0] === parts[1]) return false;

    return true;
  }

  // =========================
  // Nettoyage final
  // =========================
  candidates.forEach(c => {
    if (isValid(c)) wrong.push(c);
  });

  // fallback sécurité
  while (wrong.length < 3) {
    wrong.push(`${t} = ${a}/${b}`);
  }

  return [...new Set(wrong)].slice(0, 3);
}

/* =========================
   QUESTION GENERATION
========================= */

function normalizeLatex(str) {
  if (!str) return "";

  return str
    // LATEX → TEXTE (sans toucher aux majuscules)
    .replace(/\\rho/g, "rho")
    .replace(/\\lambda/g, "lambda")
    .replace(/\\sigma/g, "sigma")
    .replace(/\\pi/g, "pi")
    .replace(/\\tau/g, "tau")

    .replace(/\\times/g, "*")
    .replace(/\\frac{([^}]*)}{([^}]*)}/g, "($1)/($2)")
    .replace(/\\sqrt{([^}]*)}/g, "sqrt($1)")

    // ⚠️ IMPORTANT : NE PAS toucher à la casse !
    .replace(/\s+/g, "")
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

  // =========================
  // Fusion
  // =========================
  const all = [correctRaw, ...distractors];

  // =========================
  // Déduplication robuste
  // =========================
  const seen = new Set();
  let unique = [];

  all.forEach(item => {
    const norm = normalizeLatex(item);

    if (!seen.has(norm)) {
      seen.add(norm);
      unique.push(item);
    }
  });

  // =========================
  // 🔥 FILTRE ANTI-RÉPONSES DÉBILES
  // (genre V = rho)
  // =========================
  unique = unique.filter(expr => {

    const parts = expr.split("=");
    if (parts.length !== 2) return false;

    const right = parts[1];

    // doit contenir une opération
    if (!/[*/+\-]/.test(right)) return false;

    // évite V = V / ...
    const left = parts[0].trim();
    if (right.includes(left)) return false;

    return true;
  });

  // =========================
  // 🔥 GARANTIE bonne réponse
  // =========================
  if (!unique.some(c => normalizeLatex(c) === normalizeLatex(correctRaw))) {
    unique.unshift(correctRaw);
  }

  // =========================
  // Complétion si manque
  // =========================
  while (unique.length < 4) {
    unique.push(`${target} = ${vars[0] || "x"}/${vars[1] || "y"}`);
  }

  // =========================
  // Mélange
  // =========================
  const choices = unique
    .slice(0, 4)
    .sort(() => Math.random() - 0.5);

  // =========================
  // Index bonne réponse (FIABLE)
  // =========================
  const answer = choices.findIndex(
    c => normalizeLatex(c) === normalizeLatex(correctRaw)
  );

  // sécurité ultime
  const safeAnswer = answer !== -1 ? answer : 0;

  // =========================
  // Objet final
  // =========================
  currentQuestion = {
    ...q,
    target,
    choices,
    answer: safeAnswer,
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
    `D’après la relation : \\(${toDisplayExpr(q.expr)}\\)<br><br>
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

    const latex = toLatexSafe(c);

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

    ✔ Bonne réponse : \\(${toDisplayLatex(solved.result)}\\)

    🧠 Explication :<br><br>

    • Équation : \\(${toDisplayExpr(q.expr)}\\)
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

  // 🔒 Empêche de relancer pendant une partie
  if (!gameOver && current > 0) {
    console.warn("Partie déjà en cours");
    return;
  }

  clearInterval(timer);

  score = 0;
  current = 0;
  gameOver = false;
  timeLeft = 180;

  // 🔒 Désactive le bouton
  const startBtn = document.getElementById("startBtn");
  if (startBtn) startBtn.disabled = true;

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

  // 🔓 Réactive le bouton Démarrer
  const startBtn = document.getElementById("startBtn");
  if (startBtn) startBtn.disabled = false;

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
