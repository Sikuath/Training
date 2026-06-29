// =========================
// OUTILS (réutilisés Type C)
// =========================

function randomBetween(min, max) {
  return Math.random() * (max - min) + min;
}

function roundSig(x, sig = 2) {
  if (x === 0) return 0;

  const p = Math.pow(
    10,
    sig - Math.ceil(Math.log10(Math.abs(x)))
  );

  return Math.round(x * p) / p;
}

// format FR du z-score
function formatZ(z) {
  return z.toFixed(2).replace(".", ",");
}

function zIsCompatible(z) {
  return Math.abs(Number(z.toFixed(2))) <= 2;
}

// =========================
// FORMAT IDENTIQUE TYPE C
// =========================

function formatTypeC(value, reference, uncertainty) {

  const uRounded = roundSig(uncertainty, 2);

  const decimals = (() => {
    const str = uRounded.toString();
    return str.includes(".") ? str.split(".")[1].length : 0;
  })();

  const valueRounded =
    Math.round(value * Math.pow(10, decimals)) /
    Math.pow(10, decimals);

  const refRounded =
    Math.round(reference * Math.pow(10, decimals)) /
    Math.pow(10, decimals);

  return {
    value: valueRounded.toFixed(decimals).replace(".", ","),
    reference: refRounded.toFixed(decimals).replace(".", ","),
    uncertainty: uRounded.toFixed(decimals).replace(".", ","),
    decimals
  };
}

// =========================
// GENERATION TYPE D
// =========================

function generateTypeDQuestion() {

  const relation =
    window.TYPE_C_RELATIONS[
      Math.floor(Math.random() * window.TYPE_C_RELATIONS.length)
    ];

  let valid = false;
  let guard = 0;

  let value, reference, uncertainty, z, formatted;

  while (!valid && guard < 50) {

    guard++;

    reference = relation.reference();

    const relUnc = randomBetween(0.01, 0.05);
    uncertainty = reference * relUnc;

    value = reference + randomBetween(-3, 3) * uncertainty;

    z = (value - reference) / uncertainty;

    valid =
      isFinite(z) &&
      Math.abs(z) <= 3 &&
      uncertainty > 0;
  }

  formatted = formatTypeC(value, reference, uncertainty);

  value = parseFloat(formatted.value.replace(",", "."));
  reference = parseFloat(formatted.reference.replace(",", "."));
  uncertainty = parseFloat(formatted.uncertainty.replace(",", "."));

  z = (value - reference) / uncertainty;

  return {
    type: "typeD",

    answer: {
      value,
      reference,
      uncertainty,
      z,
      formatted
    },

    raw: {
      relation
    }
  };
}

// =========================
// INTERPRETATION
// =========================

function interpretZ(z) {

  const a = Math.abs(Number(z.toFixed(2)));

  if (a < 1) return "✔ Très compatible";
  if (a <= 2) return "⚠ Compatible mais incertitude notable";
  return "❌ Non compatible";
}

// =========================
// RENDU TYPE D
// =========================

function renderTypeD(q) {

  if (!q?.raw?.relation) {
    return "<p>Erreur exercice</p>";
  }

  window.currentQuestion = q;

  const r = q.raw.relation;
  const f = q.answer.formatted;

  const z = Number(Math.abs(q.answer.z).toFixed(2));
  const zFR = formatZ(z);

  const formula = `
    \\[
    z = \\frac{ ${r.variable} - ${r.variable}_{\\rm ref} }{ u(${r.variable}) }
    \\]
  `;

  return `
    <hr>

    <p><strong>z-score pour valider une mesure expérimentale lors d'un TP de <strong>Physique Chimie</strong></p>

    <hr>

    <p><strong>Données expérimenatles:</strong></p>

    <div class="data-line">
      \\(${r.variable} = ${f.value} \\; ${r.unit}\\)
    </div>

    <div class="data-line">
      \\(${r.variable}_{\\rm ref} = ${f.reference} \\; ${r.unit}\\)
    </div>

    <div class="data-line">
      \\(u(${r.variable}) = ${f.uncertainty} \\; ${r.unit}\\)
    </div>

    <hr>

    <p>On donne le z-score correspondant :<strong> z = ${zFR}</p></strong>

    <hr>
    <p class="tp-instruction">
      <strong>La mesure est-elle <span style="color:white;">compatible</span> avec celle attendue?</strong>
    </p>
    
    <div id="exerciseButtons" style="display:flex;gap:20px;justify-content:center;">
      <button onclick="answerTypeD(true)">✔ Compatible</button>
      <button onclick="answerTypeD(false)">❌ Non compatible</button>
    </div>

    <p id="resultFeedback"></p>
  `;
}

// =========================
// VALIDATION TYPE D
// =========================

function answerTypeD(userChoice) {

  const q = window.currentQuestion;
  if (!q?.answer) return;

  const zRaw = Math.abs(q.answer.z);
  const zRounded = Number(zRaw.toFixed(2));

  const expected = (zRounded <= 2);

  if (userChoice === expected) {

    playGoodSound();

    score++;
    updateUI();

    window.incFeedback.showFeedback("success", {
      message: "✔ Bonne interprétation",
      interpretation: interpretZ(zRounded)
    });

    setTimeout(nextQuestion, 800);

  } else {

    playBadSound();

    window.incFeedback.showFeedback("typeD", {
      expected: expected,
      expectedZ: formatZ(zRounded)
    });

    setTimeout(endGame, 6000);
  }
}

// =========================
// EXPORT
// =========================

window.incTypeD = {
  generateTypeDQuestion,
  renderTypeD,
  answerTypeD
};

window.renderTypeD = renderTypeD;
window.answerTypeD = answerTypeD;