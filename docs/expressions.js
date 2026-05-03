let score = 0;
let current = 0;

let timeLeft = 180;
let timer = null;

let gameOver = false;

let currentQuestion = null;

/* =========================
   BASE DE DONNÉES
========================= */

const QUESTIONS = [

  {
    difficulty: "easy",
    domain: "Électricité",
    question: "Loi d’Ohm",
    expr: "U = R \\times I",
    baseVars: ["U", "R", "I"],
    targetPool: ["R", "I"],
    feedback: "On isole la variable en réarrangeant la relation.",
    image: "images/ohm.jpg"
  },

  {
    difficulty: "medium",
    domain: "Relativité",
    question: "Énergie de masse",
    expr: "E = m \\times c^2",
    baseVars: ["E", "m", "c"],
    targetPool: ["m", "E"],
    feedback: "On isole la variable en divisant par c².",
    image: "images/einstein.jpg"
  },

  {
    difficulty: "hard",
    domain: "Cinématique",
    question: "Relation vitesse-distance-temps",
    expr: "v = \\frac{d}{t}",
    baseVars: ["v", "d", "t"],
    targetPool: ["t", "d"],
    feedback: "On réarrange la fraction pour isoler la variable.",
    image: "images/speed.jpg"
  }

];

/* =========================
   OUTIL VARIABLES (IMPORTANT FIX)
========================= */

function getVars(q, target) {
  return q.baseVars.filter(v => v !== target);
}

/* =========================
   GÉNÉRATION CHOIX
========================= */

function generateChoices(q, target) {

  const vars = getVars(q, target);
  const a = vars[0];
  const b = vars[1];

  let correct = "";

  // règles simples mais robustes
  if (q.expr.includes("\\times") || q.expr.includes("*")) {
    correct = `${target} = \\frac{${a}}{${b}}`;
  }

  else if (q.expr.includes("\\frac")) {
    correct = `${target} = \\frac{${a}}{${b}}`;
  }

  else {
    correct = `${target} = ${a} / ${b}`;
  }

  const wrong = [
    `${target} = ${a} \\times ${b}`,
    `${target} = ${b} / ${a}`,
    `${target} = ${a} - ${b}`
  ];

  const all = [correct, ...wrong];

  all.sort(() => Math.random() - 0.5);

  return {
    choices: all,
    answer: all.indexOf(correct)
  };
}

/* =========================
   MODE
========================= */

function getMode() {
  if (score >= 10) return "hard";
  if (score >= 5) return "medium";
  return "easy";
}

/* =========================
   QUESTION
========================= */

function generateQuestion() {

  const mode = getMode();

  const pool = QUESTIONS.filter(q => q.difficulty === mode);
  const base = pool[0];

  const target = base.targetPool[
    Math.floor(Math.random() * base.targetPool.length)
  ];

  const gen = generateChoices(base, target);

  currentQuestion = {
    ...base,
    target,
    choices: gen.choices,
    answer: gen.answer
  };
}

/* =========================
   LOAD
========================= */

function load() {

  const q = currentQuestion;

  document.getElementById("question").innerHTML =
    `📘 <b>${q.domain}</b><br><br>
     D’après la relation :<br>
     \\(${q.expr}\\)<br><br>
     Exprimer <b>${q.target}</b> en fonction des variables`;

  renderChoices(q);

  document.getElementById("feedback").innerHTML = "";

  if (window.MathJax) MathJax.typeset();

  // 🔥 IMPORTANT : delay DOM paint
  setTimeout(() => {
    showImage(q);
  }, 0);
}

/* =========================
   CHOIX
========================= */

function renderChoices(q) {

  const container = document.getElementById("choices");
  container.innerHTML = "";

  q.choices.forEach((choice, index) => {

    const btn = document.createElement("button");

    btn.innerHTML = `\\(${choice}\\)`;

    btn.onclick = () => submitAnswer(index);

    container.appendChild(btn);
  });

  if (window.MathJax) MathJax.typeset();
}

