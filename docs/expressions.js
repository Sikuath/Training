/* =========================================================
   PHYSICS TRAINER - MOTEUR ALGÉBRIQUE PAR FAMILLES
   VERSION REFAITE COMPLÈTEMENT
========================================================= */

/* =========================================================
   GLOBAL
========================================================= */

let score = 0;
let current = 0;

let timeLeft = 180;
let timer = null;

let gameOver = false;

let currentQuestion = null;

/* =========================================================
   TYPES D'EXPRESSIONS
========================================================= */

const EXPRESSION_TYPES = {

  PRODUCT:
    "product",

  FRACTION:
    "fraction",

  PRODUCT_FRACTION:
    "product_fraction",

  CROSS:
    "cross",

  POWER:
    "power",

  PRODUCT_POWER:
    "product_power",

  SUM:
    "sum",

  LOG:
    "log",

  EXP:
    "exp",

  RECIPROCAL_SUM:
    "reciprocal_sum"

};
const TYPE_ENGINE = {

  product: {
    solve: solveProduct,
    distractors: productDistractors
  },

  fraction: {
    solve: solveFraction,
    distractors: fractionDistractors
  },

  cross: {
    solve: solveCross,
    distractors: crossDistractors
  },

  product_fraction: {
    solve: solveProductFraction,
    distractors: productFractionDistractors
  },

  power: {
    solve: solvePower,
    distractors: powerDistractors
  },

  log: {
    solve: solveLog,
    distractors: logDistractors
  },

  exp: {
    solve: solveExp,
    distractors: logDistractors
  },

  sum: {
    solve: solveSum,
    distractors: genericDistractors
  },

  reciprocal_sum: {
    solve: solveReciprocal,
    distractors: genericDistractors
  }
};

const NORMALIZERS = {

  product: normalizeProduct,
  fraction: normalizeFraction,
  cross: normalizeCross,
  product_fraction: normalizeProductFraction,
  power: normalizePower,
  log: normalizeLog,
  exp: normalizeExp,
  sum: normalizeSum,
  reciprocal_sum: normalizeReciprocal
};

/* =========================================================
   SOLVER PAR TYPE
========================================================= */

function solveProduct(q, target) {

  const others =
    q.factors.filter(f => f !== target);

  if (q.factors.includes(target)) {

    const denom =
      others.length > 1
        ? `(${others.join("*")})`
        : others[0];

    return {
      result: `${target} = ${q.lhs}/${denom}`,
      type: "division"
    };
  }

  return {
    result: `${target} = ?`,
    type: "fallback"
  };
}
function solveFraction(q, target) {

  // NUMÉRATEUR
  if (target === q.numerator) {

    return {
      result: `${target} = ${q.lhs}*${q.denominator}`,
      type: "multiply_fraction"
    };
  }

  // DÉNOMINATEUR
  if (target === q.denominator) {

    return {
      result: `${target} = ${q.numerator}/${q.lhs}`,
      type: "inverse_fraction"
    };
  }

  return {
    result: `${target} = ?`,
    type: "fallback"
  };
}
function solveCross(q, target) {

  const left = q.left;
  const right = q.right;

  const isLeft = left.includes(target);

  const numSide = isLeft ? right : left;
  const denomSide = isLeft ? left : right;

  const numerator = numSide.join("*");

  const denominator =
    denomSide.length > 2
      ? `(${denomSide.filter(x => x !== target).join("*")})`
      : denomSide.filter(x => x !== target).join("*");

  return {
    result: `${target} = ${numerator}/${denominator}`,
    type: "cross"
  };
}
function solveProductFraction(q, target) {

  const num = q.numerator.join("*");
  const lhs = q.lhs;

  // CAS 1 : variable dans numérateur
  if (Array.isArray(q.numerator) && q.numerator.includes(target)) {

    const others =
      q.numerator.filter(x => x !== target);

    const numOther =
      others.length ? others.join("*") : "1";

    const denom =
      q.denominatorPower
        ? `(${q.denominator}^${q.denominatorPower})`
        : `(${q.denominator})`;

    return {
      result: `${target} = (${lhs}*${denom})/(${numOther})`,
      type: "fraction_product"
    };
  }

  // CAS 2 : dénominateur
  if (target === q.denominator) {

    const inside = `(${num})/${lhs}`;

    if (q.denominatorPower === 2) {

      return {
        result: `${target} = sqrt(${inside})`,
        type: "sqrt_fraction"
      };
    }

    return {
      result: `${target} = ${inside}`,
      type: "inverse_fraction"
    };
  }

  return {
    result: `${target} = ?`,
    type: "fallback"
  };
}
function solvePower(q, target) {

  // variable principale (ex: T dans Kepler)
  if (target === q.variable) {

    return {
      result: `${target} = (${q.lhs}/${q.coefficient})^(1/${q.power})`,
      type: "root"
    };
  }

  // variable droite (ex: R)
  if (target === q.rightVar) {

    return {
      result: `${target} = (${q.leftVar}^${q.leftPower}/${q.coefficient})^(1/${q.rightPower})`,
      type: "root"
    };
  }

  // variable gauche
  if (target === q.leftVar) {

    return {
      result: `${target} = sqrt(${q.coefficient}*${q.rightVar}^${q.rightPower})`,
      type: "sqrt"
    };
  }

  return {
    result: `${target} = ?`,
    type: "fallback"
  };
}
function solveLog(q, target) {

  if (target === "H+") {

    return {
      result: "H+ = 10^(-pH)",
      type: "log"
    };
  }

  if (target === "I") {

    return {
      result: "I = I0*10^(L/10)",
      type: "log"
    };
  }

  return {
    result: `${target} = ?`,
    type: "fallback"
  };
}
function solveExp(q, target) {

  if (target === "t") {

    return {
      result: "t = -ln(N/N0)/lambda",
      type: "exp"
    };
  }

  return {
    result: `${target} = ?`,
    type: "fallback"
  };
}
function solveSum(q, target) {

  return {
    result: q.targetFormula || `${target} = ?`,
    type: "sum"
  };
}
function solveReciprocal(q, target) {

  return {
    result: "f = 1/(1/d0 + 1/di)",
    type: "reciprocal"
  };
}

