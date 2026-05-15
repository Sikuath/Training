import { EXPRESSION_TYPES } from "./exp_types.js";
export const DISTRACTOR_PATTERNS = {

  // =========================
  // FRACTION
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
  // PRODUCT
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
  // PRODUCT TRIPLE
  // =========================
  PRODUCT_T: [
  ({L, op1, op2, op3}) => `\\frac{${L}}{${op1}}`,

  ({L, op1, op2, op3}) => `\\frac{${L}}{${op2}}`,

  ({L, op1, op2, op3}) => `\\frac{${L}}{${op1}*${op2}*${op3}}`,

  ({L, op1, op2, op3}) => `${L}*${op1}*${op2}`,

  ({L, op1, op2, op3}) => `${op1}*\\frac{${op2}}{${op3}}`,

  ({L, op1, op2, op3}) => `\\frac{${op1}}{${op2}}*${L}`,

  ({L, op1, op2, op3}) => `${op1}+${op2}*${op3}`,

  ({L, op1, op2, op3}) => `\\frac{${L}}{${op1}}*${op2}`,

  ({L, op1, op2, op3}) => `\\frac{${L}}{${op1}+${op2}}`
 ],

// =========================
// CROSS
// =========================
CROSS: [
  ({op1,op2,other}) => `${op1}*${op2}*${other}`,

  ({op1,op2,other}) => `\\frac{${other}}{${op1}}*${op2}`,

  ({op1,op2,other}) => `\\frac{${op1}}{${op2}}*${other}`,

  ({op1,op2,other}) => `\\frac{${op2}}{${op1}}*${other}`,

  ({op1,op2,other}) => `${op1}*\\frac{${other}}{${op2}}`,

  ({op1,op2,other}) => `${op2}*\\frac{${other}}{${op1}}`,

  ({op1,op2,other}) => `${op1}+\\frac{${op2}}{${other}}`,

  ({op1,op2,other}) => `${op1}+\\frac{${other}}{${op2}}`,

  ({op1,op2,other}) => `${op2}+\\frac{${other}}{${op1}}`,

  ({op1,op2,other}) => `${op1}-\\frac{${op2}}{${other}}`,

  ({op1,op2,other}) => `${op2}-\\frac{${op1}}{${other}}`,

  ({op1,op2,other}) => `\\frac{${op1}}{${op2}}-${other}`,

  ({op1,op2,other}) => `\\frac{${op2}}{${op1}}+${other}`
],

  // =========================
  // FORCE CENTRALE
  // =========================

  FORCE_CENTRALE_M: [
  (L, num, den, target, other) =>
    `${L}*${den}^2/(${other}+${num[0]})`,
  (L, num, den, target, other) =>
    `${L}/(${other}*${num[0]}*${den}^2)`,
  (L, num, den, target, other) =>
    `${L}*${other}*${den}^2/${num[0]}`,
  (L, num, den, target, other) =>
    `${L}-${den}^2/${other}*${num[0]}`,
  (L, num, den, target, other) =>
    `${other}*${num[0]}/${L}-${den}^2`,
  (L, num, den, target, other) =>
    `${other}+${L}/${num[0]}-${den}^2`
],

  FORCE_CENTRALE_R: [
  (L, num, den, other) =>
    `sqrt(${L}/${num[0]}*${num[1]}*${num[2]})`,
  (L, num, den, other) =>
    `(${L}/${num[0]}*${num[1]}*${num[2]})^2`,
  (L, num, den, other) =>
    `(${num[0]}*${num[1]}*${num[2]}/${L})^2`,
  (L, num, den, other) =>
    `sqrt(1/${L}-${num[0]}*${num[1]}*${num[2]})`,
  (L, num, den, other) =>
    `sqrt(1/${num[0]}*${num[1]}*${num[2]}-${L})`
],

  // =========================
  // DOPPLER
  // =========================
DOPPLER_F: [

  (f, fp, v, vr, vs) =>
    `${fp}*\\frac{v+v_s}{v-v_r}`,

  (f, fp, v, vr, vs) =>
    `${fp}*\\frac{v+v_r}{v-v_s}`,

  (f, fp, v, vr, vs) =>
    `${fp}*\\frac{v+v_s}{(v+v_r)^2}`,

  (f, fp, v, vr, vs) =>
    `${fp}*\\frac{v+v_s}{v-v_r}`,

  (f, fp, v, vr, vs) =>
    `${fp}*\\frac{v+v_r+v_s}{v}`
],

DOPPLER_V: [

  (f, fp, v, vr, vs) =>
    `f'*\\frac{v+v_s}{f} - v_r`,

  (f, fp, v, vr, vs) =>
    `\\frac{f'*v_r+f*v_s}{f-f'}`,

  (f, fp, v, vr, vs) =>
    `\\frac{f'*v_r-f*v_s}{f+f'}`,

  (f, fp, v, vr, vs) =>
    `\\frac{f-f'}{f'*v_r-f*v_s}`,

  (f, fp, v, vr, vs) =>
    `f'*\\frac{(f' + v_r)(v+v_s)}{f}`,

  (f, fp, v, vr, vs) =>
    `f'*\\frac{v+v_s-v_r}{f}`,

  (f, fp, v, vr, vs) =>
    `f*\\frac{v+v_s}{f' + v_r}`
],
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

export function generateDistractors(q, target, correct) {

  switch (q.type) {

    case "fraction":
      return handleFraction(q, target, correct);

    case "product":
      return handleProduct(q, target, correct);

    case "product_triple":
      return handleProductTriple(q, target, correct);

    case "cross":
      return handleCross(q, target, correct);

    case "force_centrale":
      return handleForce(q, target, correct);

    case "doppler":
      return handleDoppler(q, target, correct);

    default:
      return handleDefault(q, target, correct);
  }
}

  // =========================
  // PRODUCT
  // =========================

function handleProduct(q, target, correct) {

  const L = q.lhs;

  const other =
    (q.factors || [])
      .find(f => f !== target) ?? "x";

  const table =
    DISTRACTOR_PATTERNS.PRODUCT;

  return generateFromTable(
    table,
    [L, null, null, target, other],
    correct
  );
}

  // =========================
  // PRODUCT TRIPLE
  // =========================

function handleProductTriple(q, target, correct) {

  console.group("🧪 PRODUCT_TRIPLE DEBUG");

  // =========================
  // sécurité question
  // =========================

  if (!q) {
    console.error("❌ q est null");
    console.groupEnd();
    return [];
  }

  if (!q.factors || q.factors.length < 3) {
    console.error("❌ factors invalides :", q.factors);
    console.groupEnd();
    return [];
  }

  const table = DISTRACTOR_PATTERNS.PRODUCT_T;

  if (!table || !Array.isArray(table)) {
    console.error("❌ PRODUCT_T manquant");
    console.groupEnd();
    return [];
  }

  const L = q.lhs;

  const [
    op1 = "x",
    op2 = "y",
    op3 = "z"
  ] = q.factors;

  console.log("QUESTION :", q);

  console.log("VARIABLES :", {
    L,
    op1,
    op2,
    op3,
    target,
    correct
  });

  const pool = new Set();

  let attempts = 0;

  while (pool.size < 3 && attempts < 50) {

    attempts++;

    const fn =
      table[Math.floor(Math.random() * table.length)];

    let val;

    try {

      val = fn({
        L,
        op1,
        op2,
        op3
      });

    } catch (e) {

      console.warn("⚠️ erreur fonction :", e);

      continue;
    }

    console.log(`➡️ tentative ${attempts} :`, val);

    // =========================
    // sécurités
    // =========================

    if (!val) {
      console.warn("❌ valeur vide");
      continue;
    }

    if (typeof val !== "string") {
      console.warn("❌ pas une string :", val);
      continue;
    }

    if (val.includes("undefined")) {
      console.warn("❌ contient undefined :", val);
      continue;
    }

    // parenthèses incohérentes
    const open =
      (val.match(/\(/g) || []).length;

    const close =
      (val.match(/\)/g) || []).length;

    if (open !== close) {
      console.warn("❌ parenthèses invalides :", val);
      continue;
    }

    // bonne réponse interdite
    if (val === correct) {
      console.warn("❌ égal à la bonne réponse");
      continue;
    }

    // évite la variable cible seule
    if (
      val === target ||
      val === `\\frac{${L}}{${target}}`
    ) {
      console.warn("❌ contient cible triviale :", val);
      continue;
    }

    pool.add(val);
  }

  console.log("🎯 POOL FINAL :", [...pool]);

  console.groupEnd();

  return [...pool];
}

  // =========================
  // FRACTION
  // =========================

function handleFraction(q, target, correct) {

  const L = q.lhs;
  const A = q.numerator;
  const B = q.denominator;

  const table =
    (target === A)
      ? DISTRACTOR_PATTERNS.FRACTION_NUM
      : DISTRACTOR_PATTERNS.FRACTION_DEN;

  return generateFromTable(table, [L, A, B], correct);
}

  // =========================
  // CROSS
  // =========================

function handleCross(q, target, correct) {

  const table = DISTRACTOR_PATTERNS.CROSS;

  const left = q.left || [];
  const right = q.right || [];

  const pool = new Set();
  let attempts = 0;

  while (pool.size < 3 && attempts < 50) {
    attempts++;

    const fn = table[Math.floor(Math.random() * table.length)];

    let val;

    try {

      // =========================
      // 🔥 CAS 1 : target à gauche
      // =========================
      if (left.includes(target)) {

        const op3 = left.find(v => v !== target) ?? "a"; // reste gauche
        const op1 = right[0] ?? "x";
        const op2 = right[1] ?? "y";

        val = fn({
          op1,
          op2,
          other: op3
        });

      // =========================
      // 🔥 CAS 2 : target à droite
      // =========================
      } else {

        const op3 = right.find(v => v !== target) ?? "a";
        const op1 = left[0] ?? "x";
        const op2 = left[1] ?? "y";

        val = fn({
          op1,
          op2,
          other: op3
        });
      }

    } catch {
      continue;
    }

    if (!val) continue;
    if (val === correct) continue;

    // 🔥 filtre anti-boucle variable cible
    if (typeof val === "string" && val.includes(target)) continue;

    pool.add(val);
  }

  return [...pool];
}

  // =========================
  // FORCE CENTRALE
  // =========================
function handleForce(q, target, correct) {

  const L = q.lhs;
  const num = q.numerator || [];
  const den = q.denominator;
  const pow = q.denominatorPower ?? 2;

  const isRadius = target === "r";

  const table = isRadius
    ? DISTRACTOR_PATTERNS.FORCE_CENTRALE_R
    : DISTRACTOR_PATTERNS.FORCE_CENTRALE_M;

  const other =
    (q.targetPool || []).find(v => v !== target) ?? "x";

  const pool = new Set();

  while (pool.size < 3) {

    const fn = table[Math.floor(Math.random() * table.length)];

    let val;

    try {
      val = isRadius
        ? fn(L, num, den, other)
        : fn(L, num, den, target, other, pow);

    } catch {
      continue;
    }

    if (!val || val === correct || val.includes("undefined")) continue;

    pool.add(val);
  }

  return [...pool];
}

  // =========================
  // DOPPLER
  // =========================
function handleDoppler(q, target, correct) {

  const f = "f";
  const fp = "f'";
  const v = "v";
  const vr = "vr";
  const vs = "vs";

  const isF = target === "f";

  const table = isF
    ? DISTRACTOR_PATTERNS.DOPPLER_F
    : DISTRACTOR_PATTERNS.DOPPLER_V;

  const pool = new Set();

  while (pool.size < 3) {

    const fn = table[Math.floor(Math.random() * table.length)];

    let val;

    try {
      val = fn(f, fp, v, vr, vs);
    } catch {
      continue;
    }

    if (!val || val === correct || val.includes("undefined")) continue;

    pool.add(val);
  }

  return [...pool];
}

// =========================
  // DEFAULT
  // =========================
function handleDefault(q, target, correct) {

  const L = q.lhs;
  const A = q.numerator;
  const B = q.denominator;

  const table = DISTRACTOR_PATTERNS.DEFAULT;

  return generateFromTable(table, [L, A, B, target], correct);
}

  // =========================
  // HELPER COMMUN
  // =========================
function generateFromTable(table, args, correct) {

  const pool = new Set();

  while (pool.size < 3) {

    const fn = table[Math.floor(Math.random() * table.length)];

    let val;

    try {
      val = fn(...args);
    } catch {
      continue;
    }

    if (!val || val === correct || val.includes("undefined")) continue;

    pool.add(val);
  }

  return [...pool];
}

