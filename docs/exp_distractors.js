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