/* =========================
   IMAGE (inchangé)
========================= */

function showImage(q) {

  const img = document.getElementById("illustration");

  if (!q || !q.image) {
    img.style.display = "none";
    return;
  }

  img.style.display = "none";

  const temp = new Image();

  temp.onload = () => {
    img.src = q.image;
    img.style.display = "block";
  };

  temp.src = q.image;
}

/* =========================
   SUBMIT
========================= */

function submitAnswer(choice) {

  if (gameOver) return;

  if (choice === currentQuestion.answer) {

    playGoodSound();

    score++;
    current++;

    updateUI();

    generateQuestion();
    load();

  } else {

    playBadSound();

    showFeedback();

    setTimeout(() => endGame(), 2000);
  }
}

/* =========================
   FEEDBACK
========================= */

function showFeedback() {

  const fb = document.getElementById("feedback");
  const q = currentQuestion;

  const vars = getVars(q, q.target);

  fb.innerHTML = `
    ❌ Mauvaise réponse<br><br>
    ✔ Bonne réponse : \\(${q.choices[q.answer]}\\)<br><br>
    💡 ${q.feedback}<br>
    Variables : ${vars.join(", ")}
  `;

  if (window.MathJax) MathJax.typeset();
}

/* =========================
   TIMER
========================= */

function startTimer() {

  clearInterval(timer);

  timer = setInterval(() => {

    if (gameOver) {
      clearInterval(timer);
      return;
    }

    timeLeft--;

    const t = document.getElementById("timer");
    if (t) t.textContent = timeLeft + "s";

    if (timeLeft <= 0) {
      endGame();
    }

  }, 1000);
}

/* =========================
   START GAME
========================= */

function startGame() {

  clearInterval(timer);

  // 🔥 PRELOAD IMAGES (OK on garde)
  QUESTIONS.forEach(q => {
    if (q.image) {
      const i = new Image();
      i.src = q.image;
    }
  });

  score = 0;
  current = 0;
  gameOver = false;

  timeLeft = 180;

  generateQuestion();

  // 🔥 FIX IMPORTANT : attendre le rendu DOM avant load()
  requestAnimationFrame(() => {

    load();
    updateUI();

  });

  document.getElementById("startBtn").style.display = "none";
  document.getElementById("validateBtn").style.display = "none";
  document.getElementById("stopBtn").style.display = "inline-block";

  startTimer();
}

/* =========================
   END GAME
========================= */

function endGame() {

  if (gameOver) return;

  gameOver = true;

  clearInterval(timer);

  const key = "ranking_expressions";

  let ranking = JSON.parse(localStorage.getItem(key) || "[]");

  ranking.push({ name: "AAA", score });

  ranking.sort((a, b) => b.score - a.score);

  ranking = ranking.slice(0, 10);

  localStorage.setItem(key, JSON.stringify(ranking));

  setTimeout(() => {
    window.location.href =
      "gameover.html?game=expressions&score=" + score;
  }, 8000);
}

/* =========================
   QUIT
========================= */

function quitGame() {

  if (gameOver) return;

  if (!confirm("Quitter la partie ?")) return;

  gameOver = true;
  clearInterval(timer);

  window.location.href = "index.html";
}

/* =========================
   UI
========================= */

function updateUI() {

  const s = document.getElementById("score");
  if (s) s.textContent = score;

  const mode = getMode();

  const m = document.getElementById("mode");
  if (m) {
    m.textContent = mode;

    m.style.color =
      mode === "easy" ? "#7CFC00" :
      mode === "medium" ? "#FFD700" :
      "#FF4500";
  }
}

/* =========================
   SON
========================= */

function playSound(id) {
  const s = document.getElementById(id);
  if (!s) return;

  try {
    s.pause();
    s.currentTime = 0;
    s.play();
  } catch {}
}

function playGoodSound() {
  playSound("goodSound");
}

function playBadSound() {
  playSound("badLight");
}