/* =========================================================
   DISTRACTORS - BASE
========================================================= */

function genericDistractors(q, target, correct = "", type = "", answer = "") {

  const pool = q.targetPool || [];

  const fake = [];

  for (let i = 0; i < pool.length; i++) {

    if (pool[i] !== target) {

      fake.push(`${pool[i]} = ?`);
    }
  }

  while (fake.length < 3) {
    fake.push(`${target} = ?`);
  }

  return fake.slice(0, 3);
}

/* =========================================================
   PRODUCT
========================================================= */

function productDistractors(q, target, correct) {

  return buildCleanDistractors(
    q,
    [
      `${q.lhs}/${target}`,
      `${q.lhs}*${target}`,
      `${target}=${q.lhs}`
    ],
    correct,
    target
  );
}

/* =========================================================
   FRACTION
========================================================= */

function fractionDistractors(q, target, correct) {

  return buildCleanDistractors(
    q,
    [
      `${q.numerator}/${q.denominator}`,
      `${q.lhs}*${q.denominator}`,
      `${q.numerator}*${q.lhs}`
    ],
    correct,
    target
  );
}

/* =========================================================
   CROSS PRODUCT
========================================================= */

function crossDistractors(q, target, correct) {

  return buildCleanDistractors(
    q,
    [
      `${q.right.join("*")}/${q.left.join("*")}`,
      `${q.left.join("*")}/${q.right.join("*")}`,
      `${q.lhs}/(${target})`
    ],
    correct,
    target
  );
}

/* =========================================================
   PRODUCT FRACTION
========================================================= */

function productFractionDistractors(q, target, correct) {

  return buildCleanDistractors(
    q,
    [
      `${q.lhs}*${q.denominator}`,
      `${q.numerator.join("*")}/${q.lhs}`,
      `${q.lhs}/${q.numerator?.[0] || target}`
    ],
    correct,
    target
  );
}

/* =========================================================
   POWER
========================================================= */

function powerDistractors(q, target, correct) {

  return buildCleanDistractors(
    q,
    [
      `${q.lhs}^(1/${q.power || 2})`,
      `${q.lhs}/${target}`,
      `${target}^2`
    ],
    correct,
    target
  );
}

/* =========================================================
   LOG
========================================================= */

function logDistractors(q, target, correct) {

  return buildCleanDistractors(
    q,
    [
      `10^(-${target})`,
      `log(${target})`,
      `${target}^10`
    ],
    correct,
    target
  );
}

/* =========================================================
   BASE DE DONNÉES
========================================================= */

