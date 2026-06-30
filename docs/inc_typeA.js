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
  const decimals = question.raw.decimals ?? 2;

  const indices = values.map((_, i) => i + 1);

  const formatted = values.map(v =>
    v.toFixed(decimals).replace(".", ",")
  );

  const sig = question.raw.sig;

  const sigText =
    sig === 1
      ? "chiffre significatif."
      : "chiffres significatifs.";

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

  const html = `
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
    </div>

    <p class="tp-instruction">
      <strong>Écrire le résultat sous la forme :
      <span style="color:white;">${context.variable} ± u(${context.variable})</span></strong>
    </p>

    <div style="
      margin:15px 0;
      padding:12px;
      background:rgba(255,152,0,0.18);
      border-left:5px solid #ff9800;
      border-radius:8px;
      color:#ffd54f;
      font-size:1.05em;
      font-weight:bold;
    ">
      ⚠️ L'incertitude doit être donnée avec <span style="color:white;"><strong>${sig} ${sigText}</strong></span>
    </div>

    <div class="answer-box">

      <p style="margin-bottom:8px;">
        <strong>${context.variable} = (</strong>
        <input id="meanInput" class="mini-input" />
        ±
        <input id="uInput" class="mini-input" />
        )
        ${context.unit}
      </p>

      <div id="exerciseButtons"
           style="display:flex;
                  justify-content:center;
                  align-items:center;
                  gap:20px;
                  margin-top:18px;">

        <button onclick="validateAnswer()">Valider</button>

      </div>

      <p id="resultFeedback"></p>

    </div>
  `;

  setTimeout(() => {

    const stopBtn = document.getElementById("stopBtn");
    const container = document.getElementById("exerciseButtons");

    if (stopBtn && container) {
      stopBtn.style.display = "inline-block";
      container.appendChild(stopBtn);
    }

  }, 0);

  return html;
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

  if (isNaN(meanUser) || isNaN(uUser)) {

    const feedback = document.getElementById("resultFeedback");

    feedback.textContent = "⚠ Entrée invalide";
    feedback.style.color = "orange";

    return;
  }

  const meanTrue = q.answer.mean;
  const uRaw = q.raw.uA;

  // nombre de chiffres significatifs demandé
  const sig = q.raw.sig;

  // incertitude correcte
  const uExpected = roundUpSig(uRaw, sig);

  // moyenne alignée sur l'incertitude
  const decimals = Math.max(
    0,
    (uExpected.toString().split(".")[1] || "").length
  );

  const meanExpected = Number(
    meanTrue.toFixed(decimals)
  );

  // comparaison
  const meanOk =
    Math.abs(meanUser - meanExpected) < 1e-9;

  const uOk =
    Math.abs(uUser - uExpected) < 1e-9;

  // =========================
  // BONNE RÉPONSE
  // =========================

  if (meanOk && uOk) {

    const feedback =
      document.getElementById("resultFeedback");

    window.playGoodSound();

    window.setScore(window.getScore() + 1);
    window.updateUI();

    window.incFeedback.showFeedback("success", {
      message: "✔ Bonne réponse"
    });

    setTimeout(() => window.nextQuestion(), 200);

    return;
  }

  // =========================
  // MAUVAISE RÉPONSE
  // =========================

  window.playBadSound();

  window.incFeedback.showFeedback(
    "typeA",
    {
      meanOk,
      uOk,

      variable: q.raw.context.variable,
      unit: q.raw.context.unit,

      meanExpected:
        formatFR(meanExpected, decimals),

      uExpected:
        formatFR(uExpected, decimals)
    }
  );

  const feedback =
    document.getElementById("resultFeedback");

    setTimeout(() => window.endGame(), 6000);
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

  const n = randomInt(4, 10);

  const key =
    ALLOWED_UNITS.typeA[
      randomInt(0, ALLOWED_UNITS.typeA.length - 1)
    ];

  const context = PHYSICS_CONTEXT[key];

  let trueValue;

  if (context.variable === "pH") {
    trueValue = Math.random() * 13 + 0.5;
  } else {
    trueValue = Math.random() * 149 + 1;
  }

  const noise = Math.max(0.5, trueValue * 0.05);
  const decimals =
    context.variable === "pH"
      ? 2
      : (context.decimals ?? Math.floor(Math.random() * 4));

  const values = [];

  for (let i = 0; i < n; i++) {

    const variation = (Math.random() - 0.5) * 2 * noise;

    let v = trueValue + variation;

    if (context.variable === "pH") {
      v = Math.max(0.01, Math.min(13.99, v));
    } else {
      v = Math.max(1, Math.min(150, v));
    }

    v = Number(v.toFixed(Math.max(decimals + 1, 3)));

    values.push(v);
  }

  return {
    values,
    context,
    decimals
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
  let u = computeUA(values);

  // 🔥 sécurité : éviter incertitude nulle ou quasi nulle
  const minUncertainty = 1e-3;

  if (!isFinite(u) || u < minUncertainty) {
    u = minUncertainty;
  }

  // Nombre de chiffres significatifs demandé (1 ou 2)
  const sig = randomSigDigits();

  return {
    type: "typeA",

    q: values,

    answer: {
      mean: m,
      uncertainty: u,
      unit: context.unit
    },

    raw: {
      values,
      mean: m,
      uA: u,
      context,
      decimals: data.decimals,
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