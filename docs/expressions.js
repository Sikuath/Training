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

  // EASY
  {
    difficulty: "easy",
    question: "Exprimer R en fonction de U et I",
    expr: "U = R × I",

    choices: [
      "R = U × I",
      "R = U / I",
      "R = I / U",
      "R = U - I"
    ],

    answer: 1,

    feedback: "On isole R en divisant par I.",
    image: "images/ohm.png"
  },

  // MEDIUM
  {
    difficulty: "medium",
    question: "Exprimer m en fonction de E et c",
    expr: "E = m × c²",

    choices: [
      "m = E × c²",
      "m = E / c²",
      "m = c² / E",
      "m = √E / c"
    ],

    answer: 1,

    feedback: "On divise par c².",
    image: "images/einstein.png"
  },

  // HARD
  {
    difficulty: "hard",
    question: "Exprimer t en fonction de d et v",
    expr: "v = d / t",

    choices: [
      "t = d × v",
      "t = v / d",
      "t = d / v",
      "t = 1 / (d × v)"
    ],

    answer: 2,

    feedback: "On inverse la relation : t = d / v.",
    image: "images/speed.png"
  }

];

/* =========================
   MODE
========================= */

function getMode() {
  if (score >= 2) return "hard";
  if (score >= 1) return "medium";
  return "easy";
}

/* =========================
   QUESTION
========================= */

function generateQuestion() {

  const mode = getMode();

  const filtered = QUESTIONS.filter(q => q.difficulty === mode);

  currentQuestion = filtered[0]; // une seule question par niveau ici
}

/* =========================
   LOAD
========================= */

function load() {

  const q = currentQuestion;

  document.getElementById("question").innerHTML =
    `${q.question}<br><br><b>${q.expr}</b>`;

  renderChoices(q);
  showImage(q);

  document.getElementById("feedback").innerHTML = "";
}

/* =========================
   CHOIX (QCM)
========================= */

function renderChoices(q) {

  const container = document.getElementById("choices");
  container.innerHTML = "";

  q.choices.forEach((choice, index) => {

    const btn = document.createElement("button");
    btn.textContent = choice;

    btn.onclick = () => submitAnswer(index);

    container.appendChild(btn);
  });
}

/* =========================
   IMAGE
========================= */

function showImage(q) {

  const img = document.getElementById("illustration");

  if (q.image) {
    img.src = q.image;
    img.style.display = "block";
  } else {
    img.style.display = "none";
  }
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

  fb.innerHTML = `
    ❌ Mauvaise réponse<br><br>
    ✔ Bonne réponse : <b>${q.choices[q.answer]}</b><br><br>
    💡 ${q.feedback}
  `;
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

  score = 0;
  current = 0;
  gameOver = false;

  timeLeft = 180;

  generateQuestion();
  load();
  updateUI();

  document.getElementById("startBtn").style.display = "none";
  document.getElementById("validateBtn").style.display = "none"; // pas utilisé ici
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

  /* =========================
     🏆 SAUVEGARDE SCORE EXPRESSIONS
  ========================= */

  const key = "ranking_expressions";

  let ranking = JSON.parse(localStorage.getItem(key) || "[]");

  const name = "AAA"; // temporaire (sera demandé dans gameover.html)

  ranking.push({ name, score });

  ranking.sort((a, b) => b.score - a.score);

  ranking = ranking.slice(0, 10);

  localStorage.setItem(key, JSON.stringify(ranking));

  /* =========================
     REDIRECTION GAMEOVER
  ========================= */

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

  const confirmQuit = confirm("Quitter la partie ?");

  if (!confirmQuit) return;

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
