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

  if (!meanOk && !uOk) {
    html += "<li>❌ Valeur et incertitude incorrectes</li>";
  }

  else if (!meanOk && uOk) {
    html += "<li>❌ Valeur incorrecte</li>";
    html += "<li>✔ Incertitude correcte</li>";
  }

  else if (meanOk && !uOk) {
    html += "<li>✔ Valeur correcte</li>";
    html += "<li>❌ Incertitude incorrecte</li>";
  }

  html += "</ul>";

  if (meanOk && uOk) {
    html += `<p style="color:green;font-weight:bold;">✔ Excellent travail</p>`;
  }

  else if (data.meanExpected !== undefined) {

    const formatted = window.formatTypeB(
      Number(data.meanExpected),
      Number(data.uExpected)
    );

    html += `
      <p>
        ✔ Réponse attendue :<br>
        ${data.variable ?? "x"} = (${formatted.mean} ± ${formatted.u}) ${data.unit ?? ""}
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

