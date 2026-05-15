export function toLatex(str) {

  if (!str) return "";

  let out = str;

  /* =========================================================
     SYMBOLS
  ========================================================= */

  const symbols = {

    rho0: "\\rho_{0}",
    rho: "\\rho",

    lambda: "\\lambda",
    theta: "\\theta",
    sigma: "\\sigma",
    tau: "\\tau",
    epsilon: "\\epsilon",

    deltat: "\\Delta t",

    m1: "m_{1}",
    m2: "m_{2}",
    n1: "n_{1}",
    n2: "n_{2}",

    q1: "q_{1}",
    q2: "q_{2}",

    C1: "C_{1}",
    C2: "C_{2}",

    V1: "V_{1}",
    V2: "V_{2}",

    S1: "S_{1}",
    S2: "S_{2}",

    A1B1: "A_{1}B_{1}",

    v1: "v_{1}",
    v2: "v_{2}",

    I0: "I_{0}",

    msolute: "m_{solute}",
    nsolute: "n_{solute}",
    Vsolution: "V_{solution}",
    vr: "v_{r}",
    vs : "v_{s}"
  };

  /* =========================================================
     IMPORTANT :
     remplacer les plus longs d'abord
  ========================================================= */

  Object.keys(symbols)
    .sort((a,b) => b.length - a.length)
    .forEach(key => {

      const value = symbols[key];

      const regex = new RegExp(
        `\\b${key}\\b`,
        "g"
      );

      out = out.replace(regex, value);
    });

  /* =========================================================
     EXPOSANTS
  ========================================================= */

  out = out.replace(
    /\^([a-zA-Z0-9+\-]+)/g,
    "^{$1}"
  );

  /* =========================================================
       FRACTIONS
  ========================================================= */

  /* Cas 1 : numérateur simple / (dénominateur complexe) */
  out = out.replace(
    /([^=\/()]+|\([^()]+\))\s*\/\s*\(([^()]+)\)/g,
    "\\frac{$1}{$2}"
  );

  /* Cas 2 : fraction générale */
  out = out.replace(
    /([^=\/()]+|\([^()]+\))\s*\/\s*([^\/()]+|\([^\/()]+\))/g,
    (match, num, den) => {

      if (match.includes("\\frac")) return match;

      return `\\frac{${num}}{${den}}`;
    }
  );
  /* Cas 3 : nettoyage des doubles fractions cassées */
  out = out.replace(
    /\\frac\{([^{}]+)\}\/\{([^{}]+)\}/g,
    "\\frac{$1}{$2}"
  );

  /* Cas 4 : sécurité anti fraction vide */
  out = out.replace(
    /\\frac\{\s*\}\s*\/\s*\{\s*\}/g,
    ""
  );

  /* =========================================================
     SQRT
  ========================================================= */

  out = out.replace(
    /sqrt\(([^()]*)\)/g,
    "\\sqrt{$1}"
  );

  out = out.replace(
    /sqrt\{([^{}]*)\}/g,
    "\\sqrt{$1}"
  );

  /* =========================================================
     MULTIPLICATIONS
  ========================================================= */

  out = out.replace(
    /\*/g,
    " \\times "
  );

  /* =========================================================
     ESPACES
  ========================================================= */

  out = out.replace(/\s+/g, " ").trim();

  return out;
}

/* =========================================================
   DISPLAY
========================================================= */

export function displayExpr(expr) {

  if (!expr) return "";

  let e = expr;

  // Supprime parenthèses inutiles
  // autour d'un produit simple
  e = e.replace(
    /\(([a-zA-Z0-9_*^]+)\)/g,
    "$1"
  );

  // MAIS garde celles contenant
  // + ou -
  // car nécessaires

  e = e.replace(/\s+/g, "");

  return e;
}
