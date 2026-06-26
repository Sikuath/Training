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
    relationInc: "\\frac{u(P)}{P} = \\sqrt{ \\left( \\frac{u(U)}{I} \\right)^2+ \\left( \\frac{u(I)}{I} \\right)^2}",
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
  // CONCENTRATION (TP dosage / dilution)
  // =========================
  {
    label: "Concentration molaire",
    instrument: "./images/concentration_molaire.jpg",
    domain: "Chimie",
    variable: "C",
    unit: "g·L⁻¹",
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
  title: "Calcul des incertitudes dans le cas de produits et/ou de quotient",

  text:
    "Les incertitudes relatives se combinent par somme quadratique.",

  formula:
    "u(Y)/Y = √[(u(x1)/x1)² + (u(x2)/x2)² + ...]"
};
