// =========================
// OUTILS
// =========================

function randomBetween(min, max) {
  return Math.random() * (max - min) + min;
}

function roundUpSig(x, sig = 1) {
  if (x === 0) return 0;

  const pow = Math.pow(
    10,
    sig - Math.ceil(Math.log10(Math.abs(x)))
  );

  return Math.ceil(x * pow) / pow;
}

// =========================
// FORMAT AFFICHAGE (UNIQUEMENT UI)
// =========================

function formatTypeB(mean, u) {

  const uRounded = roundUpSig(u, 1);

  const decimals = (() => {
    const str = uRounded.toString();
    return str.includes(".") ? str.split(".")[1].length : 0;
  })();

  const meanRounded = Math.round(mean * Math.pow(10, decimals)) / Math.pow(10, decimals);

  return {
    mean: meanRounded.toFixed(decimals).replace(".", ","),
    u: uRounded.toFixed(decimals).replace(".", ","),
    decimals
  };
}

// =========================
// GENERATION QUESTION TYPE B
// =========================

function generateTypeBQuestion() {

  const relation =
    window.TYPE_B_RELATIONS[
      Math.floor(Math.random() * window.TYPE_B_RELATIONS.length)
    ];

  let inputs = {};
  let uInputs = {};

  let values = [];
  let uValues = [];

  let result, uncertainty;
  let valid = false;

  while (!valid) {

    values = [];
    uValues = [];

    // =========================
    // 1) VALEURS ELEVE (DEJA ARRONDIES)
    // =========================
    relation.inputs.forEach(() => {

      const v = Number(randomBetween(5, 50).toFixed(1));
      const rel = randomBetween(0.01, 0.05);
      const u = roundUpSig(v * rel, 1);

      values.push(v);
      uValues.push(u);
    });

    // =========================
    // 2) CALCUL PHYSIQUE
    // =========================
    result = relation.formula(...values);

    uncertainty = relation.uncertainty(
      ...values.flatMap((v, i) => [v, uValues[i]])
    );

    // =========================
    // 3) CONTRAINTES PEDAGOGIQUES
    // =========================
    valid =
      uValues.every((u, i) => u / values[i] < 0.1) &&
      uncertainty >= 0.001 &&
      uncertainty <= 8;
  }

  // =========================
  // 4) FIGE POUR AFFICHAGE ELEVE
  // =========================
  relation.inputs.forEach((inp, i) => {

    inputs[inp.variable] = values[i];
    uInputs[inp.variable] = uValues[i];
  });

  const expected = formatTypeB(result, uncertainty);

  return {
    type: "typeB",

    answer: {
      value: result,
      uncertainty: uncertainty,
      expected
    },

    raw: {
      relation,
      inputs,
      uInputs
    }
  };
}

// =========================
// RENDU EXERCICE
// =========================

function renderTypeB(q) {

  if (!q?.raw?.relation) {
    return "<p>Erreur exercice</p>";
  }

  // IMPORTANT : source globale pour validation
  window.currentQuestion = q;

  const r = q.raw.relation;
  const v = q.raw.inputs;
  const u = q.raw.uInputs;

  let html = `
    <hr>

    <p><strong>Relation :</strong> \\( ${r.relationText} \\)</p>
    <p><strong>Incertitude :</strong> \\( ${r.relationInc} \\)</p>

    <hr>

    <p><strong>Données :</strong></p>
  `;

  r.inputs.forEach(inp => {

    const formatted = formatTypeB(v[inp.variable], u[inp.variable]);

    html += `
      <div class="data-line">
        ${inp.variable} = (
          ${formatted.mean} ± ${formatted.u}
        ) ${inp.unit}
      </div>
    `;
  });

  html += `
    <hr>

    <p><strong>Réponse :</strong></p>

    <div>

      ${r.variable} = (
        <input id="meanInput" style="width:70px;text-align:center;">
        ±
        <input id="uInput" style="width:70px;text-align:center;">
      ) ${r.unit}

      <div style="margin-top:10px;">
        <button onclick="validateTypeB()">Valider</button>
      </div>

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
  if (!q?.answer) return;

  const expected = window.formatTypeB(
    q.answer.value,
    q.answer.uncertainty
  );

  const meanUser = document.getElementById("meanInput").value.trim();
  const uUser = document.getElementById("uInput").value.trim();

  // =========================
  // NORMALISATION POINTS
  // =========================
  const norm = (x) => x.replace(",", ".");

  const meanOk = Number(norm(meanUser)) === Number(norm(expected.mean));
  const uOk = Number(norm(uUser)) === Number(norm(expected.u));

  window.incFeedback.showFeedback("typeB", {
    meanOk,
    uOk,
    meanExpected: expected.mean,
    uExpected: expected.u,
    variable: q.raw.relation.variable,
    unit: q.raw.relation.unit
  });
}

// =========================
// EXPORT GLOBAL (IMPORTANT)
// =========================

window.incTypeB = {
  generateTypeBQuestion,
  renderTypeB,
  validateTypeB
};

// expose global (IMPORTANT pour onclick HTML)
window.renderTypeB = renderTypeB;
window.validateTypeB = validateTypeB;
