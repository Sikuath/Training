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

// 1
//{ difficulty:"easy", domain:"electricite", law:"Loi d’Ohm", image:"./images/ohm.jpg", expr:"U=R*I", type:EXPRESSION_TYPES.PRODUCT, lhs:"U", factors:["R","I"], baseVars:["U","R","I"], targetPool:["R","I"], answers:{R:"U/I", I:"U/R"} },

// 2
//{ difficulty:"easy", domain:"chimie", law:"Masse volumique", image:"./images/masse_volumique.jpg", expr:"rho=m/V", type:EXPRESSION_TYPES.FRACTION, lhs:"rho", numerator:"m", denominator:"V", baseVars:["rho","m","V"], targetPool:["m","V"], answers:{m:"rho*V", V:"m/rho"} },

// 3
//{ difficulty:"easy", domain:"chimie", law:"Densité", image:"./images/densite.jpg", expr:"d=rho/rho0", type:EXPRESSION_TYPES.FRACTION, lhs:"d", numerator:"rho", denominator:"rho0", baseVars:["d","rho","rho0"], targetPool:["rho","rho0"], answers:{rho:"d*rho0", rho0:"rho/d"} },

// 4
//{ difficulty:"easy", domain:"chimie", law:"Concentration massique", image:"./images/concentration_massique.jpg", expr:"t=msolute/Vsolution", type:EXPRESSION_TYPES.FRACTION, lhs:"t", numerator:"msolute", denominator:"Vsolution", baseVars:["t","msolute","Vsolution"], targetPool:["msolute","Vsolution"], answers:{msolute:"t*Vsolution", Vsolution:"msolute/t"} },

// 5
//{ difficulty:"easy", domain:"chimie", law:"Concentration molaire", image:"./images/concentration_molaire.jpg", expr:"C=nsolute/Vsolution", type:EXPRESSION_TYPES.FRACTION, lhs:"C", numerator:"nsolute", denominator:"Vsolution", baseVars:["C","nsolute","Vsolution"], targetPool:["nsolute","Vsolution"], answers:{nsolute:"C*Vsolution", Vsolution:"nsolute/C"} },

// 6
//{ difficulty:"easy", domain:"chimie", law:"Quantité de matière", image:"./images/quantite_matiere.jpg", expr:"n=m/M", type:EXPRESSION_TYPES.FRACTION, lhs:"n", numerator:"m", denominator:"M", baseVars:["n","m","M"], targetPool:["m","M"], answers:{m:"n*M", M:"m/n"} },

// 7
//{ difficulty:"medium", domain:"chimie", law:"Dilution", image:"./images/dilution.jpg", expr:"C1*V1=C2*V2", type:EXPRESSION_TYPES.CROSS, left:["C1","V1"], right:["C2","V2"], baseVars:["C1","V1","C2","V2"], targetPool:["C1","V1","C2","V2"], answers:{C1:"C2*V2/V1", V1:"C2*V2/C1", C2:"C1*V1/V2", V2:"C1*V1/C2"} },

// 8
//{ difficulty:"easy", domain:"forces", law:"Poids", image:"./images/poids.jpg", expr:"P=m*g", type:EXPRESSION_TYPES.PRODUCT, lhs:"P", factors:["m","g"], baseVars:["P","m","g"], targetPool:["m","g"], answers:{m:"P/g", g:"P/m"} },

// 9
{ difficulty:"medium", domain:"gravitation", law:"Gravitation de Newton", image:"./images/gravitation.jpg", expr:"F=G*m1*m2/r^2", type:EXPRESSION_TYPES.FORCE_CENTRALE, lhs:"F", numerator:["G","m1","m2"], denominator:"r", denominatorPower:2, baseVars:["F","G","m1","m2","r"], targetPool:["m1","m2","r"], answers:{m1:"F*r^2/G*m2", m2:"F*r^2/G*m1", r:"\sqrt(G*m1*m2/F)"} },

// 10
//{ difficulty:"hard", domain:"ondes", law:"Effet Doppler", image:"./images/doppler.jpg", expr:"f'=f*(v+vr)/(v+vs)", type:EXPRESSION_TYPES.PRODUCT_FRACTION, lhs:"f'", numerator:["f","(v+vr)"], denominator:"(v+vs)", baseVars:["f'","f","v","vr","vs"], targetPool:["f"], answers:{f:"f'*(v+vs)/(v+vr)"} },

