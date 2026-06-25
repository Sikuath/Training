// =========================
// FEEDBACK INCERTITUDES
// =========================

function showFeedback(type, data = {}) {

  const box = document.getElementById("feedbackBox");
  if (!box) return;

  const q = window.currentQuestion;
  const context = q?.raw?.context ?? {};

  const variable = context.variable ?? "mesure";
  const unit = context.unit ?? "";

  box.innerHTML = "";

  if (type === "typeA") {
    box.innerHTML = buildTypeA(data, variable, unit);
  }

  if (type === "typeB") {
    box.innerHTML = buildTypeB(data);
  }

  if (type === "typeC") {
    box.innerHTML = buildTypeC(data);
  }

  if (type === "success") {
    box.innerHTML = `
      <p style="color: lightgreen; font-weight: bold;">
        ${data.message ?? "✔ Bonne réponse"}
      </p>
    `;
  }
}

// =========================
// TYPE A
// =========================

function buildTypeA(data, variable, unit) {

  const meanWrong = !data.meanOk;
  const uWrong = !data.uOk;

  let html = "<ul>";

  if (meanWrong && uWrong) {
    html += "<li>❌ Erreur sur la moyenne</li>";
    html += "<li>❌ Erreur sur l'incertitude</li>";
  }

  else if (meanWrong && !uWrong) {
    html += "<li>❌ Moyenne incorrecte</li>";
    html += "<li>💡 Incertitude correcte — attention à l'arrondi de la moyenne</li>";
  }

  else if (!meanWrong && uWrong) {
    html += "<li>💡 Moyenne correcte 👍</li>";
    html += "<li>❌ Incertitude incorrecte (chiffres significatifs)</li>";
  }

  html += "</ul>";

  // message final
  if (!meanWrong && !uWrong) {
    html += `
      <p style="color: lightgreen; font-weight: bold;">
        ✔ Parfait !
      </p>
    `;
  } else {
    html += `
      <p>
        ✔ Réponse attendue :
        <strong>
          ${variable} = (${data.meanExpected} ± ${data.uExpected}) ${unit}
        </strong>
      </p>
    `;
  }

  return html;
}

// =========================
// TYPE B
// =========================

function buildTypeB(data) {
  return `<p>❌ Type B non traité ici</p>`;
}

// =========================
// TYPE C
// =========================

function buildTypeC(data) {
  return `<p>❌ Type C non traité ici</p>`;
}

// =========================
// EXPORT
// =========================

window.incFeedback = {
  showFeedback
};
