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

function formatSig2(x) {
  if (x === 0) return "0";

  const d = Math.ceil(Math.log10(Math.abs(x)));
  const power = 2 - d;
  const magnitude = Math.pow(10, power);

  const rounded = Math.round(x * magnitude) / magnitude;

  // garde les chiffres significatifs correctement
  return rounded.toString().replace(".", ",");
}

function formatTypeB(mean, u) {

  if (!isFinite(mean) || !isFinite(u)) {
    return { mean: "?", u: "?" };
  }

  // règle 2 : 2 chiffres significatifs
  const uRounded = roundUpSig(u, 2);

  // règle 1 : alignement décimal mesure/incertitude
  const decimals =
    Math.max(0, (uRounded.toString().split(".")[1] || "").length);

  const meanRounded = Number(mean.toFixed(decimals));

  return {
    mean: formatFR(meanRounded, decimals),
    u: formatSig2(uRounded)
  };
}

function buildTypeB(data) {

  const meanWrong = !data.meanOk;
  const uWrong = !data.uOk;

  let html = "<ul>";

  // ❌ tout faux
  if (meanWrong && uWrong) {
    html += "<li>❌ Erreur sur la mesure</li>";
    html += "<li>❌ Erreur sur l'incertitude</li>";
  }

  // ❌ mesure fausse, incertitude correcte
  else if (meanWrong && !uWrong) {
    html += "<li>❌ Mesure incorrecte</li>";
    html += "<li>💡 L'incertitude est correcte ✔</li>";
    html += "<li>👉 La mesure doit être alignée sur l'incertitude (mêmes décimales)</li>";
  }

  // ✔ mesure correcte, incertitude fausse
  else if (!meanWrong && uWrong) {
    html += "<li>💡 Mesure correcte 👍</li>";
    html += "<li>❌ Incertitude incorrecte</li>";
    html += "<li>👉 Elle doit avoir EXACTEMENT 2 chiffres significatifs</li>";
  }

  html += "</ul>";

  // message final
  if (!meanWrong && !uWrong) {

    html += `
      <p style="color: lightgreen; font-weight: bold;">
        ✔ Parfait !
      </p>
    `;
  }

  // réponse attendue si erreur
  else {

    const formatted = formatTypeB(data.meanExpected, data.uExpected);

    html += `
      <p>
        ✔ Réponse attendue :
        <strong>
          (${formatted.mean} ± ${formatted.u}) ${data.unit}
        </strong>
      </p>
    `;
  }

  return html;
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