// 11
//{ difficulty:"medium", domain:"ondes", law:"Réfraction", image:"./images/refraction.jpg", expr:"n1*sin(i)=n2*sin(r)", type:EXPRESSION_TYPES.CROSS, left:["n1","sin(i)"], right:["n2","sin(r)"], baseVars:["n1","n2","sin(i)","sin(r)"], targetPool:["n1","n2","sin(i)","sin(r)"], answers:{n1:"(n2*sin(r))/sin(i)", n2:"(n1*sin(i))/sin(r)", sin(i):"(n2*sin(r))/n1",sin(r):"(n1*sin(i))/n2"} },

// 12
//{ difficulty:"easy", domain:"lentilles", law:"Grandissement", image:"./images/lens.jpg", expr:"G=A1B1/AB", type:EXPRESSION_TYPES.FRACTION, lhs:"G", numerator:"A1B1", denominator:"AB", baseVars:["G","A1B1","AB"], targetPool:["A1B1","AB"], answers:{A1B1:"G*AB", AB:"A1B1/G"} },

// 13
//{ difficulty:"easy", domain:"chimie", law:"Beer-Lambert", image:"./images/spectroscopie.jpg", expr:"A=epsilon*l*C", type:EXPRESSION_TYPES.PRODUCT, lhs:"A", factors:["epsilon","l","C"], baseVars:["A","epsilon","l","C"], targetPool:["C"], answers:{C:"A/(epsilon*l)"} },

// 14
//{ difficulty:"medium", domain:"chimie", law:"Titrage", image:"./images/titrage.jpg", expr:"nA/a=nB/b", type:EXPRESSION_TYPES.CROSS, left:["nA","b"], right:["nB","a"], baseVars:["nA","nB","a","b"], targetPool:["nA","nB"], answers:{nA:"(nB*a)/b", nB:"(nA*b)/a"} },

// 15
//{ difficulty:"hard", domain:"energie", law:"Chaleur", image:"./images/chaleur.jpg", expr:"Q=m*c*(Tf-Ti)", type:EXPRESSION_TYPES.PRODUCT, lhs:"Q", factors:["m","c","(Tf-Ti)"], baseVars:["Q","m","c","Tf","Ti"], targetPool:["m"], answers:{m:"Q/(c*(Tf-Ti))"} },

// 16
//{ difficulty:"medium", domain:"electricite", law:"Coulomb", image:"./images/coulomb.jpg", expr:"F=k*q1*q2/r^2", type:EXPRESSION_TYPES.FORCE_CENTRALE, lhs:"F", numerator:["k","q1","q2"], denominator:"r", denominatorPower:2, baseVars:["F","k","q1","q2","r"], targetPool:["r","q1","q2"], answers:{q1:"F*r^2/k*q2", q2:"F*r^2/k*q1" , r:"\sqrt(k*q1*q2/F)"} },

// 17
//{ difficulty:"easy", domain:"fluide", law:"Hydrostatique", image:"./images/hydrostatique.jpg", expr:"P=rho*g*h", type:EXPRESSION_TYPES.PRODUCT, lhs:"P", factors:["rho","g","h"], baseVars:["P","rho","g","h"], targetPool:["h","rho"], answers:{h:"P/(rho*g)", rho:"P/(g*h)"} },

// 18
//{ difficulty:"easy", domain:"thermodynamique", law:"Boyle-Mariotte", image:"./images/manometre.jpg", expr:"P*V=k", type:EXPRESSION_TYPES.CROSS, left:["P","V"], right:["k"], baseVars:["P","V","k"], targetPool:["P","V"], answers:{P:"k/V", V:"k/P"} },

// 19
//{ difficulty:"easy", domain:"energie", law:"Puissance", image:"./images/puissance.jpg", expr:"P=E/deltat", type:EXPRESSION_TYPES.FRACTION, lhs:"P", numerator:"E", denominator:"deltat", baseVars:["P","E","deltat"], targetPool:["E","deltat"], answers:{E:"P*deltat", deltat:"deltat=E/P"} },

