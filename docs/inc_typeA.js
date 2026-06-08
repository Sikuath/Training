// =========================
// INCERTITUDES TYPE A
// =========================

// -------------------------
// rendu question
// -------------------------

function randomSigDigits() {
  return Math.random() < 0.5 ? 1 : 2;
}

function buildInstruction(context) {
  const variable = context.variable;
  return `Écrire le résultat sous la forme : ${variable} ± u(${variable})`;
}

function formatFR(x, digits = 2) {
  return x.toFixed(digits).replace(".", ",");
}

function render(question) {

  const values = question.raw.values;
  const context = question.raw.context;

  const indices = values.map((_, i) => i + 1);

  const displayDecimals = Math.floor(Math.random() * 4);

  const formatted = values.map(v =>
    v.toFixed(displayDecimals).replace(".", ",")
  );

  const instruction =
    `Écrire le résultat sous la forme : ${context.variable} ± u(${context.variable})`;

  // 🔥 chiffres significatifs imposés
  const sig = question.raw.sig;

  let table = `
    <table class="measure-table">
      <tbody>

        <tr>
          <th>#</th>
          ${indices.map(i => `<td>${i}</td>`).join("")}
        </tr>

        <tr>
          <th>Mesures</th>
          ${formatted.map(v => `<td>${v}</td>`).join("")}
        </tr>

      </tbody>
    </table>
  `;

  return `
    ${table}

    <div class="stats">
      <p>
        <strong>Moyenne :</strong>
        ${formatFR(question.answer.mean, 9)} ${context.unit}
      </p>

      <p>
        <strong>Incertitude type A :</strong>
        ${formatFR(question.raw.uA, 9)} ${context.unit}
      </p>

      <!-- 🔥 NOUVELLE INFO -->
      <p class="tp-instruction">
        Chiffres significatifs attendus pour l'incertitude : <strong>${sig}</strong>
      </p>
    </div>

    <p class="tp-instruction">${instruction}</p>

    <!-- ZONE DE RÉPONSE -->
    <div class="answer-box">

      <input id="meanInput" placeholder="moyenne" />
      <input id="uInput" placeholder="incertitude" />

      <button onclick="validateAnswer()">Valider</button>

      <p id="resultFeedback"></p>

    </div>
  `;
}

// -------------------------
// validation
// -------------------------

function roundUpSig(x, sig = 2) {

  if (x === 0) return 0;

  const pow = Math.pow(10, sig - Math.ceil(Math.log10(Math.abs(x))));

  return Math.ceil(x * pow) / pow;
}

function validateAnswer() {

  const meanUser = parseFloat(
    document.getElementById("meanInput").value.replace(",", ".")
  );

  const uUser = parseFloat(
    document.getElementById("uInput").value.replace(",", ".")
  );

  const q = window.currentQuestion;
  const feedback = document.getElementById("resultFeedback");

  if (isNaN(meanUser) || isNaN(uUser)) {
    feedback.textContent = "⚠ Entrée invalide";
    feedback.style.color = "orange";
    return;
  }

  const meanTrue = q.answer.mean;
  const uRaw = q.raw.uA;
  const sig = q.raw.sig || 2;

  // 🔥 incertitude correcte (majoration + CS)
  const uExpected = roundUpSig(uRaw, sig);

  // 🔥 moyenne alignée sur u
  const decimals = Math.max(
    0,
    (uExpected.toString().split(".")[1] || "").length
  );

  const meanExpected = Number(meanTrue.toFixed(decimals));

  // 🔥 comparaison stricte mais propre
  const meanOk = Math.abs(meanUser - meanExpected) < 1e-9;
  const uOk = Math.abs(uUser - uExpected) < 1e-9;

  if (meanOk && uOk) {

    feedback.textContent = "✔ Correct !";
    feedback.style.color = "lightgreen";

  } else {

    feedback.textContent =
      "❌ Faux\nRéponse attendue : " +
      formatFR(meanExpected, decimals) +
      " ± " +
      formatFR(uExpected, decimals);

    feedback.style.color = "red";
  }
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

  const key =
    ALLOWED_UNITS.typeA[
      randomInt(0, ALLOWED_UNITS.typeA.length - 1)
    ];

  const context = PHYSICS_CONTEXT[key];

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
    context
  };
}

// -------------------------
// génération exercice TYPE A
// -------------------------

function generateUncertaintyQuestion() {

  const data = generateMeasurementSet();

  const values = data.values;
  const context = data.context;

  const m = mean(values);
  const u = computeUA(values);

  // 🔥 chiffres significatifs aléatoires
  const sig = randomSigDigits();
  const uRounded = Number(u.toPrecision(sig));

  // 🔥 consigne dynamique
  const sigInstruction =
    `Donner l'incertitude avec ${sig} chiffre${sig > 1 ? "s" : ""} significatif${sig > 1 ? "s" : ""}`;

  return {
    type: "typeA",

    // affichage joueur
    q: values.map(v => round(v, 2)),

    // réponse correcte
    answer: {
      mean: round(m, 6),
      uncertainty: uRounded,
      unit: context.unit
    },

    format: "(x ± u) unit",

    // 🔥 nouvelle info pédagogique
    sigInstruction,

    raw: {
      values,
      mean: m,
      uA: u,
      context,
      sig
    }
  };
}

// -------------------------
// EXPORT GLOBAL
// -------------------------

window.incTypeA = {
  generateUncertaintyQuestion,
  render
};
