import { EXPRESSION_TYPES } from "./exp_types.js";
import { toLatex } from "./exp_latex.js";
export function showFeedback(q, EXPRESSION_TYPES, toLatex) {

  const fb =
    document.getElementById("feedback");

  let explanation = "";

  switch (q.type) {

    /* =========================================================
&       PRODUIT
    ========================================================= */

    case EXPRESSION_TYPES.PRODUCT:
      explanation = `
      <div style="text-align:left">
      👉 L’expression <b>\\(${toLatex(q.expr)}\\)</b> est un produit.
      <br><br>
      Pour isoler la variable <b>\\(${toLatex(q.target)}\\)</b> on divise simplement les deux côtés du signe = par le produit des autres facteurs.
      </div>
      `;
      break;

    /* =========================================================
       FRACTION
    ========================================================= */

    case EXPRESSION_TYPES.FRACTION:
      explanation = `
      <div style="text-align:left">
      👉 L’expression <b>\\(${toLatex(q.expr)}\\)</b> est une fraction.
      <br><br>
      - Si la variable <b>\\(${toLatex(q.target)}\\)</b> est au numérateur → on multiplie par le dénominateur
      - Si elle est au dénominateur → on inverse la relation
      </div>
      `;
      break;

    /* =========================================================
       PRODUIT EN CROIX
    ========================================================= */

    case EXPRESSION_TYPES.CROSS:
      explanation = `
      <div style="text-align:left">
      👉 L’expression <b>\\(${toLatex(q.expr)}\\)</b> est une égalité de deux produits.
      Pour isoler la variable <b>\\(${toLatex(q.target)}\\)</b> on divise à gauche et à droite du signe = par la grandeur qui multiplie la variable recherchée.
      </div>
      `;
      break;

    /* =========================================================
       PRODUIT + PUISSANCE (JOULE / CINÉTIQUE etc.)
    ========================================================= */

    case EXPRESSION_TYPES.PRODUCT_POWER:
      explanation = `
      <div style="text-align:left">
      👉 La variable apparaît dans un produit avec une puissance.
      <br><br>
      On isole d’abord la puissance puis on applique une racine.
      </div>
      `;
      break;

    /* =========================================================
       PUISSANCE PURE (KEPLER / STEFAN etc.)
    ========================================================= */

    case EXPRESSION_TYPES.POWER:
      explanation = `
      <div style="text-align:left">
      👉 La variable est dans une relation de puissance.
      <br><br>
      On applique l’opération inverse : racine ou exponentiation fractionnaire.
      </div>
      `;
      break;

    /* =========================================================
       LOG
    ========================================================= */

    case EXPRESSION_TYPES.LOG:
      explanation = `
      <div style="text-align:left">
      👉 La variable est dans un logarithme.
      <br><br>
      On utilise l’exponentielle pour inverser le log.
      </div>
      `;
      break;

    /* =========================================================
       EXP
    ========================================================= */

    case EXPRESSION_TYPES.EXP:
      explanation = `
      <div style="text-align:left">
      👉 La variable est dans une exponentielle.
      <br><br>
      On applique le logarithme pour l’isoler.
      </div>
      `;
      break;

    /* =========================================================
       SOMME (BERNOULLI / énergie etc.)
    ========================================================= */

    case EXPRESSION_TYPES.SUM:
      explanation = `
      <div style="text-align:left">
      👉 L’expression est une somme avec une constante.
      <br><br>
      On isole le terme contenant la variable en réorganisant l’équation.
      </div>
      `;
      break;

    /* =========================================================
       FRACTION INVERSE (lentilles etc.)
    ========================================================= */

    case EXPRESSION_TYPES.RECIPROCAL_SUM:
      explanation = `
      <div style="text-align:left">
      👉 La relation est une somme de fractions inverses.
      <br><br>
      On regroupe les inverses puis on inverse l’expression finale.
      </div>
      `;
      break;

    /* =========================================================
   FORCE CENTRALE (gravitation / Coulomb)
   ========================================================= */

    case EXPRESSION_TYPES.FORCE_CENTRALE:
      explanation = `
      <div style="text-align:left">

      👉 De relation <b>\\(${toLatex(q.expr)}\\)</b>
      on en déduit que la force dépend :

      <ul>
        <li>du produit des grandeurs au numérateur</li>
        <li>et de la distance au carré au dénominateur</li>
      </ul>

      Pour isoler la variable recherchée <b>\\(${toLatex(q.target)}\\)</b> :

      <ul>
        <li>on commence par supprimer la fraction en faisant un produit en croix</li>
        <li>puis on divise par les facteurs restants</li>
      </ul>

      ${q.target === "r"
        ? `

        ⚠️ Attention :
        la distance apparaît sous la forme
        \\(${toLatex(q.denominator)}^2\\).

        Après isolement de
        \\(${toLatex(q.denominator)}^2\\),
        il faut appliquer une racine carrée.
        `
        : ""
      }

      </div>
      `;
      break;

/* =========================================================
   EFFET DOPPLER
   ========================================================= */

    case EXPRESSION_TYPES.DOPPLER:
      explanation = `
      <div style="text-align:left">

      On remarque que la fréquence observée <b>f'</b> dépend d’un quotient

      <ul>
        <li>avec une vitesse au numérateur et une autre au dénominateur</li>
        <li>il faut donc être très attentif au produit en croix</li>
      </ul>

      Pour isoler la variable recherchée <b>\\(${toLatex(q.target)}\\)</b> :

      <ul>
        <li>on commence par supprimer la fraction grâce à un produit en croix</li>
        <li>on développe éventuellement les parenthèses</li>
        <li>puis on regroupe les termes contenant la variable cherchée</li>
      </ul>
      </div>
      ${
        q.target === "v"
          ? `

          ⚠️ Attention :

          la vitesse \\(v\\) apparaît des deux côtés
          de l’équation après le produit en croix.

          Il faut donc développer les produits pour ensuite regrouper tous les termes en \\(v\\) et enfin factoriser par la variable \\(v\\) .

          `
          : ""
      }

      ${
        q.target === "f"
          ? `

          ⚠️ Attention :

          il ne faut pas inverser le quotient :

          <div style="margin-top:8px">
          \\(
          \\frac{v+v_r}{v+v_s}
          \\neq
          \\frac{v+v_s}{v+v_r}
          \\)
          </div>

          `
          : ""
      }

      </div>
      `;
      break;

    /* =========================================================
       FALLBACK
    ========================================================= */

    default:
      explanation = `
      <div style="text-align:left">
      👉 On utilise la structure de l’équation pour isoler la variable.
      </div>
      `;
  }

  fb.innerHTML = `

    ❌ <b>Mauvaise réponse</b><br><br>

    Regardons la méthode 👇<br><br>

    🧠 À partir de : \\(${toLatex(q.expr)}\\)<br><br>

    ${explanation}

    <br><br>

    ✔ Bonne réponse :<br><br>

    \\[
      ${toLatex(q.target)} = ${toLatex(q.answers[q.target])}
    \\]

  `;

  if (window.MathJax) {
    setTimeout(() => {
      MathJax.typesetPromise?.() || MathJax.typeset();
    }, 0);
  }
}