// 20
//{ difficulty:"hard", domain:"electricite", law:"Effet Joule", image:"./images/joule.jpg", expr:"E=R*I^2*deltat", type:EXPRESSION_TYPES.PRODUCT_POWER, lhs:"E", factors:["R","deltat"], poweredVar:"I", power:2, baseVars:["E","R","I","deltat"], targetPool:["R","I","deltat"], answers:{R:"E/(I^2*deltat)", I:"sqrt(E/(R*deltat))", deltat:"E/(R*I^2)"} },

// 21
//{ difficulty:"medium", domain:"energie", law:"Énergie cinétique", image:"./images/energie_cinetique.jpg", expr:"Ec=1/2*m*v^2", type:EXPRESSION_TYPES.PRODUCT_POWER, lhs:"Ec", constant:"1/2", factors:["m"], poweredVar:"v", power:2, baseVars:["Ec","m","v"], targetPool:["m","v"], answers:{m:"(2*Ec)/v^2", v:"sqrt((2*Ec)/m)"} },

// 22
//{ difficulty:"medium", domain:"energie", law:"Énergie potentielle de pesanteur", image:"./images/energie_pot_pes.jpg", expr:"Epp=m*g*h+Epp(0)", type:EXPRESSION_TYPES.PRODUCT_EPP, lhs:"Epp", constant:"Epp(0)", factors:["m","g","h"], baseVars:["Ep","m","g","h","Epp(0)"], targetPool:["m","h"], answers:{m:"(Epp-Epp(0))/(g*h)", h:"(Epp-Epp(0))/(m*g)"} },

// 23
//{ difficulty:"easy", domain:"ondes", law:"Célérité onde", image:"./images/celerite.jpg", expr:"v=lambda*f", type:EXPRESSION_TYPES.PRODUCT, lhs:"v", factors:["lambda","f"], baseVars:["v","lambda","f"], targetPool:["lambda","f"], answers:{lambda:"v/f", f:"v/lambda"} },

// 24
//{ difficulty:"easy", domain:"quantique", law:"Photon", image:"./images/energie_photon.jpg", expr:"E=h*f", type:EXPRESSION_TYPES.PRODUCT, lhs:"E", factors:["h","f"], baseVars:["E","h","f"], targetPool:["f"], answers:{f:"E/h"} },

// 25
//{ difficulty:"hard", domain:"quantique", law:"Radioactivité", image:"./images/radio.jpg", expr:"N=N0*e^(-lambda*t)", type:EXPRESSION_TYPES.EXP, lhs:"N", base:"N0", exponent:"(-lambda*t)", baseVars:["N","N0","lambda","t"], targetPool:["t"], answers:{t:"-(ln(N/N0))/lambda"} },

// 26
//{ difficulty:"hard", domain:"chimie", law:"pH", image:"./images/acidite.jpg", expr:"pH=-log([H3O+]/C0)", type:EXPRESSION_TYPES.LOG, lhs:"pH", variable:"[H3O+]", baseVars:["pH","[H3O+]"], targetPool:["[H3O+]"], answers:{[H3O+]:"C0*10^(-pH)"} },

// 27
//{ difficulty:"hard", domain:"gravitation", law:"Kepler III", image:"./images/kepler.jpg", expr:"T^2=k*R^3", type:EXPRESSION_TYPES.POWER, leftVar:"T", leftPower:2, coefficient:"k", rightVar:"R", rightPower:3, baseVars:["T","R","k"], targetPool:["R","T"], answers:{R:"(T^2/k)^(1/3)", T:"sqrt(k*R^3)"} },

// 28
//{ difficulty:"hard", domain:"fluide", law:"Bernoulli", image:"./images/bernoulli.jpg", expr:"P+1/2*rho*v^2=k", type:EXPRESSION_TYPES.SUM, targetFormula:"v=sqrt((2*(k-P))/rho)", baseVars:["P","rho","v","k"], targetPool:["v"], answers:{v:"v=sqrt((2*(k-P))/rho)"} },

