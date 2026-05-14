import { EXPRESSION_TYPES } from "./exp_types.js";
export const DISTRACTOR_PATTERNS = {

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

    case "cross":
      return handleCross(q, target, correct);

    case "force_centrale":
      return handleForce(q, target, correct);

    default:
      return handleDefault(q, target, correct);
  }
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

  const op1 = left[0] ?? "x";
  const op2 = left[1] ?? "y";

  const allVars = [...(q.left || []), ...(q.right || [])];

  const other = allVars.find(v => v && v !== target) ?? "k";

  const pool = new Set();

  while (pool.size < 3) {

    const fn = table[Math.floor(Math.random() * table.length)];

    let val;

    try {
      val = fn({ op1, op2, other });
    } catch {
      continue;
    }

    if (!val || val === correct || val.includes("undefined")) continue;

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

