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
  //{ difficulty: "easy", domain: "electricite", expr: "U = R*I", baseVars: ["U", "R", "I"], targetPool: ["R", "I"], law: "Loi d’Ohm", image: "./images/ohm.jpg" },

  // 2. MASSE VOLUMIQUE
  //{ difficulty:"easy", domain:"chimie", expr:"rho = m/V", baseVars:["rho", "m","V"], targetPool:["m","V"], law:"Masse volumique", image:"./images/masse_volumique.jpg" },

  // 3. DENSITÉ
  //{ difficulty:"easy", domain:"chimie", expr:"d = rho/rho0", baseVars:["d","rho","rho0"], targetPool:["rho", "rho0"], law:"Densité", image:"./images/densite.jpg" },

  // 4. CONCENTRATION MASSIQUE
  //{ difficulty:"easy", domain:"chimie", expr:"t = msolute/Vsolution", baseVars:["t","msolute","Vsolution"], targetPool:["msolute","Vsolution"], law:"Concentration massique", image:"./images/concentration_massique.jpg" },

  // 5. CONCENTRATION MOLAIRE
  //{ difficulty:"easy", domain:"chimie", expr:"C = nsolute/Vsolution", baseVars:["C","nsolute","Vsolution"], targetPool:["nsolute","Vsolution"], law:"Concentration molaire", image:"./images/concentration_molaire.jpg" },

  // 6. QUANTITÉ DE MATIÈRE
  //{ difficulty:"easy", domain:"chimie", expr:"n = m/M", baseVars:["n","m","M"], targetPool:["m","M"], law:"Quantité de matière", image:"./images/quantite_matiere.jpg" },

  // 7. DILUTION
  //{ difficulty:"medium", domain:"chimie", expr:"C1*V1 = C2*V2", baseVars:["C1","V1","C2","V2"], targetPool:["C1","C2","V1","V2"], law:"Dilution", image:"./images/dilution.jpg" },

  // 8. POIDS
  //{ difficulty:"easy", domain:"forces", expr:"P = m*g", baseVars:["P","m","g"], targetPool:["m","g"], law:"Poids", image:"./images/poids.jpg" },

  // 9. FORCE GRAVITATIONNELLE
   { difficulty:"medium", domain:"gravitation", expr:"F = G*m1*m2/r^2", baseVars:["F","G","m1","m2","r"], targetPool:["m1","m2","r"], law:"Gravitation de Newton", image:"./images/gravitation.jpg" },

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

const LATEX_SYMBOLS = {

  // Grecs
  alpha: "\\alpha",
  beta: "\\beta",
  gamma: "\\gamma",
  delta: "\\delta",
  epsilon: "\\epsilon",
  theta: "\\theta",
  lambda: "\\lambda",
  mu: "\\mu",
  pi: "\\pi",
  rho: "\\rho",
  rho0: "\\rho_0",
  sigma: "\\sigma",
  tau: "\\tau",
  phi: "\\phi",
  omega: "\\omega",

  // Variables indices
  msolute: "m_{solute}",
  nsolute: "n_{solute}",
  Vsolution: "V_{solution}",
  C1: "C_1",
  C2: "C_2",
  V1: "V_1",
  V2: "V_2",
  m1: "m_1",
  m2: "m_2"

};

/* =========================
   EXTRACTEUR DE NOMBRE DE VARIABLES
========================= */

function getDistractorVars(q, target) {

  const vars = q.baseVars.filter(v => v !== target);

  // Cas spécial 4 variables (type dilution)
  if (q.baseVars.length === 4) {
    return {
      a: q.baseVars[0],
      b: q.baseVars[1],
      c: q.baseVars[2],
      d: q.baseVars[3],
      mode: "quad"
    };
  }

  // Cas standard (2 variables utiles)
  return {
    a: vars[0] || "x",
    b: vars[1] || "y",
    mode: "simple"
  };
}

function canonicalizeProducts(expr) {

  // transforme a*b en ordre alphabétique
  return expr.replace(
    /([a-zA-Z0-9_]+)\*([a-zA-Z0-9_]+)/g,
    (_, a, b) => {
      return [a, b].sort().join("*");
    }
  );
}

