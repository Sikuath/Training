import { EXPRESSION_TYPES } from "./exp_types.js";
import { toLatex } from "./exp_latex.js";
export function showFeedback(q, EXPRESSION_TYPES, toLatex) {

  const fb =
    document.getElementById("feedback");

  let explanation = "";

  switch (q.type) {

    /* =========================================================
       PRODUIT/PRODUIT TRIPLE
    ========================================================= */

    case EXPRESSION_TYPES.PRODUCT:
    case EXPRESSION_TYPES.PRODUCT_TRIPLE:
      explanation = `
      <div style="text-align:left">
      👉 L’expression <b>\\(${toLatex(q.expr)}\\)</b> est un produit.
      <br><br>
      Pour isoler la variable <b>\\(${toLatex(q.target)}\\)</b> on divise simplement les deux côtés du signe = par le produit des autres facteurs.
      </div>
      `;
      break;

    /* =========================================================
       PRODUIT THERMAL
    ========================================================= */

    case EXPRESSION_TYPES.PRODUCT_THERMAL:

      if (q.target === "m") {

        explanation = `
        <div style="text-align:left">

        👉 On part de la relation :
        \\(${toLatex(q.expr)}\\)

        <br><br>

        La masse <b>m</b> est multipliée par le produit \\(c \\times (T_f-T_i)\\)

        <br><br>

        Pour l’isoler, on divise les deux membres de l'expression par \\(c \\times (T_f-T_i)\\)

        </div>
        `;
      }

      else if (q.target === "Tf" || q.target === "Ti") {

        explanation = `
        <div style="text-align:left">

        👉 On part de la relation :
        \\(${toLatex(q.expr)}\\)

        <br><br>

        La température \\(${toLatex(q.target)}\\) apparaît dans la différence :
        \\((T_f - T_i)\\)

        Pour l'isoler

        <ul>
          <li>on commence par diviser les deux membres de l'égalité par le produit \\(m \\times c\\)</li>
          <li>puis on développe la relation</li>
          <li>et enfin on isole la température recherchée \\(${toLatex(q.target)}\\)</li>

        </ul>

        ⚠️ Attention au signe :
        inversion des termes si on passe d’un côté de l’équation.

        </div>
        `;
      }

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

      // =========================
      // TITRAGE
      // =========================

      if (q.law === "Titrage") {

        explanation = `
        <div style="text-align:left">

        👉 Lors d’un titrage, les quantités de matière sont reliées
        par les coefficients stœchiométriques de l’équation chimique.

        La relation : \\[${toLatex(q.expr)}\\]

        signifie que les rapports \\(\\frac{n}{coefficient}\\)
        sont égaux.

        <br><br>

        Pour isoler la variable
        <b>\\(${toLatex(q.target)}\\)</b> :

        <ul>
          <li>on commence par faire un produit en croix</li>
          <li>puis on divise par le coefficient restant</li>
        </ul>

        </div>
        `;
      }

      // =========================
      // CAS GÉNÉRAL
      // =========================

      else {

        explanation = `
        <div style="text-align:left">

        👉 L’expression
        <b>\\(${toLatex(q.expr)}\\)</b>
        est une égalité de deux produits.

        <br><br>

        Pour isoler la variable \\(${toLatex(q.target)}\\) on divise à gauche et à droite du signe = par la grandeur qui multiplie la variable recherchée \\(${toLatex(q.target)}\\)

        </div>
        `;
      }

      break;

    /* =========================================================
       ENERGIE JOULE / CINÉTIQUE
    ========================================================= */

    case EXPRESSION_TYPES.ENERGIE_JOULE:

      if (q.poweredVar === q.target) {

        explanation = `
        <div style="text-align:left">

        👉 On remarque un produit à droite du signe = et que la variable
        \\(${toLatex(q.target)}\\) est au carré.

        <br><br>

        ${q.coeff !== "1"
          ? `
          ⚠️ Le coefficient \\(${toLatex(q.coeff)}\\) ne change pas la méthode :
          il reste présent dans les divisions.

          <br><br>
          👉 Pour isoler \\(${toLatex(q.target)}^2\\), on commence par diviser par tous les autres facteurs.
          `
          : ""
        }

        <ul>
          <li>On isole le terme \\(${toLatex(q.target)}^2\\)</li>
          <li>On divise par le produit des autres facteurs</li>
          <li>Puis on applique la racine carrée</li>
        </ul>

        </div>
        `;
      }

      else {

        explanation = `
        <div style="text-align:left">

        👉 On veut isoler la variable \\(${toLatex(q.target)}\\).

        <br><br>

        On remarque une relation de type produit :

        \\(${toLatex(q.expr)}\\)

        <br><br>

        ${q.coeff && q.coeff !== "1"
      ? `
          ⚠️ Le coefficient \\(${toLatex(q.coeff)}\\)
          se conserve dans les calculs.

          👉 Il peut être compensé par une multiplication inverse lors de l’isolement.
          `
          : ""
        }

        <br>

        👉 On isole la variable \\(${toLatex(q.target)}\\) en divisant
        par le produit des autres facteurs.

        </div>
        `;
      }

    break;

    /* =========================================================
       PUISSANCE PESANTEUR
    ========================================================= */

    case EXPRESSION_TYPES.ENERGIE_PESANTEUR:

      explanation = `
      <div style="text-align:left">

      👉 La variable recherchée \\(${toLatex(q.target)}\\) apparaît dans un produit :

      \\(m \\times g \\times z\\) mais aussi avec une constante additive :

      \\(E_{pp}(0)\\)

      <br><br>

      Pour isoler \\(${toLatex(q.target)}\\) :

      <ul>

        <li>
        on commence par soustraire \\(E_{pp}(0)\\)
        des deux côtés du signe =
        </li>

        <li>
        puis on divise par le produit des facteurs restants
        </li>

      </ul>

      ⚠️ Attention : il ne faut pas oublier de retirer \\(E_{pp}(0)\\)
      avant de faire la division.

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

    case EXPRESSION_TYPES.LOG_PH:

      explanation = `
      <div style="text-align:left">

      👉 La concentration en ions oxonium \\(${toLatex(q.target)}\\)
      apparaît à l’intérieur d’un logarithme base 10.

      <br><br>

      Pour isoler cette grandeur :

      <ul>

        <li>
        on commence par supprimer le signe « - »
        </li>

        <li>
        puis on applique l’opération inverse du logarithme :
        la puissance de 10
        </li>

        <li>
        enfin on multiplie toute l'expression par la variable qui reste au dénominateur.
        </li>

      </ul>

      ⚠️ An utilise la propriété :

      \\[
  log(x)=a\\quad \\Rightarrow \\quad x=10^a \\]

      <br><br>

      </div>
      `;

    break;

    /* =========================================================
       RADIOACTIVITE
    ========================================================= */

    case EXPRESSION_TYPES.RADIOACTIVITE:

      explanation = `
      <div style="text-align:left">

      👉 On remarque que la variable \\(${toLatex(q.target)}\\) est dans une exponentielle de type :

      \\(e^{-\\lambda t}\\)

      Pour l’isoler :

      <ul>

        <li>
        on commence par diviser par la valeur initiale \\(N_0\\)
        </li>

        <li>
        puis on applique le logarithme népérien des deux côtés
        </li>

        <li>
        enfin on isole la variable recherchée \\(${toLatex(q.target)}\\)
        </li>

      </ul>

      ⚠️ Point important : le signe « - » dans l’exponentielle doit être conservé tout au long du calcul.

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
