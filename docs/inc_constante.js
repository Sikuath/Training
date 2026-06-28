// =========================
// CONTEXTE PHYSIQUE GLOBAL
// =========================

const PHYSICS_CONTEXT = {

  t: {
    label: "Temps",
    variable: "t",
    unit: "s",
    instrument: "./images/chronometre.png",
    domain: "Mécanique"
  },

  L: {
    label: "Longueur",
    variable: "L",
    unit: "m",
    instrument: "./images/regle.png",
    domain: "Mécanique"
  },

  m: {
    label: "Masse",
    variable: "m",
    unit: "kg",
    instrument: "./images/balance.png",
    domain: "Mécanique"
  },

  U: {
    label: "Tension",
    variable: "U",
    unit: "V",
    instrument: "./images/voltmetre.png",
    domain: "Electricité"
  },

  I: {
    label: "Intensité",
    variable: "I",
    unit: "A",
    instrument: "./images/amperemetre.png",
    domain: "Electricité"
  },

  F: {
    label: "Force",
    variable: "F",
    unit: "N",
    instrument: "./images/dynamometre.png",
    domain: "Mécanique"
  },

  E: {
    label: "Énergie",
    variable: "E",
    unit: "J",
    instrument: "./images/calorimetre.png",
    domain: "Energie"
  },

  pH: {
    label: "pH",
    variable: "pH",
    unit: "",
    instrument: "./images/phmetre.png",
    domain: "Chimie"
  },

  sigma: {
    label: "Conductivité",
    variable: "σ",
    unit: "S·m⁻¹",
    instrument: "./images/conductimetre.png",
    domain: "Chimie"
  },

  P: {
    label: "Pression",
    variable: "P",
    unit: "Pa",
    instrument: "./images/manometre.jpg",
    domain: "Fluides"
  }
};

const ALLOWED_UNITS = {
  typeA: ["t", "L", "m", "U", "I", "pH", "sigma"],
  typeB: ["U", "I", "x", "t"],
  typeC: ["m", "x", "t", "F"]
};

// =========================
// TYPE B - RELATIONS TP TERMINALE
// =========================

