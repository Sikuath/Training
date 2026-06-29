// =========================
// FEEDBACK ROUTER UNIQUE
// =========================

function showFeedback(type, data = {}) {

  const box = document.getElementById("feedbackBox");
  if (!box) return;

  box.innerHTML = "";

  switch (type) {

    case "typeA":
      box.innerHTML = buildTypeA(data);
      break;

    case "typeB":
      box.innerHTML = buildTypeB(data);
      break;

    case "typeC":
      box.innerHTML = buildTypeC(data);
      break;

    case "success":
      box.innerHTML = `
        <p style="color: lightgreen; font-weight: bold;">
          ${data.message ?? "✔ Bonne réponse"}
        </p>
      `;
      break;
  }

  // =========================
  // 🔥 FORCER RENDU LATEX
  // =========================
  if (window.MathJax?.typesetPromise) {
    MathJax.typesetPromise([box]);
  } else if (window.MathJax?.typeset) {
    MathJax.typeset();
  }
}

// =========================
// TYPE A
// =========================

function buildTypeA(data) {

  const meanWrong = !data.meanOk;
  const uWrong = !data.uOk;

  let html = "<ul>";

  if (meanWrong && uWrong) {
    html += "<li>❌ Erreur sur la moyenne</li>";
    html += "<li>❌ Erreur sur l'incertitude</li>";
  }

  else if (meanWrong && !uWrong) {
    html += "<li>❌ Moyenne incorrecte</li>";
    html += "<li>💡 Incertitude correcte</li>";
  }

  else if (!meanWrong && uWrong) {
    html += "<li>💡 Moyenne correcte</li>";
    html += "<li>❌ Incertitude incorrecte</li>";
  }

  html += "</ul>";

  if (!meanWrong && !uWrong) {
    html += `<p style="color:lightgreen;font-weight:bold;">✔ Parfait !</p>`;
  }

  else {
    html += `
      <p>
        ✔ Réponse attendue :
        <strong>${data.variable ?? "x"} = (${data.meanExpected} ± ${data.uExpected}) ${data.unit ?? ""}</strong>
      </p>
    `;
  }

  return html;
}

// =========================
// TYPE B
// =========================

function buildTypeB(data) {

  if (!data) {
    return "<p style='color:red'>Erreur feedback</p>";
  }

  const meanOk = !!data.meanOk;
  const uOk = !!data.uOk;

  let html = "<ul>";

  // =========================
  // CAS ERREUR
  // =========================
  if (!meanOk && !uOk) {
    html += "<li>❌ La valeur et son incertitude sont incorrectes</li>";
  }

  else if (!meanOk && uOk) {
    html += "<li>❌ La valeur est incorrecte</li>";
    html += "<li>✔ Cependant, l'Incertitude est correcte 👍</li>";
  }

  else if (meanOk && !uOk) {
    html += "<li>✔ La valeur est  correcte 👍</li>";
    html += "<li>❌ L'incertitude ne convient pas (ne pas oublier de majorer et garder 1 chiffre significatif)</li>";
  }

  html += "</ul>";

  // =========================
  // CAS PARFAIT
  // =========================
  if (meanOk && uOk) {

    html += `
      <p style="color:green;font-weight:bold;">
        ✔ Excellent travail !
      </p>
    `;
  }

  // =========================
  // REPONSE ATTENDUE (IMPORTANT)
  // =========================
  else if (window.currentQuestion?.answer) {

    const q = window.currentQuestion;

    const formatted = window.formatTypeB(
      q.answer.value,
      q.answer.uncertainty
    );

    html += `
      <p>
        ✔ Réponse attendue :
        ${q.raw.relation.variable} = (${formatted.mean} ± ${formatted.u}) ${q.raw.relation.unit}
      </p>
    `;
  }

  return html;
}

// =========================
// TYPE C
// =========================

function buildTypeC(data) {

  if (!data) {
    return "<p style='color:red'>Erreur feedback</p>";
  }

  const expected = Math.abs(data.expectedZ ?? 0);
  const zFR = expected.toFixed(2).replace(".", ",");

  const variable = data.relation?.variable ?? "x";

  let html = "";

  // =========================
  // Message d'erreur
  // =========================

  switch (data.errorType) {

    case "sign":
      html += `
        <p>❌ Le z-score ne peut pas être négatif.</p>
        <p>✔ Le z-score est correct en valeur absolue.</p>
      `;
      break;

    case "signAndCalc":
      html += `
        <p>❌ Le z-score ne peut pas être négatif.</p>
        <p>❌ Le calcul du z-score est également incorrect.</p>
      `;
      break;

    case "calc":
      html += `
        <p>❌ Le calcul du z-score est incorrect.</p>
      `;
      break;

    default:
      html += `
        <p>❌ Réponse incorrecte.</p>
      `;
  }

  // =========================
  // Formule
  // =========================

  html += `
  <p>
    💡 Rappel de la relation à utiliser :
    \\(
      z=
      \\frac{\\left| ${variable}-${variable}_{\\rm ref} \\right|}{u(${variable})}
    \\)
  </p>
`;

  // =========================
  // Réponse attendue
  // =========================

  html += `
    <p>
      🚀z-score attendu : 
      <strong>z = ${zFR}</strong>
    </p>
  `;

  // indispensable pour MathJax
  setTimeout(() => {
    if (window.MathJax?.typesetPromise) {
      MathJax.typesetPromise();
    } else if (window.MathJax?.typeset) {
      MathJax.typeset();
    }
  }, 0);

  return html;
}

// =========================
// EXPORT
// =========================

window.incFeedback = {
  showFeedback
};

