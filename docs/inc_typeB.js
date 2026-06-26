// =========================
// INCERTITUDES TYPE B - STABLE
// =========================

function randomBetween(min, max) {
  return Math.random() * (max - min) + min;
}

function formatFR(x, digits = 2) {
  return x.toFixed(digits).replace(".", ",");
}

function formatSigStrict(x, sig = 2) {

  if (!isFinite(x) || x === 0) return "0,00";

  const exp = Math.floor(Math.log10(Math.abs(x)));
  const factor = Math.pow(10, sig - 1 - exp);

  const rounded = Math.round(x * factor) / factor;

  const decimals = Math.max(0, sig - 1 - exp);

  return rounded.toFixed(decimals).replace(".", ",");
}

// =========================
// GÉNÉRATION
// =========================

function roundUpSig(x, sig = 2) {

  if (x === 0) return 0;

  const pow = Math.pow(
    10,
    sig - Math.ceil(Math.log10(Math.abs(x)))
  );

  return Math.ceil(x * pow) / pow;
}

function roundSigFig(x, sig = 2) {
  if (x === 0) return 0;

  const d = Math.ceil(Math.log10(Math.abs(x)));
  const power = sig - d;
  const magnitude = Math.pow(10, power);

  return Math.round(x * magnitude) / magnitude;
}

function generateTypeBQuestion() {

  const relation =
    window.TYPE_B_RELATIONS[
      Math.floor(Math.random() * window.TYPE_B_RELATIONS.length)
    ];

  const inputs = {};
  const uInputs = {};

  // génération des valeurs
  relation.inputs.forEach(inp => {

    const value = randomBetween(5, 30);
    const rawU = value * (Math.random() * 0.05 + 0.01);
    const u = roundUpSig(rawU, 2);

    inputs[inp.variable] = value;
    uInputs[inp.variable] = u;
  });

  const values = relation.inputs.map(i => inputs[i.variable]);
  const uValues = relation.inputs.map(i => uInputs[i.variable]);

  const result = relation.formula(...values);

  const uncertainty = relation.uncertainty(
    ...values.flatMap((v, i) => [v, uValues[i]])
  );

  return {
    type: "typeB",

    answer: {
      value: result,
      uncertainty
    },

    raw: {
      relation: relation,   // 🔥 IMPORTANT
      inputs: inputs,       // valeurs élèves
      uInputs: uInputs,
      sig: 2
    }
  };
}

// =========================
// RENDU
// =========================

function alignMeanToUncertainty(mean, u) {

  if (u === 0) return { mean, u, decimals: 0 };

  const decimals =
    Math.max(0, (u.toString().split(".")[1] || "").length);

  return {
    mean: Number(mean.toFixed(decimals)),
    u: Number(u.toFixed(decimals)),
    decimals
  };
}

function renderTypeB(q) {

  if (!q?.raw?.relation) {
    console.error("TypeB invalide :", q);
    return "<p>Erreur : exercice invalide</p>";
  }

  const r = q.raw.relation;
  const v = q.raw.inputs;
  const u = q.raw.uInputs;

  let html = `

    <hr>

    <p>
      <strong>Relation à utiliser pour déterminer la mesure:</strong>
      <span class="formula" style="margin-left: 8px; display: inline-block;">
        \\( ${r.relationText} \\)
      </span>
    </p>

    <p><strong>Relation à utiliser pour déterminer l'incertitude absolue :</strong></p>

    <div class="formula">
      \\(
      ${r.relationInc}
      \\)
    </div>

    <hr>

    <p><strong>Données :</strong></p>
  `;

  r.inputs.forEach(inp => {

    const meanRaw = v[inp.variable];
    const uRaw = u[inp.variable];

    // ✔ 2 chiffres significatifs sur l’incertitude
    const uRounded = roundUpSig(uRaw, r.sig ?? 2);

    // ✔ alignement mesure / incertitude
    const aligned = alignMeanToUncertainty(meanRaw, uRounded);

    html += `
      <div class="data-line">
        ${inp.variable} = (
        ${formatFR(aligned.mean, aligned.decimals)}
        ±
        ${formatSigStrict(aligned.u, 2)}
        )
        ${inp.unit}
      </div>
    `;

  });

  html += `

    <hr>

    <p><strong>Écrire le résultat avec deux chiffres significatifs pour l'incertitude :</strong></p>

    <div class="answer-box">

      <p style="white-space: nowrap;">

        ${r.variable} = (

        <input id="meanInput" class="mini-input" />

        ±

        <input id="uInput" class="mini-input" />

        )

        ${r.unit}

      </p>

      <button onclick="validateTypeB()">
        Valider
      </button>

      <p id="resultFeedback"></p>

    </div>

  `;

  return html;
}

// =========================
// VALIDATION
// =========================

function validateTypeB() {

  const q = window.currentQuestion;

  if (!q?.answer || !q?.raw) return;

  const meanUser = parseFloat(
    document.getElementById("meanInput").value.replace(",", ".")
  );

  const uUser = parseFloat(
    document.getElementById("uInput").value.replace(",", ".")
  );

  if (isNaN(meanUser) || isNaN(uUser)) {
    const feedback = document.getElementById("resultFeedback");
    feedback.textContent = "⚠ Valeurs invalides";
    feedback.style.color = "orange";
    return;
  }

  const meanTrue = q.answer.value;
  const uTrue = q.answer.uncertainty;

  const meanOk =
    Math.abs(meanUser - meanTrue) / Math.abs(meanTrue) < 0.02;

  const uRounded = roundUpSig(uTrue, 2);

  const uOk =
    Math.abs(uUser - uRounded) / Math.abs(uRounded) < 0.01;

  const feedback = document.getElementById("resultFeedback");

  if (meanOk && uOk) {

    feedback.textContent = "✔ Correct !";
    feedback.style.color = "lightgreen";

    window.incFeedback.showFeedback("success", {
      message: "✔ Bonne réponse"
    });

    setTimeout(() => load(), 1000);

    return;
  }

  feedback.textContent = "❌ À corriger";
  feedback.style.color = "red";

   window.incFeedback.showFeedback("typeB", {
     meanOk,
     uOk,

     meanExpected: meanTrue,
     uExpected: uTrue,   // brut obligatoire
     unit: q.raw.relation.unit
   });

}

// =========================
// UTIL
// =========================

function randomBetween(min, max) {
  return Math.random() * (max - min) + min;
}

// =========================
// EXPORT
// =========================

window.incTypeB = {
  generateTypeBQuestion,
  renderTypeB,
  validateTypeB
};
