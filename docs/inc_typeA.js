// =========================
// INCERTITUDES TYPE A
// =========================

const UNITS = ["s", "m", "kg", "V", "A"];

// -------------------------
// rendu question
// -------------------------

function render(question) {

  const values = question.raw.values;

  let table = `
    <table class="measure-table">
      <thead>
        <tr>
          <th>#</th>
          <th>Mesure</th>
        </tr>
      </thead>
      <tbody>
  `;

  values.forEach((v, i) => {
    table += `
      <tr>
        <td>${i + 1}</td>
        <td>${v.toFixed(2)}</td>
      </tr>
    `;
  });

  table += `
      </tbody>
    </table>
  `;

  return `
    ${table}

    <div class="stats">
      <p><strong>Moyenne :</strong> ${question.answer.mean}</p>
      <p><strong>Écart-type :</strong> ${question.raw.uA.toFixed(3)}</p>
      <p><strong>Unité :</strong> ${question.answer.unit}</p>
    </div>

    <br>
    <p>Donne le résultat sous la forme : x ± u (unité)</p>
  `;
}

// -------------------------
// utilitaires
// -------------------------

function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function round(x, digits = 2) {
  const p = Math.pow(10, digits);
  return Math.round(x * p) / p;
}

// -------------------------
// stats
// -------------------------

function mean(values) {
  return values.reduce((a, b) => a + b, 0) / values.length;
}

function standardDeviation(values) {

  const m = mean(values);
  const n = values.length;

  const variance =
    values.reduce((s, x) => s + (x - m) ** 2, 0) / (n - 1);

  return Math.sqrt(variance);
}

function computeUA(values) {
  return standardDeviation(values) / Math.sqrt(values.length);
}

// -------------------------
// génération des mesures
// -------------------------

function generateMeasurementSet() {

  const n = randomInt(4, 10);                 // 4 à 10 mesures
  const trueValue = Math.random() * 149 + 1;  // 1 à 150

  const noise = Math.max(0.5, trueValue * 0.02); // bruit ~2%

  const unit = UNITS[randomInt(0, UNITS.length - 1)];

  const values = [];

  for (let i = 0; i < n; i++) {

    const variation = (Math.random() - 0.5) * 2 * noise;

    let v = trueValue + variation;

    // bornes physiques
    v = Math.max(1, Math.min(150, v));

    values.push(v);
  }

  return {
    values,
    unit
  };
}

// -------------------------
// génération exercice TYPE A
// -------------------------

function generateUncertaintyQuestion() {

  const data = generateMeasurementSet();

  const values = data.values;
  const unit = data.unit;

  const m = mean(values);
  const u = computeUA(values);

  return {
    type: "typeA",

    // affichage joueur
    q: values.map(v => round(v, 2)),

    // réponse correcte
    answer: {
      mean: round(m, 2),
      uncertainty: round(u, 2),
      unit: unit
    },

    // info pédagogique
    format: "(x ± u) unit",

    // debug optionnel
    raw: {
      values,
      mean: m,
      uA: u
    }
  };
}

// -------------------------
// EXPORT GLOBAL (important pour ton moteur)
// -------------------------

window.incTypeA = {
  generateUncertaintyQuestion,
  render
};
