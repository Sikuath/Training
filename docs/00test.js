const QUESTIONS = [

/* =========================
   MÉCANIQUE / CINÉMATIQUE
========================= */

{
  difficulty: "easy",
  domain: "mouvement",
  law: "vitesse",
  expr: "v = \\frac{d}{t}",
  baseVars: ["v","d","t"],
  targetPool: ["v","d","t"]
},

{
  difficulty: "easy",
  domain: "mouvement",
  law: "accélération normale",
  expr: "a = \\frac{v^2}{R}",
  baseVars: ["a","v","R"],
  targetPool: ["a","v","R"]
},

{
  difficulty: "easy",
  domain: "forces",
  law: "poids",
  expr: "P = m g",
  baseVars: ["P","m","g"],
  targetPool: ["P","m"]
},

{
  difficulty: "easy",
  domain: "forces",
  law: "force gravitationnelle (simplifiée)",
  expr: "F = m g",
  baseVars: ["F","m","g"],
  targetPool: ["F","m"]
},

{
  difficulty: "medium",
  domain: "energie",
  law: "énergie cinétique",
  expr: "E_c = \\frac{1}{2} m v^2",
  baseVars: ["E_c","m","v"],
  targetPool: ["E_c","m","v"]
},

{
  difficulty: "medium",
  domain: "energie",
  law: "énergie potentielle de pesanteur",
  expr: "E_p = m g h",
  baseVars: ["E_p","m","g","h"],
  targetPool: ["E_p","h"]
},

{
  difficulty: "medium",
  domain: "energie",
  law: "énergie électrique",
  expr: "E = P \\times \\Delta t",
  baseVars: ["E","P","t"],
  targetPool: ["E","P","t"]
},

{
  difficulty: "medium",
  domain: "electricite",
  law: "puissance électrique",
  expr: "P = U I",
  baseVars: ["P","U","I"],
  targetPool: ["P","U","I"]
},

{
  difficulty: "medium",
  domain: "electricite",
  law: "effet Joule",
  expr: "P = R I^2",
  baseVars: ["P","R","I"],
  targetPool: ["P","R","I"]
},

{
  difficulty: "medium",
  domain: "electricite",
  law: "loi d’Ohm",
  expr: "U = R I",
  baseVars: ["U","R","I"],
  targetPool: ["U","R","I"]
},

/* =========================
   FLUIDES
========================= */

{
  difficulty: "medium",
  domain: "fluide",
  law: "pression statique",
  expr: "P = \\rho g h",
  baseVars: ["P","\\rho","h"],
  targetPool: ["P","h"]
},

{
  difficulty: "medium",
  domain: "fluide",
  law: "force pressante",
  expr: "F = P S",
  baseVars: ["F","P","S"],
  targetPool: ["F","P","S"]
},

{
  difficulty: "medium",
  domain: "fluide",
  law: "débit volumique",
  expr: "Q_v = \\frac{V}{\\Delta t}",
  baseVars: ["Q_v","V","t"],
  targetPool: ["Q_v","V","t"]
},

{
  difficulty: "medium",
  domain: "fluide",
  law: "continuité",
  expr: "Q_v = S v",
  baseVars: ["Q_v","S","v"],
  targetPool: ["Q_v","S","v"]
},

{
  difficulty: "hard",
  domain: "fluide",
  law: "effet Venturi",
  expr: "\\frac{v_B}{v_A} = \\frac{S_A}{S_B}",
  baseVars: ["v_A","v_B","S_A","S_B"],
  targetPool: ["v_A","v_B"]
},

{
  difficulty: "hard",
  domain: "fluide",
  law: "Bernoulli",
  expr: "P + \\frac{1}{2}\\rho v^2 + \\rho g h = c",
  baseVars: ["P","v","h"],
  targetPool: ["P","v","h"]
},

{
  difficulty: "hard",
  domain: "fluide",
  law: "Archimède",
  expr: "F_A = \\rho V g",
  baseVars: ["F_A","\\rho","V"],
  targetPool: ["F_A","V"]
},

/* =========================
   ONDES / OPTIQUE
========================= */

{
  difficulty: "medium",
  domain: "ondes",
  law: "célérité onde",
  expr: "v = \\lambda f",
  baseVars: ["v","\\lambda","f"],
  targetPool: ["v","\\lambda","f"]
},

{
  difficulty: "medium",
  domain: "ondes",
  law: "diffraction",
  expr: "\\theta = \\frac{\\lambda}{a}",
  baseVars: ["\\theta","\\lambda","a"],
  targetPool: ["\\theta","a"]
},

{
  difficulty: "medium",
  domain: "ondes",
  law: "interfrange",
  expr: "i = \\frac{\\lambda D}{a}",
  baseVars: ["i","\\lambda","D","a"],
  targetPool: ["i","D","a"]
},

{
  difficulty: "medium",
  domain: "ondes",
  law: "intensité sonore",
  expr: "L = 10 \\log \\left(\\frac{I}{I_0}\\right)",
  baseVars: ["L","I"],
  targetPool: ["L","I"]
},

{
  difficulty: "medium",
  domain: "optique",
  law: "Snell-Descartes",
  expr: "n_1 \\sin i = n_2 \\sin r",
  baseVars: ["n_1","n_2","i","r"],
  targetPool: ["i","r"]
},

{
  difficulty: "medium",
  domain: "optique",
  law: "lentille mince",
  expr: "\\frac{1}{f} = \\frac{1}{d_o} + \\frac{1}{d_i}",
  baseVars: ["f","d_o","d_i"],
  targetPool: ["f","d_o","d_i"]
},

/* =========================
   THERMO / CHIMIE
========================= */

{
  difficulty: "medium",
  domain: "thermodynamique",
  law: "gaz parfait",
  expr: "PV = nRT",
  baseVars: ["P","V","n","T"],
  targetPool: ["P","V","T"]
},

{
  difficulty: "medium",
  domain: "thermodynamique",
  law: "chaleur",
  expr: "Q = m c \\Delta T",
  baseVars: ["Q","m","c","T"],
  targetPool: ["Q","T"]
},

{
  difficulty: "medium",
  domain: "thermodynamique",
  law: "flux thermique",
  expr: "\\Phi = \\frac{\\Delta T}{R_{th}}",
  baseVars: ["\\Phi","T","R_{th}"],
  targetPool: ["\\Phi","T"]
},

{
  difficulty: "medium",
  domain: "thermodynamique",
  law: "Stefan-Boltzmann",
  expr: "P = \\sigma T^4",
  baseVars: ["P","T"],
  targetPool: ["P","T"]
},

/* =========================
   CHIMIE
========================= */

{
  difficulty: "easy",
  domain: "chimie",
  law: "concentration molaire",
  expr: "C = \\frac{n}{V}",
  baseVars: ["C","n","V"],
  targetPool: ["C","n","V"]
},

{
  difficulty: "easy",
  domain: "chimie",
  law: "quantité de matière",
  expr: "n = \\frac{m}{M}",
  baseVars: ["n","m","M"],
  targetPool: ["n","m","M"]
},

{
  difficulty: "medium",
  domain: "chimie",
  law: "dilution",
  expr: "C_1 V_1 = C_2 V_2",
  baseVars: ["C_1","V_1","C_2","V_2"],
  targetPool: ["C_1","V_1","C_2","V_2"]
},

{
  difficulty: "medium",
  domain: "chimie",
  law: "pH",
  expr: "pH = -\\log([H_3O^+])",
  baseVars: ["pH","H"],
  targetPool: ["pH","H"]
},

{
  difficulty: "medium",
  domain: "chimie",
  law: "Beer-Lambert",
  expr: "A = \\epsilon l C",
  baseVars: ["A","C","l"],
  targetPool: ["A","C"]
}

];
