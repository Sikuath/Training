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
    instrument: "./images/manometre.png",
    domain: "Fluides"
  }
};

const ALLOWED_UNITS = {
  typeA: ["t", "L", "m", "U", "I", "pH", "sigma"],
  typeB: ["U", "I", "x", "t"],
  typeC: ["m", "x", "t", "F"]
};

window.PHYSICS_CONTEXT = PHYSICS_CONTEXT;
window.ALLOWED_UNITS = ALLOWED_UNITS;
