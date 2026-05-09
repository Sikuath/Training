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
{ difficulty:"medium", domain:"chimie", law:"Dilution", image:"./images/dilution.jpg", expr:"C1*V1 = C2*V2", type:EXPRESSION_TYPES.CROSS, left:["C1","V1"], right:["C2","V2"], baseVars:["C1","V1","C2","V2"], targetPool:["C1","V1","C2","V2"] },

// 8
//{ difficulty:"easy", domain:"forces", law:"Poids", image:"./images/poids.jpg", expr:"P = m*g", type:EXPRESSION_TYPES.PRODUCT, lhs:"P", factors:["m","g"], baseVars:["P","m","g"], targetPool:["m","g"] },

// 9
//{ difficulty:"medium", domain:"gravitation", law:"Gravitation de Newton", image:"./images/gravitation.jpg", expr:"F = G*m1*m2/r^2", type:EXPRESSION_TYPES.PRODUCT_FRACTION, lhs:"F", numerator:["G","m1","m2"], denominator:"r", denominatorPower:2, baseVars:["F","G","m1","m2","r"], targetPool:["m1","m2","r"] },

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
   CLEAN
========================================================= */

function cleanExpr(str) {

  if (!str) return "";

  return str
    // enlève les parenthèses inutiles autour d’un seul bloc simple
    .replace(/\(([^()]+)\)/g, "$1")

    // enlève les doubles parenthèses issues des joins
    .replace(/\(\s*([a-zA-Z0-9_^*/+-]+)\s*\)/g, "$1")

    // nettoie espaces
    .replace(/\s+/g, " ");
}

/* =========================================================
   NORMALIZE
========================================================= */