const QUESTIONS = [

//{ difficulty:"easy", domain:"electricite", law:"Loi d’Ohm", image:"./images/ohm.jpg", expr:"U = R*I", type:EXPRESSION_TYPES.PRODUCT, lhs:"U", factors:["R","I"], baseVars:["U","R","I"], targetPool:["R","I"] },

// 2
//{ difficulty:"easy", domain:"chimie", law:"Masse volumique", image:"./images/masse_volumique.jpg", expr:"rho = m/V", type:EXPRESSION_TYPES.FRACTION, lhs:"rho", numerator:"m", denominator:"V", baseVars:["rho","m","V"], targetPool:["m","V"] },

// 3
//{ difficulty:"easy", domain:"chimie", law:"Densité", image:"./images/densite.jpg", expr:"d = rho/rho0", type:EXPRESSION_TYPES.FRACTION, lhs:"d", numerator:"rho", denominator:"rho0", baseVars:["d","rho","rho0"], targetPool:["rho","rho0"] },

// 4
//{ difficulty:"easy", domain:"chimie", law:"Concentration massique", image:"./images/concentration_massique.jpg", expr:"t = msolute/Vsolution", type:EXPRESSION_TYPES.FRACTION, lhs:"t", numerator:"msolute", denominator:"Vsolution", baseVars:["t","msolute","Vsolution"], targetPool:["msolute","Vsolution"] },

// 5
//{ difficulty:"easy", domain:"chimie", law:"Concentration molaire", image:"./images/concentration_molaire.jpg", expr:"C = nsolute/Vsolution", type:EXPRESSION_TYPES.FRACTION, lhs:"C", numerator:"nsolute", denominator:"Vsolution", baseVars:["C","nsolute","Vsolution"], targetPool:["nsolute","Vsolution"] },

// 6
//{ difficulty:"easy", domain:"chimie", law:"Quantité de matière", image:"./images/quantite_matiere.jpg", expr:"n = m/M", type:EXPRESSION_TYPES.FRACTION, lhs:"n", numerator:"m", denominator:"M", baseVars:["n","m","M"], targetPool:["m","M"] },

// 7
//{ difficulty:"medium", domain:"chimie", law:"Dilution", image:"./images/dilution.jpg", expr:"C1*V1 = C2*V2", type:EXPRESSION_TYPES.CROSS, left:["C1","V1"], right:["C2","V2"], baseVars:["C1","V1","C2","V2"], targetPool:["C1","V1","C2","V2"] },

// 8
//{ difficulty:"easy", domain:"forces", law:"Poids", image:"./images/poids.jpg", expr:"P = m*g", type:EXPRESSION_TYPES.PRODUCT, lhs:"P", factors:["m","g"], baseVars:["P","m","g"], targetPool:["m","g"] },

// 9
{ difficulty:"medium", domain:"gravitation", law:"Gravitation de Newton", image:"./images/gravitation.jpg", expr:"F = G*m1*m2/r^2", type:EXPRESSION_TYPES.PRODUCT_FRACTION, lhs:"F", numerator:["G","m1","m2"], denominator:"r", denominatorPower:2, baseVars:["F","G","m1","m2","r"], targetPool:["m1","m2","r"] },

// 10
//{ difficulty:"hard", domain:"ondes", law:"Effet Doppler", image:"./images/doppler.jpg", expr:"f' = f*(v+vr)/(v+vs)", type:EXPRESSION_TYPES.PRODUCT_FRACTION, lhs:"f'", numerator:["f","(v+vr)"], denominator:"(v+vs)", baseVars:["f'","f","v","vr","vs"], targetPool:["f"] },

// 11
//{ difficulty:"medium", domain:"ondes", law:"Réfraction", image:"./images/refraction.jpg", expr:"n1*sin(i) = n2*sin(r)", type:EXPRESSION_TYPES.CROSS, left:["n1","sin(i)"], right:["n2","sin(r)"], baseVars:["n1","n2","sin(i)","sin(r)"], targetPool:["n2","sin(i)","sin(r)"] },

// 12
//{ difficulty:"medium", domain:"lentilles", law:"Grandissement", image:"./images/lens.jpg", expr:"G = A1B1/AB", type:EXPRESSION_TYPES.FRACTION, lhs:"G", numerator:"A1B1", denominator:"AB", baseVars:["G","A1B1","AB"], targetPool:["A1B1","AB"] },

// 13
//{ difficulty:"hard", domain:"chimie", law:"Beer-Lambert", image:"./images/spectroscopie.jpg", expr:"A = epsilon*l*C", type:EXPRESSION_TYPES.PRODUCT, lhs:"A", factors:["epsilon","l","C"], baseVars:["A","epsilon","l","C"], targetPool:["C"] },

// 14
//{ difficulty:"medium", domain:"chimie", law:"Titrage", image:"./images/titrage.jpg", expr:"nA/a = nB/b", type:EXPRESSION_TYPES.CROSS, left:["nA","b"], right:["nB","a"], baseVars:["nA","nB","a","b"], targetPool:["nA","nB"] },

// 15
//{ difficulty:"medium", domain:"energie", law:"Chaleur", image:"./images/chaleur.jpg", expr:"Q = m*c*(Tf-Ti)", type:EXPRESSION_TYPES.PRODUCT, lhs:"Q", factors:["m","c","(Tf-Ti)"], baseVars:["Q","m","c","Tf","Ti"], targetPool:["m"] },

// 16
//{ difficulty:"medium", domain:"electricite", law:"Coulomb", image:"./images/coulomb.jpg", expr:"F = k*q1*q2/r^2", type:EXPRESSION_TYPES.PRODUCT_FRACTION, lhs:"F", numerator:["k","q1","q2"], denominator:"r", denominatorPower:2, baseVars:["F","k","q1","q2","r"], targetPool:["r","q1","q2"] },

// 17
//{ difficulty:"medium", domain:"fluide", law:"Hydrostatique", image:"./images/hydrostatique.jpg", expr:"P = rho*g*h", type:EXPRESSION_TYPES.PRODUCT, lhs:"P", factors:["rho","g","h"], baseVars:["P","rho","g","h"], targetPool:["h","rho"] },

// 18
//{ difficulty:"medium", domain:"thermodynamique", law:"Boyle-Mariotte", image:"./images/manometre.jpg", expr:"P*V = k", type:EXPRESSION_TYPES.CROSS, left:["P","V"], right:["k","1"], baseVars:["P","V","k"], targetPool:["P","V"] },

// 19
//{ difficulty:"easy", domain:"energie", law:"Puissance", image:"./images/puissance.jpg", expr:"P = E/deltat", type:EXPRESSION_TYPES.FRACTION, lhs:"P", numerator:"E", denominator:"deltat", baseVars:["P","E","deltat"], targetPool:["E","deltat"] },

// 20
//{ difficulty:"easy", domain:"electricite", law:"Effet Joule", image:"./images/joule.jpg", expr:"E = R*I^2*deltat", type:EXPRESSION_TYPES.PRODUCT_POWER, lhs:"E", factors:["R","deltat"], poweredVar:"I", power:2, baseVars:["E","R","I","deltat"], targetPool:["R","I","deltat"] },

// 21
//{ difficulty:"easy", domain:"energie", law:"Énergie cinétique", image:"./images/energie_cinetique.jpg", expr:"Ec = 1/2*m*v^2", type:EXPRESSION_TYPES.PRODUCT_POWER, lhs:"Ec", constant:"1/2", factors:["m"], poweredVar:"v", power:2, baseVars:["Ec","m","v"], targetPool:["m","v"] },

// 22
//{ difficulty:"easy", domain:"energie", law:"Énergie potentielle", image:"./images/energie_pot_pes.jpg", expr:"Ep = m*g*h", type:EXPRESSION_TYPES.PRODUCT, lhs:"Ep", factors:["m","g","h"], baseVars:["Ep","m","g","h"], targetPool:["m","h"] },

// 23
//{ difficulty:"easy", domain:"ondes", law:"Célérité onde", image:"./images/celerite.jpg", expr:"v = lambda*f", type:EXPRESSION_TYPES.PRODUCT, lhs:"v", factors:["lambda","f"], baseVars:["v","lambda","f"], targetPool:["lambda","f"] },

// 24
//{ difficulty:"hard", domain:"quantique", law:"Photon", image:"./images/energie_photon.jpg", expr:"E = h*f", type:EXPRESSION_TYPES.PRODUCT, lhs:"E", factors:["h","f"], baseVars:["E","h","f"], targetPool:["f"] },

// 25
//{ difficulty:"hard", domain:"quantique", law:"Radioactivité", image:"./images/radio.jpg", expr:"N = N0*e^(-lambda*t)", type:EXPRESSION_TYPES.EXP, lhs:"N", base:"N0", exponent:"(-lambda*t)", baseVars:["N","N0","lambda","t"], targetPool:["t"] },

// 26
//{ difficulty:"medium", domain:"chimie", law:"pH", image:"./images/acidite.jpg", expr:"pH = -log(H+)", type:EXPRESSION_TYPES.LOG, lhs:"pH", variable:"H+", baseVars:["pH","H+"], targetPool:["H+"] },

// 27
//{ difficulty:"hard", domain:"gravitation", law:"Kepler III", image:"./images/kepler.jpg", expr:"T^2 = k*R^3", type:EXPRESSION_TYPES.POWER, leftVar:"T", leftPower:2, coefficient:"k", rightVar:"R", rightPower:3, baseVars:["T","R","k"], targetPool:["R","T"] },

// 28
//{ difficulty:"hard", domain:"fluide", law:"Bernoulli", image:"./images/bernoulli.jpg", expr:"P + 1/2*rho*v^2 = k", type:EXPRESSION_TYPES.SUM, targetFormula:"v = sqrt((2*(k-P))/rho)", baseVars:["P","rho","v","k"], targetPool:["v"] },

// 29
//{ difficulty:"medium", domain:"fluide", law:"Poussée Archimède", image:"./images/archimede.jpg", expr:"Pa = rho*V*g", type:EXPRESSION_TYPES.PRODUCT, lhs:"Pa", factors:["rho","V","g"], baseVars:["Pa","rho","V","g"], targetPool:["rho","V"] },

// 30
//{ difficulty:"hard", domain:"fluide", law:"Venturi", image:"./images/venturi.jpg", expr:"v1*S1 = v2*S2", type:EXPRESSION_TYPES.CROSS, left:["v1","S1"], right:["v2","S2"], baseVars:["v1","v2","S1","S2"], targetPool:["v1","v2","S1","S2"] },

// 31
//{ difficulty:"hard", domain:"thermodynamique", law:"Gaz parfait", image:"./images/gaz_parfait.jpg", expr:"P*V = n*R*T", type:EXPRESSION_TYPES.CROSS, left:["P","V"], right:["n","R*T"], baseVars:["P","V","n","R","T"], targetPool:["P","V","n","T"] },

// 32
//{ difficulty:"hard", domain:"energie", law:"Rayonnement", image:"./images/stefan.jpg", expr:"P = sigma*T^4", type:EXPRESSION_TYPES.POWER, lhs:"P", coefficient:"sigma", variable:"T", power:4, baseVars:["P","sigma","T"], targetPool:["T"] },

// 33
//{ difficulty:"hard", domain:"electricite", law:"Circuit RC", image:"./images/rc.jpg", expr:"tau = R*C", type:EXPRESSION_TYPES.PRODUCT, lhs:"tau", factors:["R","C"], baseVars:["tau","R","C"], targetPool:["R","C"] },

// 34
//{ difficulty:"hard", domain:"ondes", law:"Diffraction", image:"./images/diffraction.jpg", expr:"theta = lambda/a", type:EXPRESSION_TYPES.FRACTION, lhs:"theta", numerator:"lambda", denominator:"a", baseVars:["theta","lambda","a"], targetPool:["lambda","a"] },

// 35
//{ difficulty:"hard", domain:"ondes", law:"Interférences", image:"./images/interference.jpg", expr:"i = lambda*D/b", type:EXPRESSION_TYPES.PRODUCT_FRACTION, lhs:"i", numerator:["lambda","D"], denominator:"b", baseVars:["i","lambda","D","b"], targetPool:["lambda","D","b"] },

// 36
//{ difficulty:"medium", domain:"ondes", law:"Intensité sonore", image:"./images/son.jpg", expr:"L = 10*log(I/I0)", type:EXPRESSION_TYPES.LOG, lhs:"L", variable:"I", baseVars:["L","I","I0"], targetPool:["I"] },

// 37
//{ difficulty:"medium", domain:"mouvement", law:"Mouvement circulaire", image:"./images/acceleration_normale.jpg", expr:"a = v^2/R", type:EXPRESSION_TYPES.PRODUCT_FRACTION, lhs:"a", numerator:["v"], numeratorPower:2, denominator:"R", baseVars:["a","v","R"], targetPool:["v","R"] },

// 38
//{ difficulty:"easy", domain:"electricite", law:"Charge électrique", image:"./images/quantite_elec.jpg", expr:"q = n*e", type:EXPRESSION_TYPES.PRODUCT, lhs:"q", factors:["n","e"], baseVars:["q","n","e"], targetPool:["n","e"] },

// 39
//{ difficulty:"hard", domain:"lentilles", law:"Conjugaison", image:"./images/lens1.jpg", expr:"1/f = 1/d0 + 1/di", type:EXPRESSION_TYPES.RECIPROCAL_SUM, baseVars:["f","d0","di"], targetPool:["f"] },

// 40
//{ difficulty:"hard", domain:"optique", law:"Lunette astronomique", image:"./images/lunette.jpg", expr:"G = fo/fe", type:EXPRESSION_TYPES.FRACTION, lhs:"G", numerator:"fo", denominator:"fe", baseVars:["G","fo","fe"], targetPool:["fo","fe"]}


];