// 29
//{ difficulty:"easy", domain:"fluide", law:"Poussée Archimède", image:"./images/archimede.jpg", expr:"Pa=rho*V*g", type:EXPRESSION_TYPES.PRODUCT, lhs:"Pa", factors:["rho","V","g"], baseVars:["Pa","rho","V","g"], targetPool:["rho","V"], answers:{rho:"Pa/(V*g)", V:"Pa/(rho*g)"} },

// 30
//{ difficulty:"medium", domain:"fluide", law:"Venturi", image:"./images/venturi.jpg", expr:"v1*S1=v2*S2", type:EXPRESSION_TYPES.CROSS, left:["v1","S1"], right:["v2","S2"], baseVars:["v1","v2","S1","S2"], targetPool:["v1","v2","S1","S2"], answers:{v1:"(v2*S2)/S1", v2:"(v1*S1)/S2", S1:"(v2/S2)/v1", S2:"(v1*S1)/v2"} },

// 31
//{ difficulty:"hard", domain:"thermodynamique", law:"Gaz parfait", image:"./images/gaz_parfait.jpg", expr:"P*V=n*R*T", type:EXPRESSION_TYPES.CROSS, left:["P","V"], right:["n","R*T"], baseVars:["P","V","n","R","T"], targetPool:["P","V","n","T"], answers:{P:"(n*R*T)/V", V:"(n*R*T)/P", n:"(P*V)/(R*T)", T:"(P*V)/(n*R)"} },

// 32
//{ difficulty:"hard", domain:"energie", law:"Rayonnement", image:"./images/stefan.jpg", expr:"P=sigma*T^4", type:EXPRESSION_TYPES.POWER, lhs:"P", coefficient:"sigma", variable:"T", power:4, baseVars:["P","sigma","T"], targetPool:["T"], answers:{T:"(P/sigma)^(1/4)"} },

// 33
//{ difficulty:"easy", domain:"electricite", law:"Circuit RC", image:"./images/rc.jpg", expr:"tau=R*C", type:EXPRESSION_TYPES.PRODUCT, lhs:"tau", factors:["R","C"], baseVars:["tau","R","C"], targetPool:["R","C"], answers:{R:"tau/C", C:"tau/R"} },

// 34
//{ difficulty:"easy", domain:"ondes", law:"Diffraction", image:"./images/diffraction.jpg", expr:"theta=lambda/a", type:EXPRESSION_TYPES.FRACTION, lhs:"theta", numerator:"lambda", denominator:"a", baseVars:["theta","lambda","a"], targetPool:["lambda","a"], answers:{lambda:"theta*a", a:"lambda/theta"} },

// 35
//{ difficulty:"medium", domain:"ondes", law:"Interférences", image:"./images/interference.jpg", expr:"i=lambda*D/b", type:EXPRESSION_TYPES.PRODUCT_FRACTION, lhs:"i", numerator:["lambda","D"], denominator:"b", baseVars:["i","lambda","D","b"], targetPool:["lambda","D","b"], answers:{lambda:"(i*b)/D", D:"(i*b)/lambda", b:"(lambda*D)/i"} },

// 36
//{ difficulty:"hard", domain:"ondes", law:"Intensité sonore", image:"./images/son.jpg", expr:"L=10*log(I/I0)", type:EXPRESSION_TYPES.LOG, lhs:"L", variable:"I", baseVars:["L","I","I0"], targetPool:["I"], answers:{I:"I0*10^(L/10)"} },

// 37
//{ difficulty:"medium", domain:"mouvement", law:"Mouvement circulaire", image:"./images/acceleration_normale.jpg", expr:"a=v^2/R", type:EXPRESSION_TYPES.PRODUCT_FRACTION, lhs:"a", numerator:["v"], numeratorPower:2, denominator:"R", baseVars:["a","v","R"], targetPool:["v","R"], answers:{v:"sqrt(a*R)", R:"v^2/a"} },

// 38
//{ difficulty:"easy", domain:"electricite", law:"Charge électrique", image:"./images/quantite_elec.jpg", expr:"q=n*e", type:EXPRESSION_TYPES.PRODUCT, lhs:"q", factors:["n","e"], baseVars:["q","n","e"], targetPool:["n","e"], answers:{n:"q/e", e:"q/n"} },