function normalizeExpr(str) {

  if (!str) return "";

  let out = str;

  Object.entries(LATEX_SYMBOLS).forEach(([k,v]) => {

    const escaped = v
      .replace(/\\/g, "\\\\")
      .replace(/{/g, "\\{")
      .replace(/}/g, "\\}");

    out = out.replace(
      new RegExp(escaped, "g"),
      k
    );

  });

  out = out
    .replace(/\\times/g, "*")
    .replace(/\\frac{([^}]*)}{([^}]*)}/g, "($1)/($2)")
    .replace(/\s+/g, "")
    .replace(/[{}]/g, "")
    .trim();

  // 🔥 AJOUT IMPORTANT
  out = canonicalizeProducts(out);

  return out;
}

function normalizeLatex(str) {
  return normalizeExpr(str);
}

/* =========================
   LATEX
========================= */

function toLatex(str) {

  if (!str) return "";

  let out = str;

  // =========================
  // Symboles
  // =========================
  Object.entries(LATEX_SYMBOLS).forEach(([k, v]) => {

    const regex = new RegExp(
      `(?<![a-zA-Z0-9_])${k}(?![a-zA-Z0-9_])`,
      "g"
    );

    out = out.replace(regex, v);

  });

// =========================
// Supprime parenthèses inutiles
// ex : (a*b) -> a*b
// mais garde (a+b)
// =========================
  out = out.replace(
    /\(([a-zA-Z0-9_*\\{}]+)\)/g,
    "$1"
  );

  // =========================
  // PUISSANCES AVANT FRACTIONS
  // =========================
  out = out.replace(
    /\^([a-zA-Z0-9]+)/g,
    "^{$1}"
  );

  // =========================
  // Fractions
  // =========================
  out = out.replace(
    /([a-zA-Z0-9_\\{}()*]+)\s*\/\s*([a-zA-Z0-9_\\{}^()*]+)/g,
    "\\frac{$1}{$2}"
  );

  // =========================
  // Multiplication
  // =========================
  out = out.replace(/\*/g, " \\times ");

  // =========================
  // Fractions complexes
  // ex : (C2*V2)/V1
  // =========================

out = out.replace(
    /\(([^()]+)\)\s*\/\s*([a-zA-Z0-9_\\{}]+)/g,
    "\\frac{$1}{$2}"
  );

  // =========================
  // sqrt(x)
  // =========================
  out = out.replace(
    /sqrt\(([^)]+)\)/g,
    "\\sqrt{$1}"
  );

  return out;
}

/* =========================
   PARSER
========================= */

function parseExpr(expr) {

  return normalizeExpr(expr)
    .replace(/\\times/g, "*");

}

/* =========================
   UTIL VARIABLES
========================= */

function getVars(q, target) {
  const clean = v => v.replace(/\\/g, "");
  return q.baseVars.filter(v => clean(v) !== clean(target));
}

function generateFractions(vars) {

  const res = [];

  if (!vars || vars.length < 3) return res;

  const n = vars.length;

  for (let i = 0; i < n; i++) {

    const denom = vars[i];

    const numerators = vars.filter((_, j) => j !== i);

    for (let a = 0; a < numerators.length; a++) {
      for (let b = a + 1; b < numerators.length; b++) {

        res.push(`(${numerators[a]}*${numerators[b]})/${denom}`);

      }
    }
  }

  return res;
}