/* =========================================================
   DISPLAY
========================================================= */

function displayExpr(expr) {

  if (!expr) return "";

  let e = expr;

  // enlève parenthèses inutiles autour de simples variables
  e = e.replace(/\(([^()+\-*/]+)\)/g, "$1");

  // nettoyage espaces
  e = e.replace(/\s+/g, "");

  return e;
}

/* =========================================================
   COMPARAISON
========================================================= */

function isEqual(a, b, type) {
  return normalize(a, type) === normalize(b, type);
}

/* =========================================================
   CLEAN
========================================================= */

function cleanExpr(expr) {
  if (!expr) return "";
  return expr.replace(/\s+/g, "").trim();
}

/* =========================================================
   NORMALIZE
========================================================= */

function normalize(expr, type) {

  if (!expr) return "";

  let e = expr.replace(/\s+/g, "");

  // ----------------------------
  // BASE COMMUNE
  // ----------------------------

  const sortProduct = (str) =>
    str
      .split("*")
      .filter(Boolean)
      .sort()
      .join("*");

  // ----------------------------
  // CAS FRACTIONS (CRITIQUE)
  // ----------------------------

  if (
    type === "fraction" ||
    type === "product_fraction" ||
    type === "reciprocal_sum"
  ) {

    e = e.replace(/\(([^()]+)\)/g, "$1");

    return e.replace(
      /([^/]+)\/([^/]+)/g,
      (_, a, b) => {
        const num = sortProduct(a);
        const den = sortProduct(b);
        return `${num}/${den}`;
      }
    );
  }

  // ----------------------------
  // CAS PRODUITS ET SIMILAIRES
  // ----------------------------

  if (
    type === "product" ||
    type === "cross" ||
    type === "power" ||
    type === "exp" ||
    type === "log" ||
    type === "sum"
  ) {

    e = e.replace(/\(([^()]+)\)/g, "$1");

    return sortProduct(e);
  }

  return e;
}