const TYPE_B_RELATIONS = [

  // =========================
  // CINÉMATIQUE (chronométrage)
  // =========================
  {
    label: "Vitesse moyenne",
    instrument: "./images/vitesse.jpg",
    domain: "Mécanique",
    variable: "v",
    unit: "m·s⁻¹",
    relationText: "v = \\frac{d}{\\Delta t}",
    relationInc: "\\frac{u(V)}{v} = \\sqrt{ \\left( \\frac{u(D)}{D} \\right)^2+ \\left( \\frac{u(Δt)}{Δt} \\right)^2}",
    inputs: [
      { variable: "d", unit: "m" },
      { variable: "Δt", unit: "s" }
    ],

    formula: (d, dt) => d / dt,

    uncertainty: (d, ud, dt, udt) =>
      Math.abs(d / dt) * Math.sqrt(
        (ud / d) ** 2 +
        (udt / dt) ** 2
      )
  },

  // =========================
  // LOI D'OHM (TP classique)
  // =========================
  {
    label: "Résistance électrique",
    instrument: "./images/ohm.jpg",
    domain: "Electricité",
    variable: "R",
    unit: "Ω",
    relationText: "R = \\frac{U}{I}",
    relationInc: "\\frac{u(R)}{R} = \\sqrt{ \\left( \\frac{u(U)}{U} \\right)^2+ \\left( \\frac{u(I)}{I} \\right)^2}",
    inputs: [
      { variable: "U", unit: "V" },
      { variable: "I", unit: "A" }
    ],

    formula: (U, I) => U / I,

    uncertainty: (U, uU, I, uI) =>
      Math.abs(U / I) * Math.sqrt(
        (uU / U) ** 2 +
        (uI / I) ** 2
      )
  },

  // =========================
  // PUISSANCE ÉLECTRIQUE (TP)
  // =========================
  {
    label: "Puissance électrique",
    instrument: "./images/puissance.jpg",
    domain: "Electricité",
    variable: "P",
    unit: "W",
    relationText: "P = U \\times I",
    relationInc: "\\frac{u(P)}{P} = \\sqrt{ \\left( \\frac{u(U)}{U} \\right)^2+ \\left( \\frac{u(I)}{I} \\right)^2}",
    inputs: [
      { variable: "U", unit: "V" },
      { variable: "I", unit: "A" }
    ],

    formula: (U, I) => U * I,

    uncertainty: (U, uU, I, uI) =>
      Math.abs(U * I) * Math.sqrt(
        (uU / U) ** 2 +
        (uI / I) ** 2
      )
  },

  // =========================
  // ENERGIE ÉLECTRIQUE (TP compteur / lampe)
  // =========================
  {
    label: "Énergie électrique",
    instrument: "./images/puissance.jpg",
    domain: "Electricité",
    variable: "ΔE",
    unit: "J",
    relationText: "ΔE = P \\times Δt",
    relationInc: "\\frac{u(ΔE)}{ΔE} = \\sqrt{ \\left( \\frac{u(P)}{P} \\right)^2+ \\left( \\frac{u(Δt)}{Δt} \\right)^2}",
    inputs: [
      { variable: "P", unit: "W" },
      { variable: "Δt", unit: "s" }
    ],

    formula: (P, dt) => P * dt,

    uncertainty: (P, uP, dt, udt) =>
      Math.abs(P * dt) * Math.sqrt(
        (uP / P) ** 2 +
        (udt / dt) ** 2
      )
  },

  // =========================
  // MASSE VOLUMIQUE (TP solide/liquide)
  // =========================
  {
    label: "Masse volumique",
    instrument: "./images/masse_volumique.jpg",
    domain: "Chimie",
    variable: "ρ",
    unit: "kg·m⁻³",
    relationText: "ρ = \\frac{m}{V}",
    relationInc: "\\frac{u(ρ)}{ρ} = \\sqrt{ \\left( \\frac{u(m)}{m} \\right)^2+ \\left( \\frac{u(V)}{V} \\right)^2}",
    inputs: [
      { variable: "m", unit: "kg" },
      { variable: "V", unit: "m³" }
    ],

    formula: (m, V) => m / V,

    uncertainty: (m, um, V, uV) =>
      Math.abs(m / V) * Math.sqrt(
        (um / m) ** 2 +
        (uV / V) ** 2
      )
  },

  // =========================
  // ACCELERATION MOYENNE
  // =========================
  {
  label: "Accélération moyenne",
  instrument: "./images/acceleration.jpg",
  domain: "Mécanique",
  variable: "a",
  unit: "m·s⁻²",
  relationText: "a = \\frac{\\Delta v}{\\Delta t}",
  relationInc: "\\frac{u(a)}{a}=\\sqrt{\\left(\\frac{u(\\Delta v)}{\\Delta v}\\right)^2+\\left(\\frac{u(\\Delta t)}{\\Delta t}\\right)^2}",
  inputs: [
    { variable: "Δv", unit: "m·s⁻¹" },
    { variable: "Δt", unit: "s" }
  ],

  formula: (dv, dt) => dv / dt,

  uncertainty: (dv, udv, dt, udt) =>
    Math.abs(dv / dt) *
    Math.sqrt(
      (udv / dv) ** 2 +
      (udt / dt) ** 2
    )
},

  // =========================
  // GRANDISSEMENT
  // =========================
{
  label: "Grandissement",
  instrument: "./images/lens.jpg",
  domain: "Optique",
  variable: "γ",
  unit: "",
  relationText: "\\gamma = \\frac{A'B'}{AB}",
  relationInc: "\\frac{u(\\gamma)}{\\gamma}=\\sqrt{\\left(\\frac{u(A'B')}{A'B'}\\right)^2+\\left(\\frac{u(AB)}{AB}\\right)^2}",
  inputs: [
    { variable: "A'B'", unit: "cm" },
    { variable: "AB", unit: "cm" }
  ],

  formula: (ApBp, AB) => ApBp / AB,

  uncertainty: (ApBp, u1, AB, u2) =>
    Math.abs(ApBp / AB) *
    Math.sqrt(
      (u1 / ApBp) ** 2 +
      (u2 / AB) ** 2
    )
},

// =========================
  // GROSSISSEMENT
  // =========================
{
  label: "Grossissement",
  instrument: "./images/lunette.jpg",
  domain: "Optique",
  variable: "γ",
  unit: "",
  relationText: "\\gamma = \\frac{α'}{α}",
  relationInc: "\\frac{u(\\gamma)}{\\gamma}=\\sqrt{\\left(\\frac{u(α')}{α'}\\right)^2+\\left(\\frac{u(α)}{α}\\right)^2}",
  inputs: [
    { variable: "α'", unit: "°" },
    { variable: "α", unit: "°" }
  ],

  formula: (ApBp, AB) => ApBp / AB,

  uncertainty: (ApBp, u1, AB, u2) =>
    Math.abs(ApBp / AB) *
    Math.sqrt(
      (u1 / ApBp) ** 2 +
      (u2 / AB) ** 2
    )
},

  // =========================
  // CAPACITE THERMIQUE
  // =========================
{
  label: "Capacité thermique",
  instrument: "./images/calorimetre.png",
  domain: "Thermodynamique",
  variable: "C",
  unit: "J·K⁻¹",
  relationText: "C = \\frac{Q}{\\Delta T}",
  relationInc: "\\frac{u(C)}{C}=\\sqrt{\\left(\\frac{u(Q)}{Q}\\right)^2+\\left(\\frac{u(\\Delta T)}{\\Delta T}\\right)^2}",
  inputs: [
    { variable: "Q", unit: "J" },
    { variable: "ΔT", unit: "K" }
  ],

  formula: (Q, dT) => Q / dT,

  uncertainty: (Q, uQ, dT, udT) =>
    Math.abs(Q / dT) *
    Math.sqrt(
      (uQ / Q) ** 2 +
      (udT / dT) ** 2
    )
},

  // =========================
  // CONCENTRATION MOLAIRE
  // =========================

  {
    label: "Concentration molaire",
    instrument: "./images/concentration_molaire.jpg",
    domain: "Chimie",
    variable: "C",
    unit: "mol·L⁻¹",
    relationText: "C = \\frac{n}{V}",
    relationInc: "\\frac{u(C)}{C} = \\sqrt{ \\left( \\frac{u(n)}{n} \\right)^2+ \\left( \\frac{u(V)}{V} \\right)^2}",
    inputs: [
      { variable: "n", unit: "mol" },
      { variable: "V", unit: "L" }
    ],

    formula: (n, V) => n / V,

    uncertainty: (n, un, V, uV) =>
      Math.abs(n / V) * Math.sqrt(
        (un / n) ** 2 +
        (uV / V) ** 2
      )
  }

];