// 39
//{ difficulty:"hard", domain:"lentilles", law:"Conjugaison", image:"./images/lens1.jpg", expr:"1/di-1/do=1/f", type:EXPRESSION_TYPES.RECIPROCAL_SUM, baseVars:["f","do","di"], targetPool:["f"], answers:{f:"(do*di)/(do-di)"} },

// 40
//{ difficulty:"easy", domain:"optique", law:"Lunette astronomique", image:"./images/lunette.jpg", expr:"G=fo/fe", type:EXPRESSION_TYPES.FRACTION, lhs:"G", numerator:"fo", denominator:"fe", baseVars:["G","fo","fe"], targetPool:["fo","fe"], answers:{fo:"G*fe", fe:"fo/G"} }

];

/* =========================================================
   TABLE DISTRACTORS
========================================================= */

const DISTRACTOR_PATTERNS = {

  // =========================
  // FRACTION (rho = m/V, etc.)
  // =========================
  FRACTION_NUM: [
    (L, A, B) => `${B}/${L}`,
    (L, A, B) => `${L}/${B}`,
    (L, A, B) => `${B}-${L}`,
    (L, A, B) => `${B}+${L}`,
    (L, A, B) => `${L}-${B}`
  ],

  FRACTION_DEN: [
    (L, A, B) => `${L}/${A}`,
    (L, A, B) => `${L}*${A}`,
    (L, A, B) => `${A}+${L}`,
    (L, A, B) => `${A}-${L}`,
    (L, A, B) => `${L}-${A}`
  ],

  // =========================
  // PRODUCT (P=m*g, U=R*I)
  // =========================
  PRODUCT: [
    (L, A, B, t, other) => `${L}*${other}`,
    (L, A, B, t, other) => `${other}/${L}`,
    (L, A, B, t, other) => `${L}+${other}`,
    (L, A, B, t, other) => `${L}-${other}`,
    (L, A, B, t, other) => `${L}+${other}`,
    (L, A, B, t, other) => `${other}-${L}`
  ],

  // =========================
  // CROSS (C1V1 = C2V2)
  // =========================
CROSS: [

  // =====================================
  // produit au lieu de quotient
  // =====================================

  ({op1,op2,other}) => `${op1}*${op2}*${other}`,

  // =====================================
  // inversion totale
  // =====================================

  ({op1,op2,other}) => `${other}/(${op1}*${op2})`,

  // =====================================
  // mauvais quotient
  // =====================================

  ({op1,op2,other}) => `${op1}/${op2}*${other}`,

  ({op1,op2,other}) => `${op2}/${op1}*${other}`,

  ({op1,op2,other}) => `${op1}*${other}/${op2}`,

  ({op1,op2,other}) => `${op2}*${other}/${op1}`,

  // =====================================
  // somme au lieu de produit
  // =====================================

  ({op1,op2,other}) => `${op1}+${op2}/${other}`,

  ({op1,op2,other}) => `${op1}+${other}/${op2}`,

  ({op1,op2,other}) => `${op2}+${other}/${op1}`,

  // =====================================
  // différence
  // =====================================

  ({op1,op2,other}) => `${op1}-${op2}/${other}`,

  ({op1,op2,other}) => `${op2}-${op1}/${other}`,

  // =====================================
  // parenthèses foireuses
  // =====================================

  ({op1,op2,other}) => `${op1}/(${op2}*${other})`,

  ({op1,op2,other}) => `${op2}/(${op1}*${other})`

],

  // =========================
  // FORCE CENTRALE
  // =========================

FORCE_CENTRALE: [

  // =========================
  // CAS MASS (m1 / m2)
  // =========================

  // erreur type inversion produit
  (L, num, den, target, other) =>
    `${L}*${den}^2/(${other}*G)`,

  // oubli du carré
  (L, num, den, target, other) =>
    `${L}*${den}/(${other}*G)`,

  // mauvais placement fraction
  (L, num, den, target, other) =>
    `${L}/(${other}*G*${den}^2)`,

  // inversion m1/m2
  (L, num, den, target, other) =>
    `${L}*${den}^2/(G*${target})`,

  // multiplication au lieu division
  (L, num, den, target, other) =>
    `${L}*${target}*${den}^2`,

  // =========================
  // CAS R (racine)
  // =========================

  // oubli de racine
  (L, num, den, target, other) =>
    `${num[0]}*${num[1]}/${L}`,

  // racine mal placée
  (L, num, den, target, other) =>
    `sqrt(${L}*${den}^2)`,

  // inversion fraction dans racine
  (L, num, den, target, other) =>
    `sqrt(${L}/(${num[0]}*${num[1]}))`,

  // carré au lieu de racine
  (L, num, den, target, other) =>
    `(${num[0]}*${num[1]}/${L})^2`,

  // racine oubliée complète
  (L, num, den, target, other) =>
    `${num[0]}*${num[1]}/${L}`
]


  // =========================
  // POWER (Kepler, Stefan, etc.)
  // =========================
  POWER: [
    (L, A, B, t) => `${L}^(1/${t})`,
    (L, A, B, t) => `(${t})^2`,
    (L, A, B, t) => `${L}*${t}`,
    (L, A, B, t) => `${L}^(1/2)`
  ],

  // =========================
  // PRODUCT + POWER (Ec = 1/2 m v^2)
  // =========================
  PRODUCT_POWER: [
    (L, A, B, t, other) => `${L}/(${other}*${t}^2)`,
    (L, A, B, t, other) => `${L}/${other}`,
    (L, A, B, t, other) => `${t}^2`,
    (L, A, B, t, other) => `${other}*${t}`
  ],

  // =========================
  // LOG (pH, son, etc.)
  // =========================
  LOG: [
    (L, A, B, t) => `10^${t}`,
    (L, A, B, t) => `e^${t}`,
    (L, A, B, t) => `10^(-${t})`,
    (L, A, B, t) => `${t}^2`
  ],

  // =========================
  // EXP (radioactivité)
  // =========================
  EXP: [
    (L, A, B, t) => `ln(${t})`,
    (L, A, B, t) => `log(${t})`,
    (L, A, B, t) => `-ln(${t})`,
    (L, A, B, t) => `e^${t}`
  ],

  // =========================
  // SUM (Bernoulli etc.)
  // =========================
  SUM: [
    (L, A, B, t) => `${L}+${t}`,
    (L, A, B, t) => `${L}-${t}`,
    (L, A, B, t) => `${t}+1`,
    (L, A, B, t) => `${t}*2`
  ],

  // =========================
  // RECIPROCAL SUM (lentilles)
  // =========================
  RECIPROCAL_SUM: [
    (L, A, B, t) => `1/(${L}+${t})`,
    (L, A, B, t) => `${L}+${t}`,
    (L, A, B, t) => `(${t})^(-1)`
  ],

  // =========================
  // FALLBACK
  // =========================
  DEFAULT: [
    (L, A, B, t) => `${L}/${t}`,
    (L, A, B, t) => `${t}*2`,
    (L, A, B, t) => `${t}/2`,
    (L, A, B, t) => `${L}+${t}`,
    (L, A, B, t) => `${L}-${t}`
  ]
};

