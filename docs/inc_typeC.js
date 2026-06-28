// =========================
// OUTILS (réutilisés Type B)
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

// =========================
// FORMAT (cohérent affichage physique)
// =========================

function formatTypeC(value, reference, uncertainty) {

  // incertitude à 2 chiffres significatifs (physique lycée)
  const uRounded = roundSig(uncertainty, 2);

  // nombre de décimales imposé par l'incertitude
  const decimals = (() => {
    const str = uRounded.toString();
    return str.includes(".") ? str.split(".")[1].length : 0;
  })();

  // arrondi cohérent mesure et référence
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
// GENERATION QUESTION TYPE C (Z-SCORE TP)
// =========================

function generateTypeCQuestion() {

  const relation =
    window.TYPE_C_RELATIONS[
      Math.floor(Math.random() * window.TYPE_C_RELATIONS.length)
    ];

  let valid = false;
  let guard = 0;

  let value;
  let reference;
  let uncertainty;
  let z;

  let formatted;

  while (!valid && guard < 50) {

    guard++;

    reference = relation.reference();

    // incertitude relative réaliste TP (1 à 5%)
    const relUnc = randomBetween(0.01, 0.05);

    uncertainty = reference * relUnc;

    value = reference + randomBetween(-3, 3) * uncertainty;

    z = (value - reference) / uncertainty;

    // validation brute physique
    valid =
      isFinite(z) &&
      Math.abs(z) <= 3 &&
      uncertainty > 0;
  }

  // 🔥 FORMATAGE UNIQUE (référence de vérité affichée)
  formatted = formatTypeC(value, reference, uncertainty);

  // 🔥 ON RE-SYNCHRONISE LES VALEURS SUR L'AFFICHAGE
  value = parseFloat(formatted.value.replace(",", "."));
  reference = parseFloat(formatted.reference.replace(",", "."));
  uncertainty = parseFloat(formatted.uncertainty.replace(",", "."));

  // recalcul z cohérent affichage
  z = (value - reference) / uncertainty;

  return {
    type: "typeC",

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
// INTERPRETATION PHYSIQUE
// =========================

function interpretZ(z) {

  const a = Math.abs(z);

  if (a < 1) {
    return "✔ mesure compatible avec la valeur attendue";
  }

  if (a < 2) {
    return "⚠ écart acceptable (incertitudes expérimentales)";
  }

  return "❌ valeur suspecte (erreur expérimentale probable)";
}

// =========================
// RENDU EXERCICE TYPE C
// =========================

function renderTypeC(q) {

  if (!q?.raw?.relation) {
    return "<p>Erreur exercice</p>";
  }

  window.currentQuestion = q;

  const r = q.raw.relation;
  const f = q.answer.formatted;

  let html = `
    <hr>

    <p><strong>Validation d'une mesure expérimentale</strong></p>

    <p>
      TP de <strong>${r.domain}</strong>
    </p>

    <hr>

    <p><strong>Données :</strong></p>

    <div class="data-line">
      \\(
      ${r.variable}
      =
      ${f.value}
      \\;
      ${r.unit}
      \\)
    </div>

    <div class="data-line">
      \\(
      ${r.variable}_{\\rm ref}
      =
      ${f.reference}
      \\;
      ${r.unit}
      \\)
    </div>

    <div class="data-line">
      \\(
      u(${r.variable})
      =
      ${f.uncertainty}
      \\;
      ${r.unit}
      \\)
    </div>

    <hr>

    <p><strong>Calculer le z-score.</strong></p>

    <div>
      z =
      <input id="zInput" style="width:90px;text-align:center;">

      <div id="exerciseButtons"
           style="display:flex;justify-content:center;gap:20px;margin-top:18px;">

        <button onclick="validateTypeC()">Valider</button>

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

// =========================
// VALIDATION TYPE C
// =========================

function validateTypeC() {

  const q = window.currentQuestion;
  if (!q?.answer) return;

  const expectedZ = q.answer.z;

  const userZ = parseFloat(
    document.getElementById("zInput").value.replace(",", ".")
  );

  const ok = Math.abs(userZ - expectedZ) < 0.01;

  if (ok) {

    playGoodSound();

    score++;
    updateUI();

    window.incFeedback.showFeedback("success", {
      message: "✔ z-score correct",
      interpretation: interpretZ(expectedZ)
    });

    setTimeout(nextQuestion, 800);
    return;
  }

  playBadSound();

  window.incFeedback.showFeedback("typeC", {
    expectedZ,
    interpretation: interpretZ(expectedZ)
  });

  setTimeout(endGame, 2000);
}

// =========================
// EXPORT GLOBAL
// =========================

window.incTypeC = {
    generateTypeCQuestion,
    renderTypeC,
    validateTypeC
};

window.renderTypeC = renderTypeC;
window.validateTypeC = validateTypeC;