window.TYPE_B_RELATIONS = TYPE_B_RELATIONS;
window.PHYSICS_CONTEXT = PHYSICS_CONTEXT;
window.ALLOWED_UNITS = ALLOWED_UNITS;
window.TYPE_B_GENERAL_RULE = {

};

// =========================
// TYPE C - RELATIONS (Z-score TP)
// =========================

const TYPE_C_RELATIONS = [

  {
    label: "Accélération",
    instrument: "./images/acceleration.jpg",
    variable: "a",
    unit: "m·s⁻²",
    domain: "Mécanique",

    reference: () => randomBetween(1, 10)
  },

  {
    label: "Tension",
    instrument: "./images/voltmetre.png",
    variable: "U",
    unit: "V",
    domain: "Electricité",

    reference: () => randomBetween(1, 12)
  },

  {
    label: "Masse",
    instrument: "./images/masse.jpg",
    variable: "m",
    unit: "kg",
    domain: "Mécanique",

    reference: () => randomBetween(0.5, 5)
  },

  {
    label: "pH",
    instrument: "./images/phmetre.png",
    variable: "pH",
    unit: "",
    domain: "Chimie",

    reference: () => randomBetween(3, 10)
  },

  {
  label: "Accélération de la pesanteur",
  instrument: "./images/poids.jpg",
  variable: "g",
  unit: "m·s⁻²",
  domain: "Mécanique",

  reference: () => randomBetween(9.75, 9.83)
  },

  {
  label: "Vitesse du son dans l'air",
  instrument: "./images/vitesse_son.jpg",
  variable: "v",
  unit: "m·s⁻¹",
  domain: "Ondes",

  reference: () => randomBetween(338, 345)
  },

  {
  label: "Résistance d'un dipôle",
  instrument: "./images/ohm.jpg",
  variable: "R",
  unit: "Ω",
  domain: "Électricité",

  reference: () => randomBetween(95, 110)
  },

  {
  label: "Masse volumique de l'eau",
  instrument: "./images/masse_volumique.jpg",
  variable: "ρ",
  unit: "kg·m⁻³",
  domain: "Chimie",

  reference: () => randomBetween(998, 1002)
  },

  {
  label: "Longueur d'onde laser rouge",
  instrument: "./images/laser.jpg",
  variable: "λ",
  unit: "nm",
  domain: "Optique",

  reference: () => randomBetween(635, 650)
  },

  {
  label: "Capacité thermique massique de l'eau",
  instrument: "./images/calorimetre.png",
  variable: "c",
  unit: "kJ·kg⁻¹·K⁻¹",
  domain: "Thermodynamique",

  reference: () => randomBetween(4.15, 4.18)
}

];

// =========================
// EXPORT GLOBAL (SAFE)
// =========================

window.TYPE_C_RELATIONS = TYPE_C_RELATIONS;