/* =========================================================
   DISPLAY
========================================================= */

function displayExpr(expr) {

  if (!expr) return "";

  let e = expr;

  // Supprime parenthèses inutiles
  // autour d'un produit simple
  e = e.replace(
    /\(([a-zA-Z0-9_*^]+)\)/g,
    "$1"
  );

  // MAIS garde celles contenant
  // + ou -
  // car nécessaires

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

function normalizeChoice(c) {

  if (!c) return "";

  if (c.includes("=")) return c;

  return `${currentQuestion.target} = ${c}`;
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
    /([^=\/()]+|\([^()]+\))\s*\/\s*\(([^()]+)\)/g,
    "\\frac{$1}{$2}"
  );

  /* Cas 2 : fraction générale */
  out = out.replace(
    /([^=\/()]+|\([^()]+\))\s*\/\s*([^\/()]+|\([^\/()]+\))/g,
    (match, num, den) => {

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
     SQRT
  ========================================================= */

  out = out.replace(
    /sqrt\(([^()]*)\)/g,
    "\\sqrt{$1}"
  );

  out = out.replace(
    /sqrt\{([^{}]*)\}/g,
    "\\sqrt{$1}"
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
   DISPATCHER PRINCIPAL
========================================================= */

function generateDistractors(q, target, correct) {

  const L = q.lhs;
  const A = q.numerator;
  const B = q.denominator;

  let table;

  // =========================
  // CAS FRACTION AVEC CONTEXTE
  // =========================
  if (q.type === EXPRESSION_TYPES.FRACTION) {

    table =
      (target === A)
        ? DISTRACTOR_PATTERNS.FRACTION_NUM
        : DISTRACTOR_PATTERNS.FRACTION_DEN;
  }

  // =========================
  // AUTRES CAS
  // =========================
  else if (q.type === EXPRESSION_TYPES.PRODUCT) {

    table = DISTRACTOR_PATTERNS.PRODUCT;
  }
    // =========================
  // 🔥 CAS CROSS
  // =========================
  else if (q.type === EXPRESSION_TYPES.CROSS) {

    table = DISTRACTOR_PATTERNS.CROSS;

    const left = q.left || [];

    const op1 = left[0] ?? "x";
    const op2 = left[1] ?? "y";

    const allVars = [
      ...(q.left || []),
      ...(q.right || [])
    ];

    const other =
      allVars.find(v => v && v !== target) ?? "k";

    const pool = new Set();

    while (pool.size < 3) {

      const fn =
        table[Math.floor(Math.random() * table.length)];

      let val;

      try {
        val = fn({ op1, op2, other });
      } catch (e) {
        continue;
      }

      if (
        !val ||
        val === correct ||
        val.includes("undefined")
      ) {
        continue;
      }

      pool.add(val);
    }

    return [...pool];
  }

  else {

    table = DISTRACTOR_PATTERNS.DEFAULT;
  }

  const other =
    (q.factors || []).find(f => f !== target);

  const pool = new Set();

  while (pool.size < 3) {

    const fn =
      table[Math.floor(Math.random() * table.length)];

    const val =
      fn(L, A, B, target, other);

    if (val && val !== correct) {
      pool.add(val);
    }
  }

  return [...pool];
}

/* =========================================================
   GENERATE QUESTION
========================================================= */

function cleanChoice(str) {
  if (!str) return "";

  return str
    .replace(/\s*=\s*$/, "")   // enlève "=" final
    .trim();
}

function generateQuestion() {

  const q =
    QUESTIONS[Math.floor(Math.random() * QUESTIONS.length)];

  const target =
    q.targetPool[Math.floor(Math.random() * q.targetPool.length)];

  // 🔥 vraie réponse brute
  const rawCorrect =
    q.answers[target];

  // 🔥 normalisation unique (CRITIQUE)
  const correct =
    cleanExpr(cleanChoice(rawCorrect));

  // 🔥 génération des distracteurs
  let distractors =
    generateDistractors(q, target, correct)
      .map(cleanExpr);

  // 🔥 sécurité absolue : on retire toute collision avec la bonne réponse
  distractors =
    distractors.filter(d => d !== correct);

  // 🔥 on supprime doublons
  distractors =
    [...new Set(distractors)];

  // 🔥 on s’assure qu’on a 3 choix
  while (distractors.length < 3) {
    const fallback =
      genericDistractors(q, target)
        .map(cleanExpr)
        .find(d => d !== correct && !distractors.includes(d));

    if (!fallback) break;

    distractors.push(fallback);
  }

  // 🔥 assemblage final
  let choices = [
    correct,
    ...distractors.slice(0, 3)
  ];

  choices = shuffle(choices);

  currentQuestion = {

    ...q,

    target,

    choices,

    answer: choices.indexOf(correct),

    correct
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

    // 🔥 sécurité : split contrôlé
    let [lhs, rhs] = normalizeChoice(c).split("=");

    lhs = lhs ? lhs.trim() : "";
    rhs = rhs ? rhs.trim() : "";

    // 🔥 fallback critique (évite "U/I =")
    if (!rhs) {
      rhs = ""; // ou "?"
    }

    btn.innerHTML =
      `\\(${toLatex(lhs)} = ${toLatex(rhs)}\\)`;

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
      ${toLatex(q.target)} = ${toLatex(q.answers[q.target])}
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
