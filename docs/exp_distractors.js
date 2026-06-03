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
  // PRODUCT FRACTION
  // =========================
PRODUCT_FRACTION: [
  ({op1,op2,other}) => `${op1}*${op2}*${other}`,
  ({op1,op2,other}) => `\\frac{${other}*${op2}}{${op1}}`,
  ({op1,op2,other}) => `\\frac{${op1}*${other}}{${op2}}`,
  ({op1,op2,other}) => `\\frac{${other}*${op1}}{${op2}}`,
  ({op1,op2,other}) => `${op2}*\\frac{${other}}{${op1}}`,
  ({op1,op2,other}) => `${op1}+\\frac{${op2}}{${other}}`,
  ({op1,op2,other}) => `${op1}-\\frac{${op2}}{${other}}`,
  ({op1,op2,other}) => `${op2}-\\frac{${op1}}{${other}}`,
  ({op1,op2,other}) => `\\frac{${op1}}{${op2}}-${other}`,
  ({op1,op2,other}) => `\\frac{${op2}}{${op1}}+${other}`

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
  // PRODUCT THERMAL
  // =========================
PRODUCT_TH_M: [

  ({L, c, Tf, Ti}) =>
    `\\frac{${c}*(${Tf}-${Ti})}{${L}}`,
  ({L, c, Tf, Ti}) =>
    `\\frac{${L}}{${c}*${Tf}-${Ti}}`,
  ({L, c, Tf, Ti}) =>
    `\\frac{${L}}{${c}+(${Tf}-${Ti})}`,
  ({L, Tf, Ti}) =>
    `\\frac{${c}*${L}}{${Tf}+${Ti}}`,
  ({L, c, Tf, Ti}) =>
    `\\frac{${c}*(${Tf}-${Ti})}{${L}}`,
  ({L, c, Tf, Ti}) =>
    `\\frac{${c}*(${Ti}-${Tf})}{${L}}`
],

PRODUCT_TH_TF: [
  ({L, m, c, Tf, Ti}) =>
    `${Ti}*\\frac{${L}}{${m}*${c}}`,
  ({L, m, c, Tf, Ti}) =>
    `\\frac{Ti}{\\frac{${L}}{${m}*${c}}}`,
  ({L, m, c, Tf, Ti}) =>
    `\\frac{${L}}{${c}*${m}}-${Ti}`],

PRODUCT_TH_TI: [
  ({L, m, c, Tf, Ti}) =>
    `${Tf}*\\frac{${L}}{${m}*${c}}`,
  ({L, m, c, Tf, Ti}) =>
    `\\frac{Tf}{\\frac{${L}}{${m}*${c}}}`,
  ({L, m, c, Tf, Ti}) =>
    `\\frac{${L}}{${c}*${m}}-${Tf}`
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
    `\\left(\\frac{${L}}{${num[0]}*${num[1]}*${num[2]}}\\right)^2`,
  (L, num, den, other) =>
    `\\left(\\frac{${num[0]}*${num[1]}*${num[2]}}{${L}}\\right)^2`,
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
  // ENERGIE JOULE
  // =========================
PRODUCT_JOULE_LINEAR: [

  (L, F1, F2, F3) =>
    `\\frac{${L}}{${F3}*${F2}^2}`,
  (L, F1, F2, F3) =>
    `\\frac{${F3}*${F2}}{${L}}`,
  (L, F1, F2, F3) =>
    `\\frac{${L}}{${F3}*${F2}}`,
  (L, F1, F2, F3) =>
    `${L}*${F2}/${F3}^2`,
  (L, F1, F2, F3) =>
    `\\frac{${F3}^2*${F2}}{${L}}`
],
PRODUCT_JOULE_ROOT: [

  (L, F1, F2, F3) =>
    `\\sqrt{\\frac{${L}}{${F1}^2*${F2}}}`,
  (L, F1, F2, F3) =>
    `\\sqrt{\\frac{${L}}{${F1}*${F2}^2}}`,
  (L, F1, F2, F3) =>
    `\\sqrt{\\frac{${L}^2}{${F1}*${F2}}}`,
  (L, F1, F2, F3) =>
    `\\frac{${L}}{${F1}*${F2}}`,
  (L, F1, F2, F3) =>
    `\\sqrt{{${L}*${F1}*${F2}}}`,
  (L, F1, F2, F3) =>
    `\\frac{\sqrt{${L}}}{${F1}*${F2}}`
],

  // =========================
  // ENERGIE PESANTEUR
  // =========================
ENERGIE_PESANTEUR: [

  (L, C, G, target, other) =>
    `\\frac{${L}+${C}}{${G}*${other}}`,
  (L, C, G, target, other) =>
    `\\frac{${L}-${C}}{${other}}`,
  (L, C, G, target, other) =>
    `\\frac{${C}-${L}}{${G}*${other}}`,
  (L, C, G, target, other) =>
    `${L}-${C}*${G}*${other}`,
  (L, C, G, target, other) =>
    `\\frac{${L}}{${G}*${other}}-${C}`,
  (L, C, G, target, other) =>
    `\\frac{${G}*\\left(${L}-${C}\\right)}{${other}}`

],

  // =========================
  // POWER (Kepler, Stefan, acceleration centripete.)
  // =========================
POWER_ROOT_2: [

  ({L, A, pA, B, pB}) =>
    `\\sqrt{{${L}*${B}^2}}`,

  ({L, A, pA, B, pB}) =>
    `\\sqrt{\\frac{${L}}{${B}}}`,

  ({L, A, pA, B, pB}) =>
    `${L}*${B}`,

  ({L, A, pA, B, pB}) =>
    `\\sqrt{\\frac{${B}}{${L}}}`
],


POWER_ROOT_4: [

  ({L, A, pA, B, pB}) =>
    `\\sqrt{\\frac{${A}}{${L}}}`,

  ({L, A, pA, B, pB}) =>
    `\\sqrt[4]{${L}*${A}}`,

  ({L, A, pA, B, pB}) =>
    `\\left(\\frac{${A}}{${L}}\\right)^4`,

  ({L, A, pA, B, pB}) =>
    `\\sqrt[3]{\\frac{${A}}{${L}}}`
],


POWER_LINEAR_1: [

  ({L, A, pA, B, pB}) =>
    `\\frac{${A}}{${L}}`,

  ({L, A, pA, B, pB}) =>
    `\\frac{${L}}{${A}}`,

  ({L, A, pA, B, pB}) =>
    `\\sqrt{${A}^2*${L}}`,

  ({L, A, pA, B, pB}) =>
    `${A}^${pA}/${L}^2`
],


POWER_LINEAR_3: [

  ({L, A, pA, B, pB}) =>
    `\\sqrt[3]{\\frac{${A}^{${pA}}}{${L}}}`,

  ({L, A, pA, B, pB}) =>
    `\\frac{${A}^{${pA}}}{${L}}`,

  ({L, A, pA, B, pB}) =>
    `\\left(\\frac{${L}}{${A}^{${pA}}}\\right)^3`,

  ({L, A, pA, B, pB}) =>
    `\\sqrt{\\frac{${A}^{${pA}}}{${L}}}`
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
  // LOG (pH)
  // =========================
LOG_PH: [
  (L, B, target) =>
    `\\frac{${B}}{10^{-${L}}}`,
  (L, B, target) =>
    `${L}*10^{${B}}`,
  (L, B, target) =>
    `${L}*10^{-${B}}`,
  (L, B, target) =>
    `\\frac{10^{-${L}}}{${B}}`,
  (L, B, target) =>
    `10^{-${L}}`,
  (L, B, target) =>
    `10^{${L}}`,
  (L, B, target) =>
    `${B}*10^{\\frac{1}{-${L}}}`,
  (L, B, target) =>
    `${B}*e^{-{${L}}}`
],

// =========================
  // LOG (son)
  // =========================
LOG_INTENSITE: [
  (L, B, target) =>
    `\\frac{${B}}{10^{-${L}}}`,
  (L, B, target) =>
    `${L}*10^{${B}}`,
  (L, B, target) =>
    `${L}*10^{-${B}}`,
  (L, B, target) =>
    `\\frac{10^{-${L}}}{${B}}`,
  (L, B, target) =>
    `${B}*10^{-${L}}`,
  (L, B, target) =>
    `${B}*10^{${L}}`,
  (L, B, target) =>
    `${B}*10^{\\frac{-${L}}{10}}`,
  (L, B, target) =>
    `${B}*10^{\\frac{1}{-${L}}}`,
  (L, B, target) =>
    `${B}*e^{-{${L}}}`
],

  // =========================
  // RADIOACTIVITE
  // =========================
RADIOACTIVITE: [

  (L, B, target, other) =>
    `\\frac{1}{${other}}*ln\\left(\\frac{${L}}{${B}}\\right)`,
  (L, B, target, other) =>
    `-${other}*ln\\left(\\frac{${L}}{${B}}\\right)`,
  (L, B, target, other) =>
    `-${other}*ln\\left(\\frac{${L}}{${B}}\\right)`,
  (L, B, target, other) =>
    `-\\frac{1}{${other}}*ln\\left(\\frac{${B}}{${L}}\\right)`,
  (L, B, target, other) =>
    `\\frac{ln(${L})-ln(${B})}{${other}}`
],

  // =========================
  // BERNOUILLI
  // =========================
BERNOULLI_V: [

  ({ k, P, rho, g, z }) =>
    `\\sqrt{\\frac{k - P - rho*g*z}{rho}}`,
  ({ k, P, rho, g, z }) =>
     '\\frac{2*\\left( k-P - rho*g*z \\right)}{{rho}}',
  ({ k, P, rho, g, z }) =>
    `\\sqrt{\\frac{2(k - P + rho*g*z)}{rho}}`,
  ({ k, P, rho, g, z }) =>
    `\\sqrt{{2 \\left( k - P - rho*g*z \\right)}}`,
  ({ k, P, rho, g, z }) =>
    `\\sqrt{\\frac{P - k - rho*g*z}{rho}}`,
  ({ k, P, rho, g, z }) =>
    `\\sqrt{\\frac{2(k - P - rho*g*z)}{rho}^{2}}`
],
BERNOULLI_Z: [

  ({ k, P, rho, g, v }) =>
    `\\frac{k - P}{rho*g}`,
  ({ k, P, rho, g, v }) =>
    `\\frac{k - P + \\frac{1}{2}rho*v^2}{rho*g}`,
  ({ k, P, rho, g, v }) =>
    `\\frac{k - P - \\frac{1}{2}rho*v^2}{rho}`,
  ({ k, P, rho, g, v }) =>
    `\\frac{k + P - \\frac{1}{2}rho*v^2}{rho*g}`,
  ({ k, P, rho, g, v }) =>
    `\\frac{k - \\frac{1}{2}rho*v^2}{rho*g}`,
  ({ k, P, rho, g, v }) =>
    `\\frac{k - P - \\frac{1}{2}rho*v}{g}`
],

  // =========================
  // RECIPROCAL SUM (lentilles)
  // =========================
RECIPROCAL_F: [

  ({do_,di_}) => `\\frac{${do_}*${di_}}{${do_}+${di_}}`,
  ({do_,di_}) => `\\frac{${do_}-${di_}}{${do_}*${di_}}`,
  ({do_,di_}) => `\\frac{${do_}*${di_}}{${di_}-${do_}}`,
  ({do_,di_}) => `${do_}*${di_}`,
  ({do_,di_}) => `\\frac{1}{${di_}-${do_}}`,
  ({do_,di_}) => `${do_}+${di_}`
],

RECIPROCAL_DO: [

  ({f,di}) => `\\frac{di*f}{f+di}`,
  ({f,di}) => `\\frac{f-di}{di*f}`,
  ({f,di}) => `\\frac{di*f}{di-f}`,
  ({f,di}) => `di*f`,
  ({f,di}) => `\\frac{1}{f-di}`,
  ({f,di}) => `${f}+${di}`
],

RECIPROCAL_DI: [

  ({f,do_}) => `\\frac{f*${do_}}{f-${do_}}`,
  ({f,do_}) => `\\frac{f-${do_}}{f*${do_}}`,
  ({f,do_}) => `\\frac{f*${do_}}{${do_}-f}`,
  ({f,do_}) => `${f}*${do_}`,
  ({f,do_}) => `\\frac{1}{f+${do_}}`,
  ({f,do_}) => `${f}+${do_}`
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

    case "product_fraction":
      return handleProductFraction(q, target, correct);

    case "product_triple":
      return handleProductTriple(q, target, correct);

    case "product_thermal":
      return handleThermal(q, target, correct);

    case "cross":
      return handleCross(q, target, correct);

    case "force_centrale":
      return handleForce(q, target, correct);

    case "doppler":
      return handleDoppler(q, target, correct);

    case "energie_joule":
      return handleEnergieJoule(q, target, correct);

    case "energie_pesanteur":
      return handleEnergiePesanteur(q, target, correct);

    case "radioactivite":
      return handleRadioactivite(q, target, correct);

    case "log_pH":
      return handlePH(q, target, correct);

    case "log_intensite":
      return handleLogIntensite(q, target, correct);

    case "power":
      return handlePower(q, target, correct);

    case "bernouilli":
      return handleBernoulli(q, target, correct);

    case "reciprocical_sum":
      return handleReprocical(q,target,correct);

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

    const open =
      (val.match(/\(/g) || []).length;

    const close =
      (val.match(/\)/g) || []).length;

    if (open !== close) {
      console.warn("❌ parenthèses invalides :", val);
      continue;
    }

    if (val === correct) {
      console.warn("❌ égal à la bonne réponse");
      continue;
    }

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
  // PRODUCT THERMAL
  // =========================

function handleThermal(q, target, correct) {

  const ctx = {
    L: q.lhs,
    m: q.factors?.[0],
    c: q.factors?.[1],
    Tf: q.temp?.[0],
    Ti: q.temp?.[1]
  };

  let table;

  if (target === "m") {
    table = DISTRACTOR_PATTERNS.PRODUCT_TH_M;
  }

  else if (target === "Tf") {
    table = DISTRACTOR_PATTERNS.PRODUCT_TH_TF;
  }

  else if (target === "Ti") {
    table = DISTRACTOR_PATTERNS.PRODUCT_TH_TI;
  }

  const pool = new Set();
  let attempts = 0;

  while (pool.size < 3 && attempts < 60) {

    attempts++;

    const fn = table[Math.floor(Math.random() * table.length)];

    let val;

    try {
      val = fn(ctx);
    } catch (e) {
      console.warn("fn error:", e);
      continue;
    }

    if (typeof val !== "string") continue;
    if (val.includes("undefined")) continue;
    if (val === correct) continue;
    if (val.includes(target)) continue;

    pool.add(val);
  }

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
  // PRODUCT FRACTION
  // =========================
function handleProductFraction(q, target, correct) {

  const table = DISTRACTOR_PATTERNS.PRODUCT_FRACTION;

  const left = q.left || [];
  const right = q.right || [];

  const inLeft = left.includes(target);
  const inRight = right.includes(target);

  // 🔴 sécurité : si target n'est nulle part, on stoppe
  if (!inLeft && !inRight) {
    console.warn("❌ target absent de left et right :", target);
    return [];
  }

  const pool = new Set();
  let attempts = 0;

  while (pool.size < 3 && attempts < 50) {
    attempts++;

    const fn = table[Math.floor(Math.random() * table.length)];

    let val;

    try {

      let op1, op2, other;

      if (inLeft) {
        other = left.find(v => v !== target) ?? "a";
        op1 = right[0] ?? "x";
        op2 = right[1] ?? "y";
      } else {
        other = right.find(v => v !== target) ?? "a";
        op1 = left[0] ?? "x";
        op2 = left[1] ?? "y";
      }

      val = fn({ op1, op2, other });

    } catch {
      continue;
    }

    if (!val) continue;
    if (val === correct) continue;
    if (typeof val === "string" && val.includes("undefined")) continue;

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
  // ENERGIE JOULE CINETIQUE
  // =========================
function handleEnergieJoule(q, target, correct) {

  const L = q.lhs;
  const factors = q.factors || [];
  const F3 = q.poweredVar;

  let table;
  let F1;
  let F2;

  if (target === F3) {

    table = DISTRACTOR_PATTERNS.PRODUCT_JOULE_ROOT;

    F1 = factors[0] ?? target;
    F2 = factors[1] ?? factors.find(f => f !== target) ?? target;
  }

  else {

    table = DISTRACTOR_PATTERNS.PRODUCT_JOULE_LINEAR;

    F1 = target;

    F2 =
      factors.find(f => f !== target) ??
      target;
  }

  const pool = new Set();
  let attempts = 0;

  while (pool.size < 3 && attempts < 60) {

    attempts++;

    const fn =
      table[Math.floor(Math.random() * table.length)];

    let val;

    try {
      val = fn(L, F1, F2, F3);
    } catch {
      continue;
    }

    if (!val) continue;
    if (typeof val !== "string") continue;
    if (val.includes("undefined")) continue;
    if (val === correct) continue;

    pool.add(val);
  }

  return [...pool];
}

  // =========================
  // ENERGIE POTENTIELLE
  // =========================
function handleEnergiePesanteur(q, target, correct) {

  const L = q.lhs;

  const C = q.constant;

  const G =
    q.factors.find(v => v === "g");

  const other =
    q.targetPool.find(v => v !== target);

  const table =
    DISTRACTOR_PATTERNS.ENERGIE_PESANTEUR;

  const pool = new Set();

  let attempts = 0;

  while (pool.size < 3 && attempts < 60) {

    attempts++;

    const fn =
      table[Math.floor(Math.random() * table.length)];

    let val;

    try {

      val = fn(
        L,
        C,
        G,
        target,
        other
      );

    } catch {

      continue;
    }

    if (!val) continue;

    if (val === correct) continue;

    if (val.includes("undefined")) continue;

    pool.add(val);
  }

  return [...pool];
}

  // =========================
  // REPROCICAL SUM
  // =========================
function handleReprocical(q,target,correct){

  let table;
  let ctx;

  if(target==="f"){
    table = DISTRACTOR_PATTERNS.RECIPROCAL_F;
    ctx = { do_:"do", di_:"di" };
  }

  else if(target==="do"){
    table = DISTRACTOR_PATTERNS.RECIPROCAL_DO;
    ctx = { f:"f", di:"di" };
  }

  else if(target==="di"){
    table = DISTRACTOR_PATTERNS.RECIPROCAL_DI;
    ctx = { f:"f", do_:"do" };
  }

  if(!table) return [];

  const pool = new Set();
  let attempts = 0;

  while(pool.size < 3 && attempts < 50){

    attempts++;

    const fn =
      table[Math.floor(Math.random()*table.length)];

    let val;

    try{
      val = fn(ctx);
    }
    catch{
      continue;
    }

    if(!val) continue;
    if(val === correct) continue;
    if(val.includes("undefined")) continue;

    pool.add(val);
  }

  return [...pool];
}

  // =========================
  // RADIOACTIVITE
  // =========================
function handleRadioactivite(q, target, correct) {

  const L = q.lhs;

  const B = q.base;

  const other =
    q.targetPool.find(v => v !== target);

  const table =
    DISTRACTOR_PATTERNS.RADIOACTIVITE;

  const pool = new Set();

  let attempts = 0;

  while (pool.size < 3 && attempts < 60) {

    attempts++;

    const fn =
      table[Math.floor(Math.random() * table.length)];

    let val;

    try {

      val = fn(
        L,
        B,
        target,
        other
      );

    } catch {

      continue;
    }

    if (!val) continue;

    if (val === correct) continue;

    if (val.includes("undefined")) continue;

    pool.add(val);
  }

  return [...pool];
}

  // =========================
  // LOG PH
  // =========================
function handlePH(q, target, correct) {

  const L = q.lhs;
  const C0 = "C0";

  const table = DISTRACTOR_PATTERNS.LOG_PH;

  const pool = new Set();

  let attempts = 0;

  while (pool.size < 3 && attempts < 60) {

    attempts++;

    const fn =
      table[Math.floor(Math.random() * table.length)];

    let val;

    try {

      val = fn(L, C0, target);

    } catch {
      continue;
    }

    if (!val) continue;
    if (val === correct) continue;

    if (val.includes("undefined")) continue;

    pool.add(val);
  }

  return [...pool];
}

  // =========================
  // LOG INTENSITE
  // =========================
function handleLogIntensite(q, target, correct) {

  const L = q.lhs;
  const C0 = "I0";

  const table = DISTRACTOR_PATTERNS.LOG_INTENSITE;

  const pool = new Set();

  let attempts = 0;

  while (pool.size < 3 && attempts < 60) {

    attempts++;

    const fn =
      table[Math.floor(Math.random() * table.length)];

    let val;

    try {

      val = fn(L, C0, target);

    } catch {
      continue;
    }

    if (!val) continue;
    if (val === correct) continue;

    if (val.includes("undefined")) continue;

    pool.add(val);
  }

  return [...pool];
}

  // =========================
  // POWER KEPLER STEFAN CENTRI
  // =========================
function handlePower(q, target, correct) {

  const ctx = {
    L: q.lhs,
    A: q.numerator,
    pA: q.numPower,
    B: q.denominator,
    pB: q.denPower
  };

  let table = null;

  // =========================
  // CAS NUMERATEUR
  // =========================
  if (target === q.numerator) {

    if (q.numPower === 2) {
      table = DISTRACTOR_PATTERNS.POWER_ROOT_2;
    }

    else if (q.numPower === 4) {
      table = DISTRACTOR_PATTERNS.POWER_ROOT_4;
    }

    else {
      table = DISTRACTOR_PATTERNS.POWER_LINEAR_1;
    }
  }

  // =========================
  // CAS DENOMINATEUR (R)
  // =========================
  else if (target === q.denominator) {

    if (q.denPower === 1) {
      table = DISTRACTOR_PATTERNS.POWER_LINEAR_1;
    }

    else if (q.denPower === 2) {
      table = DISTRACTOR_PATTERNS.POWER_LINEAR_2; // 👈 TON CAS
    }

    else if (q.denPower === 3) {
      table = DISTRACTOR_PATTERNS.POWER_LINEAR_3;
    }

    else if (q.denPower === 4) {
      table = DISTRACTOR_PATTERNS.POWER_ROOT_4;
    }
  }

  // =========================
  // FALLBACK
  // =========================
  else {
    table = DISTRACTOR_PATTERNS.POWER_LINEAR_1;
  }

  // sécurité : évite crash si table non définie
  if (!table || table.length === 0) return [];

  const pool = new Set();
  let attempts = 0;

  while (pool.size < 3 && attempts < 50) {

    attempts++;

    const fn = table[Math.floor(Math.random() * table.length)];

    let val;
    try {
      val = fn(ctx);
    } catch {
      continue;
    }

    if (!val) continue;
    if (val === correct) continue;
    if (typeof val === "string" && val.includes("undefined")) continue;

    pool.add(val);
  }

  return [...pool];
}

  // =========================
  // BERNOUILLI
  // =========================
function handleBernoulli(q, target, correct) {

  const ctx = {
    k: q.k,
    P: q.P,
    rho: q.rho,
    g: q.g,
    v: q.v,
    z: q.z
  };

  let table = null;

  if (target === "v") {
    table = DISTRACTOR_PATTERNS.BERNOULLI_V;
  }

  else if (target === "z") {
    table = DISTRACTOR_PATTERNS.BERNOULLI_Z;
  }

  if (!table) return [];

  const pool = new Set();
  let attempts = 0;

  while (pool.size < 3 && attempts < 50) {

    attempts++;

    const fn = table[Math.floor(Math.random() * table.length)];

    let val;

    try {
      val = fn(ctx);
    } catch {
      continue;
    }

    if (!val) continue;
    if (val === correct) continue;

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