function normalizeExpr(str) {

  if (!str) return "";

  return str
    .replace(/\s+/g,"")
    .replace(/\\times/g,"*")
    .replace(/[{}]/g,"")
    .toLowerCase();
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

  out = out.replace(
    /([a-zA-Z0-9\\{}_^()+-]+)\/([a-zA-Z0-9\\{}_^()+-]+)/g,
    "\\frac{$1}{$2}"
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

  switch(q.type) {

    /* =========================================
       PRODUIT
    ========================================= */

    case EXPRESSION_TYPES.PRODUCT: {

      const others =
        q.factors.filter(f => f !== target);

      if (q.factors.includes(target)) {

        return {
          result:
            cleanExpr(`${target} = ${q.lhs}/${others.join("*")}`),
          type:"division"
        };
      }

      break;
    }

    /* =========================================
       FRACTION
    ========================================= */

    case EXPRESSION_TYPES.FRACTION: {

      if (target === q.numerator) {

        return {
          result:
            `${target} = ${q.lhs}*${q.denominator}`,
          type:"multiply_fraction"
        };
      }

      if (target === q.denominator) {

        return {
          result:
            `${target} = ${q.numerator}/${q.lhs}`,
          type:"inverse_fraction"
        };
      }

      break;
    }

    /* =========================================
       CROSS
    ========================================= */

    case EXPRESSION_TYPES.CROSS: {

      const left = q.left;
      const right = q.right;

      // cible à gauche
      if (left.includes(target)) {

        const otherLeft =
          left.find(x => x !== target);

        return {
          result:
            cleanExpr(
              `${target} = (${right.join("*")})/${otherLeft}`
            ),
          type:"cross"
        };
      }

      // cible à droite
      if (right.includes(target)) {

        const otherRight =
          right.find(x => x !== target);

        return {
          result:
            cleanExpr(
              `${target} = (${left.join("*")})/${otherRight}`
            ),
          type:"cross"
        };
      }

      break;
    }

    /* =========================================
       PRODUCT FRACTION
    ========================================= */

    case EXPRESSION_TYPES.PRODUCT_FRACTION: {

      if (q.numerator.includes(target)) {

        const others =
          q.numerator.filter(x => x !== target);

        const denom =
          q.denominatorPower
            ? `${q.denominator}^${q.denominatorPower}`
            : q.denominator;

        return {
          result:
            cleanExpr(`${target} = (${q.lhs}*${denom})/(${others.join("*")})`),
          type:"fraction_product"
        };
      }

      if (target === q.denominator) {

        if (q.denominatorPower === 2) {

          return {
            result:
              cleanExpr(`${target} = sqrt((${q.numerator.join("*")})/${q.lhs})`),
            type:"sqrt_fraction"
          };
        }

        return {
          result:
            cleanExpr(`${target} = (${q.numerator.join("*")})/${q.lhs}`),
          type:"inverse_fraction"
        };
      }

      break;
    }

    /* =========================================
       PRODUCT POWER
    ========================================= */

    case EXPRESSION_TYPES.PRODUCT_POWER: {

      if (target === q.poweredVar) {

        const constPart =
          q.constant ? q.constant + "*" : "";

        const denom =
          [...q.factors].join("*");

        return {
          result:
            cleanExpr(`${target} = sqrt(${q.lhs}/(${constPart}${denom}))`),
          type:"sqrt"
        };
      }

      if (q.factors.includes(target)) {

        return {
          result:
            cleanExpr(`${target} = ${q.lhs}/(${q.poweredVar}^${q.power}*${q.factors.filter(f=>f!==target).join("*")})`),
          type:"division"
        };
      }

      break;
    }

    /* =========================================
       POWER
    ========================================= */

    case EXPRESSION_TYPES.POWER: {

      if (target === q.variable) {

        return {
          result:
            `${target} = (${q.lhs}/${q.coefficient})^(1/${q.power})`,
          type:"root"
        };
      }

      if (target === q.rightVar) {

        return {
          result:
            `${target} = (${q.leftVar}^${q.leftPower}/${q.coefficient})^(1/${q.rightPower})`,
          type:"root"
        };
      }

      if (target === q.leftVar) {

        return {
          result:
            `${target} = sqrt(${q.coefficient}*${q.rightVar}^${q.rightPower})`,
          type:"sqrt"
        };
      }

      break;
    }

    /* =========================================
       LOG
    ========================================= */

    case EXPRESSION_TYPES.LOG: {

      if (target === "H+") {

        return {
          result:
            "H+ = 10^(-pH)",
          type:"log"
        };
      }

      if (target === "I") {

        return {
          result:
            "I = I0*10^(L/10)",
          type:"log"
        };
      }

      break;
    }

    /* =========================================
       EXP
    ========================================= */

    case EXPRESSION_TYPES.EXP: {

      if (target === "t") {

        return {
          result:
            "t = -ln(N/N0)/lambda",
          type:"exp"
        };
      }

      break;
    }

    /* =========================================
       SUM
    ========================================= */

    case EXPRESSION_TYPES.SUM: {

      return {
        result:q.targetFormula,
        type:"sum"
      };
    }

    /* =========================================
       RECIPROCAL
    ========================================= */

    case EXPRESSION_TYPES.RECIPROCAL_SUM: {

      return {
        result:
          "f = 1/(1/d0 + 1/di)",
        type:"reciprocal"
      };
    }

  }

  return {
    result:`${target} = ?`,
    type:"fallback"
  };
}

/* =========================================================
   DISTRACTORS - ENGINE PAR TYPE D'EXPRESSION
========================================================= */

function isValidDistractor(candidate, correct, set) {

  const normCandidate = normalizeExpr(candidate);
  const normCorrect = normalizeExpr(correct);

  if (normCandidate === normCorrect) return false;
  if (set.has(normCandidate)) return false;

  return true;
}

function buildCleanDistractors(rawList, correct, target) {

  const set = new Set();
  const result = [];

  const normCorrect = normalizeExpr(correct);

  const shuffled = shuffle(rawList);

  for (const d of shuffled) {

    const norm = normalizeExpr(d);

    if (norm === normCorrect) continue;
    if (set.has(norm)) continue;

    if (!isValidDistractor(d, correct, set)) continue;

    set.add(norm);
    result.push(d);

    if (result.length === 3) break;
  }

  // fallback sécurisé
  while (result.length < 3) {
    result.push(`${target} = ?`);
  }

  return result;
}

/* =========================================================
   DISPATCHER PRINCIPAL
========================================================= */

function generateDistractors(q, target, correct) {

  const base = q.baseVars.filter(v => v !== target);
  const a = base[0] || "x";
  const b = base[1] || "y";
  const c = base[2] || "z";

  switch (q.type) {

    case EXPRESSION_TYPES.PRODUCT:
      return productDistractors(q, target, a, b, correct);

    case EXPRESSION_TYPES.FRACTION:
      return fractionDistractors(q, target, correct);

    case EXPRESSION_TYPES.CROSS:
      return crossDistractors(q, target, a, b, c, correct);

    case EXPRESSION_TYPES.PRODUCT_FRACTION:
      return productFractionDistractors(q, target, a, b, c, correct);

    case EXPRESSION_TYPES.LOG:
      return logDistractors(q, target, correct);

    case EXPRESSION_TYPES.POWER:
    case EXPRESSION_TYPES.PRODUCT_POWER:
    case EXPRESSION_TYPES.EXP:
      return powerDistractors(q, target, a, b, correct);

    default:
      return genericDistractors(q, target, a, b, correct);
  }
}

/* =========================================================
   PRODUIT
========================================================= */

function productDistractors(q, target, a, b, correct) {

  const raw = [
    `${target} = ${a}/${b}`,
    `${target} = ${b}/${a}`,
    `${target} = ${a}*${b}`,
    `${target} = ${b}*${a}`,
    `${target} = ${b}-${a}`,
    `${target} = ${a}-${b}`,
    `${target} = ${a}+${b}`
  ];

  return buildCleanDistractors(raw, correct, target);
}

/* =========================================================
   FRACTION
========================================================= */

function fractionDistractors(q, target, correct) {

  let raw = [];

  /* =========================================================
     CAS 1 : on cherche le NUMÉRATEUR
  ========================================================= */

  if (target === q.numerator) {

    raw = [

      `${target} = ${q.lhs}*${q.denominator}`,
      `${target} = ${q.denominator}/${q.lhs}`,
      `${target} = ${q.lhs}/${q.denominator}`,
      `${target} = ${q.lhs}+${q.denominator}`,
      `${target} = ${q.lhs}-${q.denominator}`
    ];
  }

  /* =========================================================
     CAS 2 : on cherche le DÉNOMINATEUR
  ========================================================= */

  else if (target === q.denominator) {

    raw = [

      `${target} = ${q.numerator}/${q.lhs}`,
      `${target} = ${q.lhs}/${q.numerator}`,
      `${target} = ${q.lhs}*${q.numerator}`,
      `${target} = ${q.lhs}-${q.numerator}`,
      `${target} = ${q.lhs}+${q.numerator}`
    ];
  }

  /* =========================================================
     FILTRAGE UNIFORME
  ========================================================= */

  return buildCleanDistractors(raw, correct, target);
}

/* =========================================================
   PRODUIT EN CROIX
========================================================= */

function crossDistractors(q, target, a, b, c, correct) {

  const raw = [
    `${target} = ${a}/${b}`,
    `${target} = ${b}/${a}`,
    `${target} = ${a}*${b}`,
    `${target} = ${q.right?.[0]}/${q.left?.[0]}`,
    `${target} = ${a}+${b}`
  ];

  return buildCleanDistractors(raw, correct, target);
}


/* =========================================================
   PRODUIT / FRACTION COMPLEXE
========================================================= */

function productFractionDistractors(q, target, a, b, c, correct) {

  const raw = [
    `${target} = ${q.lhs}/${q.denominator}`,
    `${target} = ${q.denominator}/${q.lhs}`,
    `${target} = sqrt(${q.lhs})`,
    `${target} = ${q.lhs}*${a}`
  ];

  return buildCleanDistractors(raw, correct, target);
}


/* =========================================================
   LOG / EXP
========================================================= */

function logDistractors(q, target, correct) {

  const raw = [
    `H+ = log(${q.lhs})`,
    `H+ = 10^${q.lhs}`,
    `H+ = -${q.lhs}`,
    `H+ = ${q.lhs}/10`
  ];

  return buildCleanDistractors(raw, correct, target);
}


/* =========================================================
   PUISSANCES / EXP
========================================================= */

function powerDistractors(q, target, a, b, correct) {

  const raw = [
    `${target} = ${q.lhs}/${q.coefficient || 1}`,
    `${target} = sqrt(${q.lhs})`,
    `${target} = ${q.lhs}^${q.power || 2}`,
    `${target} = ${q.coefficient || 1}*${q.variable || a}`
  ];

  return buildCleanDistractors(raw, correct, target);
}


/* =========================================================
   FALLBACK
========================================================= */

function genericDistractors(q, target, a, b, correct) {

  const raw = [
    `${target} = ${a}*${b}`,
    `${target} = ${a}/${b}`,
    `${target} = ${b}/${a}`,
    `${target} = ${a}+${b}`,
    `${target} = ${b}-${a}`
  ];

  return buildCleanDistractors(raw, correct, target);
}

/* =========================================================
   GENERATE QUESTION
========================================================= */

function generateQuestion() {

  const q =
    QUESTIONS[
      Math.floor(Math.random()*QUESTIONS.length)
    ];

  const target =
    q.targetPool[
      Math.floor(Math.random()*q.targetPool.length)
    ];

  const solved =
    solveQuestion(q,target);

  const correct =
    solved.result;

  let choices = [
    correct,
    ...generateDistractors(q,target,correct)
  ];

  choices = shuffle(choices);

  const answer =
    choices.findIndex(
      c =>
        normalizeExpr(c) ===
        normalizeExpr(correct)
    );

  currentQuestion = {

    ...q,

    target,

    choices,

    answer,

    solveType: solved.type
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

  const solved =
    solveQuestion(q,q.target);

  const fb =
    document.getElementById("feedback");

  let explanation = "";

  switch(solved.type) {

    case "division":
      explanation =`
      <div style="text-align:left">
      👉 La variable <b>\\(${toLatex(currentQuestion.target)}\\)</b> est multipliée par une autre grandeur.
      Pour l’isoler, on doit donc <b>diviser</b> ce qu'il y a écrit à gauche du signe = par cette autre grandeur.
      </div>
      `;
      break;

    case "multiply_fraction":
      explanation =`
      <div style="text-align:left">
      👉 La variable <b>\\(${toLatex(currentQuestion.target)}\\)</b> est au numérateur d’une fraction.
      Pour l'isoler, on doit <b>multiplier</b> ce qu'il y a écrit à gauche du signe = avec le dénominateur de la fraction.
      `;
      break;

    case "inverse_fraction":
      explanation =`
      <div style="text-align:left">
      👉 La variable <b>\\(${toLatex(currentQuestion.target)}\\)</b> est au dénominateur d'une fraction.
      Pour l'isoler, on <b>l'intervertit</b> avec la variable écrite à gauche du signe = sans toucher au numérateur de la fraction.
      </div>
      `;
      break;

    case "cross":
      explanation =
        "👉 On effectue un produit en croix.";
      break;

    case "sqrt":
      explanation =
        "👉 La variable apparaît au carré. On applique une racine carrée.";
      break;

    case "root":
      explanation =
        "👉 La variable apparaît dans une puissance. On applique la racine correspondante.";
      break;

    case "log":
      explanation =
        "👉 On utilise les propriétés du logarithme.";
      break;

    case "exp":
      explanation =
        "👉 On applique le logarithme népérien.";
      break;

    case "sum":
      explanation =
        "👉 On isole d’abord le terme contenant la variable.";
      break;

    default:
      explanation =
        "👉 On réorganise l’équation.";
  }

  fb.innerHTML = `

    ❌ <b>Mauvaise réponse</b><br><br>

    Regardons ensemble la démarche 👇<br><br>

    🧠 À partir de l’expression : \\(${toLatex(q.expr)}\\)<br><br>

    ${explanation}

    <br><br>

    ✔ Bonne réponse :

    <br><br>

    \\[
      ${toLatex(solved.result)}
    \\]

  `;

  if (window.MathJax) {

    setTimeout(() => {

      if (MathJax.typesetPromise) {
        MathJax.typesetPromise();
      } else {
        MathJax.typeset();
      }

    },0);
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

    if (gameOver) {

      clearInterval(timer);
      return;
    }

    timeLeft--;

    const t =
      document.getElementById("timer");

    if (t)
      t.textContent =
        timeLeft + "s";

    if (timeLeft <= 0) {
      endGame();
    }

  },1000);
}

/* =========================================================
   START
========================================================= */

function startGame() {

  clearInterval(timer);

  score = 0;
  current = 0;

  gameOver = false;

  timeLeft = 180;

  const startBtn =
    document.getElementById("startBtn");

  if (startBtn)
    startBtn.disabled = true;

  generateQuestion();

  load();

  updateUI();

  startTimer();
}

/* =========================================================
   END
========================================================= */

function endGame() {

  if (gameOver) return;

  gameOver = true;

  clearInterval(timer);

  const startBtn =
    document.getElementById("startBtn");

  if (startBtn)
    startBtn.disabled = false;

  let ranking =
    JSON.parse(
      localStorage.getItem("ranking") || "[]"
    );

  ranking.push({score});

  ranking.sort((a,b) => b.score - a.score);

  localStorage.setItem(
    "ranking",
    JSON.stringify(ranking)
  );

  setTimeout(() => {

    window.location.href =
      "gameover.html?score=" + score;

  },5000);
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