function shuffle(array) {
  const arr = [...array]; // évite de modifier l’original

  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }

  return arr;
}
function pushUnique(arr, expr) {

  const norm = normalizeLatex(expr);

  const exists = arr.some(
    e => normalizeLatex(e) === norm
  );

  if (!exists) {
    arr.push(expr);
  }
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

    return normalizeExpr(v)
      .replace(/[()]/g, "")
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
  // PRODUIT DES DEUX CÔTÉS
  // ex : C1*V1 = C2*V2
  // =========================

  if (L.includes("*") && R.includes("*")) {

    const leftParts = L.split("*").map(s => s.trim());
    const rightParts = R.split("*").map(s => s.trim());

    if (leftParts.length === 2 && rightParts.length === 2) {

      const [a, b] = leftParts;
      const [c, d] = rightParts;

      // C1
      if (clean(a) === targetC) {
        return {
          result: `${a} = (${c}*${d})/${b}`,
          type: "cross_division"
        };
      }

      // V1
      if (clean(b) === targetC) {
        return {
          result: `${b} = (${c}*${d})/${a}`,
          type: "cross_division"
        };
      }

      // C2
      if (clean(c) === targetC) {
        return {
          result: `${c} = (${a}*${b})/${d}`,
          type: "cross_division"
        };
      }

      // V2
      if (clean(d) === targetC) {
        return {
          result: `${d} = (${a}*${b})/${c}`,
          type: "cross_division"
        };
      }
    }
  }

  // =========================
  // PRODUIT SIMPLE
  // =========================

  if (R.includes("*") && !R.includes("/")) {

    const parts = R.split("*");

    if (parts.length === 2) {

      const a = parts[0].trim();
      const b = parts[1].trim();

      if (clean(a) === targetC) {

        return {
          result: `${a} = ${L}/${b}`,
          type: "division"
        };
      }

      if (clean(b) === targetC) {

        return {
          result: `${b} = ${L}/${a}`,
          type: "division"
        };
      }
    }
  }

  // =========================
  // FRACTION
  // =========================

  if (R.includes("/")) {

    const frac = R.match(/^(.+)\/(.+)$/);

    if (frac) {

      const a = frac[1].trim();
      const b = frac[2].trim();
// =========================
// CAS r^2 AU DENOMINATEUR
// =========================

const powDenom = b.match(/^([a-zA-Z0-9_\\]+)\^(\d+)$/);

if (powDenom) {

  const base = powDenom[1];
  const n = parseInt(powDenom[2]);

  if (clean(base) === targetC) {

    // r^2 = a/L
    // r = sqrt(a/L)

    if (n === 2) {

      return {
        result: `${base} = sqrt(${a}/${L})`,
        type: "sqrt_fraction"
      };
    }

    return {
      result: `${base} = (${a}/${L})^(1/${n})`,
      type: "root_fraction"
    };
  }
}
      if (clean(a) === targetC) {

        return {
          result: `${a} = ${L}*${b}`,
          type: "multiplication"
        };
      }

      if (clean(b) === targetC) {

        return {
          result: `${b} = ${a}/${L}`,
          type: "inverse"
        };
      }
    }
  }

  // =========================
  // PUISSANCE
  // =========================

  const pow = R.match(/([a-zA-Z0-9_\\]+)\^(\d+)/);

  if (pow) {

    const base = pow[1];
    const n = parseInt(pow[2]);

    if (clean(base) === targetC) {

      if (n === 2) {

        return {
          result: `${base} = sqrt(${L})`,
          type: "sqrt"
        };
      }

      return {
        result: `${base} = (${L})^(1/${n})`,
        type: "root"
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
    sqrt: "On élève au carré",
    root: "On applique une racine",
    cross_division: "On effectue un produit en croix puis on divise",
    fallback: "Réarrangement algébrique"
  };

  return `
    🧠 Méthode : ${map[type] || "Étape algébrique"}<br>
    📌 On part de : \\(${toLatex(q.expr)}\\)<br>
    🎯 Variable isolée : \\(${toLatex(target)}\\)
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

  const v = getDistractorVars(q, target);

  const wrong = [];

  let candidates = [];

  // =========================
  // MODE QUAD
  // =========================
  if (v.mode === "quad") {

    const fractions = generateFractions(
      q.baseVars.filter(x => x !== target)
    ) || [];

    if (!fractions.length) {

      candidates = [
        `${t} = x/y`,
        `${t} = x-y`,
        `${t} = x*y`,
        `${t} = y/x`,
        `${t} = y-x`
      ];

    } else {

      const shuffled = shuffle(fractions);

      candidates = shuffled
        .slice(0, 6)
        .map(f => `${t} = ${f}`);
    }

  }
  // =========================
  // MODE SIMPLE
  // =========================
  else {

    const { a = "x", b = "y" } = v;

    const pool = [

      `${t} = ${b}/${a}`,
      `${t} = ${a}/${b}`,
      `${t} = ${a}*${b}`,
      `${t} = ${b}*${a}`,

      `${t} = ${a}+${b}`,
      `${t} = ${a}-${b}`

    ];

    candidates = shuffle(pool).slice(0, 5);
  }

  // =========================
  // VALIDATION
  // =========================
  function isValid(expr) {

    const normExpr = normalizeLatex(expr);
    const normCorrect = normalizeLatex(correct);
    const normOriginal = normalizeLatex(q.expr);

    // 1. pas identique bonne réponse
    if (normExpr === normCorrect) return false;

    // 2. doit contenir une opération
    if (!/[*/+\-]/.test(expr)) return false;

    const eq = expr.split("=");

    if (eq.length !== 2) return false;

    const left = eq[0].trim();
    const right = eq[1].trim();

    // 3. côté gauche doit être target
    if (normalizeLatex(left) !== normalizeLatex(target)) {
      return false;
    }

    // 4. éviter réutilisation directe target
    if (normalizeLatex(right).includes(normalizeLatex(target))) {
      return false;
    }

    // 5. éviter formule originale
    if (normExpr === normOriginal) return false;

    // 6. inversion inutile
    const originalEq = q.expr.split("=");

    if (originalEq.length === 2) {

      const originalRight = normalizeLatex(originalEq[1]);

      const reversed = originalRight
        .split("/")
        .reverse()
        .join("/");

      if (normalizeLatex(right) === reversed) {
        return false;
      }
    }

    // 7. éviter x/x
    const parts = right.split(/[*/]/);

    if (
      parts.length === 2 &&
      normalizeLatex(parts[0]) === normalizeLatex(parts[1])
    ) {
      return false;
    }

    return true;
  }

  // =========================
  // FILTRAGE
  // =========================
  candidates.forEach(c => {

    try {
      if (c && isValid(c)) {
        wrong.push(c);
      }
    } catch (e) {
      // sécurité anti crash silencieux
      console.warn("Distracteur invalide ignoré:", c);
    }

  });

  // =========================
  // FALLBACK
  // =========================
  let fallbackIndex = 0;

  while (wrong.length < 3) {

    const { a = "x", b = "y" } = v;

    const fallback = [
      `${t} = ${a}+${b}`,
      `${t} = ${a}-${b}`,
      `${t} = ${a}*${b}`,
      `${t} = ${a}/${b}`
    ][fallbackIndex % 4];

    if (
      fallback &&
      isValid(fallback) &&
      !wrong.includes(fallback)
    ) {
      wrong.push(fallback);
    }

    fallbackIndex++;

    if (fallbackIndex > 20) break;
  }

  // =========================
  // RETURN FINAL
  // =========================
  return [...new Set(wrong)].slice(0, 3);
}

/* =========================
   QUESTION GENERATION
========================= */

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
const all = [];

pushUnique(all, correctRaw);

distractors.forEach(d => {
  pushUnique(all, d);
});

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
const fallbackPool = [
  `${target} = ${vars[0] || "x"}/${vars[1] || "y"}`,
  `${target} = ${vars[1] || "y"}/${vars[0] || "x"}`,
  `${target} = ${vars[0] || "x"}*${vars[1] || "y"}`,
  `${target} = ${vars[0] || "x"}+${vars[1] || "y"}`
];

let idx = 0;

while (unique.length < 4 && idx < fallbackPool.length) {

  pushUnique(unique, fallbackPool[idx]);

  idx++;
}
  // =========================
  // Mélange
  // =========================
  const choices = shuffle(unique.slice(0, 4));
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
  `
  D’après la relation : \\(${toLatex(q.expr)}\\)
  <br><br>
  Donner la bonne expression pour la variable
  <b>\\(${toLatex(q.target)}\\)</b>
  `;

  renderChoices(q);

  // =========================
  // FEEDBACK RESET
  // =========================
  const fb = document.getElementById("feedback");
  if (fb) fb.innerHTML = "";

  // =========================
  // BOX GAUCHE
  // =========================
  const dom = document.getElementById("imageDomain");
  const law = document.getElementById("imageTitle");

  if (dom) dom.innerHTML = formatDomain(q?.domain || "");
  if (law) law.innerHTML = q?.law ? `🔬 ${q.law}` : "";

  // =========================
  // IMAGE
  // =========================
  showImage(q);

  // =========================
  // MATHJAX
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

  // =========================
  // Explication intelligente
  // =========================

  let explanation = "";

  switch (solved.type) {

    case "division":

      explanation = `
      👉 La variable <b>\\(${toLatex(q.target)}\\)</b> est multipliée par une autre grandeur.<br>
      Pour l’isoler, on doit donc <b>diviser</b> ce qu'il y a écrit à gauche du signe = par cette autre grandeur.
      `;
      break;

    case "multiplication":

      explanation = `
      👉 La variable <b>\\(${toLatex(q.target)}\\)</b> se trouve au numérateur d'une fraction.<br>
      Pour l’isoler, on doit donc <b>multiplier</b> ce qu'il y a écrit à gauche du signe = avec le dénominateur de la fraction.
      `;
      break;

    case "inverse":

      explanation = `
      👉 La variable <b>\\(${toLatex(q.target)}\\)</b> est au dénominateur.<br>
      Pour l'isoler, on l'intervertit avec la variable à gauche du signe = sans toucher au numérateur de la fraction.
      `;
      break;

    case "sqrt":

      explanation = `
      👉 La variable <b>\\(${toLatex(q.target)}\\)</b> apparaît au carré.<br>
      Pour l’isoler, on applique une <b>racine carrée</b>.
      `;
      break;

    case "root":

      explanation = `
      👉 La variable <b>\\(${toLatex(q.target)}\\)</b> est élevée à une puissance.<br>
      On applique donc la <b>racine correspondante</b>.
      `;
      break;

    case "cross_division":

      explanation = `
      👉 La variable <b>\\(${toLatex(q.target)}\\)</b> apparaît dans un produit.<br>
      On effectue donc un <b>produit en croix</b>, puis on divise par la grandeur qui multiplie la variable recherchée.
      `;
      break;

    case "sqrt_fraction":

      explanation = `
      👉 La variable <b>\\(${toLatex(q.target)}\\)</b> est au dénominateur ET au carré.<br>
      On inverse d'abord la fraction puis on applique une <b>racine carrée</b>.
      `;
      break;

    case "root_fraction":

      explanation = `
     👉 La variable <b>\\(${toLatex(q.target)}\\)</b> est dans une puissance au dénominateur.<br>
     On inverse la fraction puis on applique la racine correspondante.
     `;
     break;

    default:

      explanation = `
      👉 On réorganise l’équation afin d’isoler la variable
      <b>\\(${toLatex(q.target)}\\)</b>.
      `;
  }

  // =========================
  // AFFICHAGE
  // =========================

  fb.innerHTML = `

    ❌ <b>Mauvaise réponse</b><br><br>

    Regardons ensemble la démarche 👇<br><br>

    🧠 À partir de l’expression :<br><br>

    \\[
      ${toLatex(q.expr)}
    \\]

    On cherche à isoler la variable :

    <b>\\(${toLatex(q.target)}\\)</b><br><br>

    ${explanation}

    <br><br>

    ✔ <b>Bonne réponse :</b><br><br>

    \\[
      ${toLatex(solved.result)}
    \\]

  `;

  // =========================
  // MATHJAX
  // =========================

  if (window.MathJax) {

    setTimeout(() => {

      if (MathJax.typesetPromise) {
        MathJax.typesetPromise();
      } else {
        MathJax.typeset();
      }

    }, 0);
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
