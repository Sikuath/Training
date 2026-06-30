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

  let valid = false;
  let result, uncertainty;

  let guard = 0;

  while (!valid && guard < 50) {

    guard++;

    values = [];
    uValues = [];

    // =========================
    // 1. GENERATION "TP REALISTE"
    // =========================
    relation.inputs.forEach(inp => {

      // valeur expérimentale déjà "arrondie TP"
      const v = Number(randomBetween(0.1, 5).toFixed(1));

      // incertitude réaliste arrondie DIRECTEMENT
      const u = roundUpSig(v * randomBetween(0.01, 0.05), 1);

      // 🔥 ON FIGE ICI
      inputs[inp.variable] = v;
      uInputs[inp.variable] = u;

      values.push(v);
      uValues.push(u);
    });

    // =========================
    // 2. CALCUL SUR VALEURS FIGEES
    // =========================
    result = relation.formula(...values);
    uncertainty = relation.uncertainty(
      ...values.flatMap((v, i) => [v, uValues[i]])
    );

    // =========================
    // 3. VALIDATION PEDAGOGIQUE
    // =========================
    valid =
      isFinite(result) &&
      isFinite(uncertainty) &&
      uncertainty >= 0.001 &&
      uncertainty <= 8 &&
      uValues.every((u, i) => u / values[i] < 0.1);
  }

  if (!valid) {
    throw new Error("Impossible de générer un exercice valide");
  }

  // =========================
  // 4. FORMAT FINAL
  // =========================
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

  window.currentQuestion = q;

  const r = q.raw.relation;
  const v = q.raw.inputs;
  const u = q.raw.uInputs;

  const debug = true;

  let html = `
    <hr>

    <p><strong>Relations à utiliser :</strong></p>
    <p>\\( ${r.relationText} \\)</p>
    <p>\\( ${r.relationInc} \\)</p>

    <hr>

    <p><strong>Données expérimentales :</strong></p>
  `;

  // =========================
  // DONNÉES
  // =========================

  r.inputs.forEach(inp => {

    const formatted = formatTypeB(
      v[inp.variable],
      u[inp.variable]
    );

    html += `
      <div class="data-line">
        ${inp.variable} = (
          ${formatted.mean} ± ${formatted.u}
        ) ${inp.unit}
      </div>
    `;
  });

  // =========================
  // DEBUG
  // =========================

  if (debug) {

    const expected = formatTypeB(
      q.answer.value,
      q.answer.uncertainty
    );

    html += `
      <hr>

      <div style="
        background:#222;
        color:#8f8;
        padding:10px;
        border-radius:6px;
        font-family:monospace;
      ">

        <strong>DEBUG MODE</strong><br><br>

        Valeur calculée :
        <b>${q.answer.value}</b><br>

        Incertitude calculée :
        <b>${q.answer.uncertainty}</b><br><br>

        Réponse attendue :<br>

        <b>
          ${r.variable} =
          (${expected.mean} ± ${expected.u})
          ${r.unit}
        </b>

      </div>
    `;
  }

  // =========================
  // SAISIE
  // =========================
    html += `
    <hr>
    <p class="tp-instruction">
      <strong>Écrire le résultat sous la forme : <span style="color:white;">${r.variable} ± u(${r.variable})</span></strong>
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
      ⚠️ L'incertitude doit être donnée avec
      <span style="color:white;">1 chiffre significatif</span>.
    </div>

    <div>

      ${r.variable} = (

      <input id="meanInput" style="width:80px;text-align:center;">

      ±

      <input id="uInput" style="width:80px;text-align:center;">

      ) ${r.unit}

      <div id="exerciseButtons"
           style="
              display:flex;
              justify-content:center;
              align-items:center;
              gap:20px;
              margin-top:18px;
           ">

        <button onclick="validateTypeB()">
          Valider
        </button>

      </div>

      <p id="resultFeedback"></p>

    </div>
  `;

  // Déplacer le bouton Fin à côté de Valider
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

  const norm = (x) => x.replace(",", ".");

  const meanOk = norm(meanUser) === norm(expected.mean);
  const uOk = norm(uUser) === norm(expected.u);

  // =========================
  // BONNE REPONSE
  // =========================
  if (meanOk && uOk) {

    playGoodSound();

    window.setScore(window.getScore() + 1);
    window.updateUI();

    window.incFeedback.showFeedback("success", {
      message: "✔ Bonne réponse"
    });

    setTimeout(nextQuestion, 800);
    return;
  }

  // =========================
  // MAUVAISE REPONSE
  // =========================
  playBadSound();

  window.incFeedback.showFeedback("typeB", {
    meanOk,
    uOk,
    meanExpected: q.answer.value,
    uExpected: q.answer.uncertainty,
    variable: q.raw.relation.variable,
    unit: q.raw.relation.unit
  });

  setTimeout(endGame, 6000);
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