function normalizeProductFraction(expr) {

  if (!expr) return "";

  let e = cleanExpr(expr);

  // enlève parenthèses inutiles
  e = e.replace(/\(([^()]+)\)/g, "$1");

  // normalisation fraction
  const sortProduct = (str) =>
    str
      .split("*")
      .filter(Boolean)
      .sort()
      .join("*");

  e = e.replace(
    /([^/]+)\/([^/]+)/g,
    (_, a, b) => {
      return `${sortProduct(a)}/${sortProduct(b)}`;
    }
  );

  return e;
}
function normalizeProduct(expr) {

  if (!expr) return "";

  return expr
    .replace(/\s+/g, "")
    .split("*")
    .filter(Boolean)
    .sort()
    .join("*");
}
function normalizeFraction(expr) {

  if (!expr) return "";

  const sortProduct = (str) =>
    str
      .split("*")
      .filter(Boolean)
      .sort()
      .join("*");

  return expr
    .replace(/\s+/g, "")
    .replace(/([^/]+)\/([^/]+)/g, (_, a, b) =>
      `${sortProduct(a)}/${sortProduct(b)}`
    );
}
function normalizeCross(expr) {

  if (!expr) return "";

  return expr
    .replace(/\s+/g, "")
    .split("*")
    .filter(Boolean)
    .sort()
    .join("*");
}
function normalizePower(expr) {

  if (!expr) return "";

  return expr
    .replace(/\s+/g, "")
    .replace(/\(([^()]+)\)/g, "$1");
}
function normalizeLog(expr) {
  return cleanExpr(expr);
}
function normalizeExp(expr) {
  return cleanExpr(expr);
}
function normalizeSum(expr) {
  return cleanExpr(expr);
}
function normalizeReciprocal(expr) {

  if (!expr) return "";

  return expr
    .replace(/\s+/g, "")
    .replace(/1\//g, "")
    .replace(/\(([^()]+)\)/g, "$1");
}

/* =========================================================
   EXPRESSION BUILDER (SAFE FRACTIONS)
========================================================= */

function wrap(expr) {
  if (!expr) return "";
  return `(${expr})`;
}

function isSimple(expr) {
  return /^[a-zA-Z0-9_]+$/.test(expr);
}

function makeFraction(num, den) {

  const n = isSimple(num) ? num : wrap(num);
  const d = (/[+*\-]/.test(den)) ? wrap(den) : den;

  return `${n}/${d}`;
}

function makeProduct(...terms) {

  return terms
    .filter(Boolean)
    .map(t => {

      // parenthèses UNIQUEMENT
      // si somme ou différence

      if (/[+\-]/.test(t))
        return `(${t})`;

      return t;
    })
    .join("*");
}

/* =========================================================
   LATEX
========================================================= */

function toLatex(str) {

  if (!str) return "";

  let out = str;

  /* =========================================================
     SYMBOLS
  ========================================================= */

  const symbols = {

    rho0: "\\rho_{0}",
    rho: "\\rho",

    lambda: "\\lambda",
    theta: "\\theta",
    sigma: "\\sigma",
    tau: "\\tau",
    epsilon: "\\epsilon",

    deltat: "\\Delta t",

    m1: "m_{1}",
    m2: "m_{2}",

    q1: "q_{1}",
    q2: "q_{2}",

    C1: "C_{1}",
    C2: "C_{2}",

    V1: "V_{1}",
    V2: "V_{2}",

    S1: "S_{1}",
    S2: "S_{2}",

    v1: "v_{1}",
    v2: "v_{2}",

    I0: "I_{0}",

    msolute: "m_{solute}",
    nsolute: "n_{solute}",
    Vsolution: "V_{solution}"
  };

  /* =========================================================
     IMPORTANT :
     remplacer les plus longs d'abord
  ========================================================= */

  Object.keys(symbols)
    .sort((a,b) => b.length - a.length)
    .forEach(key => {

      const value = symbols[key];

      const regex = new RegExp(
        `\\b${key}\\b`,
        "g"
      );

      out = out.replace(regex, value);
    });

  /* =========================================================
     SQRT
  ========================================================= */

  out = out.replace(
    /sqrt\(([^()]*)\)/g,
    "\\sqrt{$1}"
  );

  /* =========================================================
     EXPOSANTS
  ========================================================= */

  out = out.replace(
    /\^([a-zA-Z0-9+\-]+)/g,
    "^{$1}"
  );

  /* =========================================================
       FRACTIONS
  ========================================================= */

  /* Cas 1 : numérateur simple / (dénominateur complexe) */
  out = out.replace(
    /([^\/()]+|\([^()]+\))\s*\/\s*\(([^()]+)\)/g,
    "\\frac{$1}{$2}"
  );

  /* Cas 2 : fraction générale (UNIQUEMENT si pas déjà LaTeX) */
  out = out.replace(
    /([^\/()]+|\([^()]+\))\s*\/\s*([^\/()]+|\([^\/()]+\))/g,
    (match, num, den) => {

      // 🔥 protection réelle : ne pas toucher si déjà LaTeX
      if (match.includes("\\frac")) return match;

      return `\\frac{${num}}{${den}}`;
    }
  );

  /* Cas 3 : nettoyage des doubles fractions cassées */
  out = out.replace(
    /\\frac\{([^{}]+)\}\/\{([^{}]+)\}/g,
    "\\frac{$1}{$2}"
  );

  /* Cas 4 : sécurité anti fraction vide */
  out = out.replace(
    /\\frac\{\s*\}\s*\/\s*\{\s*\}/g,
    ""
  );

  /* =========================================================
     MULTIPLICATIONS
  ========================================================= */

  out = out.replace(
    /\*/g,
    " \\times "
  );

  /* =========================================================
     ESPACES
  ========================================================= */

  out = out.replace(/\s+/g, " ").trim();

  return out;
}

/* =========================================================
   SHUFFLE
========================================================= */

function shuffle(array) {

  const arr = [...array];

  for (let i = arr.length - 1; i > 0; i--) {

    const j = Math.floor(Math.random() * (i + 1));

    [arr[i], arr[j]] = [arr[j], arr[i]];
  }

  return arr;
}

/* =========================================================
   SOLVER CENTRAL
========================================================= */

function solveQuestion(q, target) {

  const engine = TYPE_ENGINE[q.type];

  if (!engine || !engine.solve) {
    return { result: `${target} = ?`, type: "fallback" };
  }

  return engine.solve(q, target);
}

/* =========================================================
   DISTRACTORS - ENGINE PAR TYPE D'EXPRESSION
========================================================= */

function buildCleanDistractors(q, rawList, correct, target) {

  const result = [];
  const used = new Set();

  const correctNorm = normalize(cleanExpr(correct), q.type);

  const shuffled = shuffle([...rawList]);

  for (const d of shuffled) {

    const cleaned = cleanExpr(d);
    const norm = normalize(cleaned, q.type);

    // ❌ on enlève la bonne réponse
    if (norm === correctNorm) continue;

    // ❌ doublons logiques
    if (used.has(norm)) continue;

    used.add(norm);

    // 🎨 affichage propre
    result.push(displayExpr(cleaned));

    if (result.length === 3) break;
  }

  // fallback sécurisé
  while (result.length < 3) {
    result.push(displayExpr(`${target} = ?`));
  }

  return result;
}

/* =========================================================
   DISPATCHER PRINCIPAL
========================================================= */

function generateDistractors(q, target, correct) {

  const engine = TYPE_ENGINE[q.type];

  if (!engine || !engine.distractors) {
    return genericDistractors(q, target, "", "", correct);
  }

  return engine.distractors(q, target, correct);
}

/* =========================================================
   GENERATE QUESTION
========================================================= */

function generateQuestion() {

  const q =
    QUESTIONS[Math.floor(Math.random() * QUESTIONS.length)];

  const target =
    q.targetPool[Math.floor(Math.random() * q.targetPool.length)];

  const solved = solveQuestion(q, target);

  const correctRaw = solved.result;

  const correctDisplay = displayExpr(correctRaw);

  const correctNorm = normalize(cleanExpr(correctRaw), q.type);

  let choices = [
    correctDisplay,
    ...generateDistractors(q, target, correctRaw)
  ];

  // 🎲 shuffle
  choices = shuffle(choices);

  // 🎯 index bonne réponse basé sur NORMALISATION
  const answer =
    choices.findIndex(c =>
      normalize(cleanExpr(c), q.type) === correctNorm
    );

  currentQuestion = {
    ...q,
    target,
    choices,
    answer: answer >= 0 ? answer : 0,
    solveType: solved.type,
    correct: correctDisplay
  };
}

/* =========================================================
   LOAD
========================================================= */

function load() {

  const q = currentQuestion;

  document.getElementById("question").innerHTML = `

    D’après la relation : \\(${toLatex(q.expr)}\\)<br><br>

    Donner la bonne expression pour la variable  <b>\\(${toLatex(q.target)}\\)</b>

  `;

  renderChoices(q);

  const fb =
    document.getElementById("feedback");

  if (fb) fb.innerHTML = "";

  const dom =
    document.getElementById("imageDomain");

  if (dom)
    dom.innerHTML =
      formatDomain(q.domain);

  const law =
    document.getElementById("imageTitle");

  if (law)
    law.innerHTML =
      `🔬 ${q.law}`;

  showImage(q);

  if (window.MathJax) {

    setTimeout(() => {

      if (MathJax.typesetPromise) {
        MathJax.typesetPromise();
      } else {
        MathJax.typeset();
      }

    },50);
  }
}

/* =========================================================
   CHOICES
========================================================= */

function renderChoices(q) {

  const container =
    document.getElementById("choices");

  container.innerHTML = "";

  q.choices.forEach((c,i) => {

    const btn =
      document.createElement("button");

    btn.innerHTML =
      `\\(${toLatex(c)}\\)`;

    btn.onclick =
      () => submitAnswer(i);

    container.appendChild(btn);
  });

  if (window.MathJax) {
    MathJax.typeset();
  }
}

/* =========================================================
   FEEDBACK
========================================================= */

function showFeedback() {

  const q = currentQuestion;

  const fb =
    document.getElementById("feedback");

  let explanation = "";

  switch (q.type) {

    /* =========================================================
       PRODUIT
    ========================================================= */

    case EXPRESSION_TYPES.PRODUCT:
      explanation = `
      <div style="text-align:left">
      👉 L’expression <b>\\(${toLatex(q.expr)}\\)</b> est un produit.
      <br><br>
      Pour isoler la variable <b>\\(${toLatex(q.target)}\\)</b> on divise simplement les deux côtés du signe = par le produit des autres facteurs.
      </div>
      `;
      break;

    /* =========================================================
       FRACTION
    ========================================================= */

    case EXPRESSION_TYPES.FRACTION:
      explanation = `
      <div style="text-align:left">
      👉 L’expression <b>\\(${toLatex(q.expr)}\\)</b> est une fraction.
      <br><br>
      - Si la variable <b>\\(${toLatex(q.target)}\\)</b> est au numérateur → on multiplie par le dénominateur
      - Si elle est au dénominateur → on inverse la relation
      </div>
      `;
      break;

    /* =========================================================
       PRODUIT EN CROIX
    ========================================================= */

    case EXPRESSION_TYPES.CROSS:
      explanation = `
      <div style="text-align:left">
      👉 L’expression <b>\\(${toLatex(q.expr)}\\)</b> est une égalité de deux produits.
      Pour isoler la variable <b>\\(${toLatex(q.target)}\\)</b> on divise à gauche et à droite du signe = par la grandeur qui multiplie la variable recherchée.
      </div>
      `;
      break;

    /* =========================================================
       PRODUIT + PUISSANCE (JOULE / CINÉTIQUE etc.)
    ========================================================= */

    case EXPRESSION_TYPES.PRODUCT_POWER:
      explanation = `
      <div style="text-align:left">
      👉 La variable apparaît dans un produit avec une puissance.
      <br><br>
      On isole d’abord la puissance puis on applique une racine.
      </div>
      `;
      break;

    /* =========================================================
       PUISSANCE PURE (KEPLER / STEFAN etc.)
    ========================================================= */

    case EXPRESSION_TYPES.POWER:
      explanation = `
      <div style="text-align:left">
      👉 La variable est dans une relation de puissance.
      <br><br>
      On applique l’opération inverse : racine ou exponentiation fractionnaire.
      </div>
      `;
      break;

    /* =========================================================
       LOG
    ========================================================= */

    case EXPRESSION_TYPES.LOG:
      explanation = `
      <div style="text-align:left">
      👉 La variable est dans un logarithme.
      <br><br>
      On utilise l’exponentielle pour inverser le log.
      </div>
      `;
      break;

    /* =========================================================
       EXP
    ========================================================= */

    case EXPRESSION_TYPES.EXP:
      explanation = `
      <div style="text-align:left">
      👉 La variable est dans une exponentielle.
      <br><br>
      On applique le logarithme pour l’isoler.
      </div>
      `;
      break;

    /* =========================================================
       SOMME (BERNOULLI / énergie etc.)
    ========================================================= */

    case EXPRESSION_TYPES.SUM:
      explanation = `
      <div style="text-align:left">
      👉 L’expression est une somme avec une constante.
      <br><br>
      On isole le terme contenant la variable en réorganisant l’équation.
      </div>
      `;
      break;

    /* =========================================================
       FRACTION INVERSE (lentilles etc.)
    ========================================================= */

    case EXPRESSION_TYPES.RECIPROCAL_SUM:
      explanation = `
      <div style="text-align:left">
      👉 La relation est une somme de fractions inverses.
      <br><br>
      On regroupe les inverses puis on inverse l’expression finale.
      </div>
      `;
      break;

    /* =========================================================
       FALLBACK
    ========================================================= */

    default:
      explanation = `
      <div style="text-align:left">
      👉 On utilise la structure de l’équation pour isoler la variable.
      </div>
      `;
  }

  fb.innerHTML = `

    ❌ <b>Mauvaise réponse</b><br><br>

    Regardons la méthode 👇<br><br>

    🧠 À partir de : \\(${toLatex(q.expr)}\\)<br><br>

    ${explanation}

    <br><br>

    ✔ Bonne réponse :<br><br>

    \\[
      ${toLatex(solveQuestion(q, q.target).result)}
    \\]

  `;

  if (window.MathJax) {
    setTimeout(() => {
      MathJax.typesetPromise?.() || MathJax.typeset();
    }, 0);
  }
}

/* =========================================================
   SUBMIT
========================================================= */

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

    setTimeout(endGame,2000);
  }
}

/* =========================================================
   TIMER
========================================================= */

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

/* =========================================================
   START
========================================================= */

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

/* =========================================================
   END
========================================================= */

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
/* =========================================================
   QUITGAME
========================================================= */

function quitGame() {

  if (gameOver) return;

  const confirmQuit = confirm("Êtes-vous sûr de vouloir quitter la partie ?");

  if (!confirmQuit) return;

  gameOver = true;
  clearInterval(timer);

  window.location.href = "index.html";
}

/* =========================================================
   UI
========================================================= */

function updateUI() {

  document.getElementById("score")
    .textContent = score;

  const mode =

    score > 10
      ? "hard"

      : score > 4
        ? "medium"

        : "easy";

  const m =
    document.getElementById("mode");

  if (m)
    m.textContent = mode;
}

/* =========================================================
   IMAGE
========================================================= */

function showImage(q) {

  const img =
    document.getElementById("illustration");

  if (!img) return;

  if (!q.image) {

    img.style.display = "none";
    return;
  }

  img.src = q.image;

  img.style.display = "block";
}

/* =========================================================
   DOMAIN
========================================================= */

function formatDomain(domain) {

  const d = domain.toLowerCase();

  if (d.includes("chimie"))
    return "⚗️ Chimie";

  if (d.includes("electric"))
    return "⚡ Électricité";

  if (d.includes("onde"))
    return "🌊 Ondes";

  if (d.includes("grav"))
    return "🌍 Gravitation";

  if (d.includes("energie"))
    return "⚙️ Énergie";

  if (d.includes("fluide"))
    return "💧 Fluides";

  if (d.includes("thermo"))
    return "🔥 Thermodynamique";

  if (d.includes("lent"))
    return "🔭 Optique";

  return "📚 Physique";
}

/* =========================================================
   SOUNDS
========================================================= */

function playSound(id) {

  const s =
    document.getElementById(id);

  if (!s) return;

  s.currentTime = 0;

  s.play().catch(()=>{});
}

function playGoodSound() {
  playSound("goodSound");
}

function playBadSound() {
  playSound("badLight");
}
