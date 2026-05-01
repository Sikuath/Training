let score = 0;
let current = 0;

let questions = [];

let timeLeft = 60;
let timer = null;

let gameOver = false;

/* =========================
   GENERATE QUESTIONS
========================= */

function generateQuestions() {

  questions = [
    { q: "2,5 km en m ?", a: 2500 },
    { q: "1500 m en km ?", a: 1.5 },
    { q: "3,2 L en mL ?", a: 3200 },
    { q: "4500 g en kg ?", a: 4.5 },
    { q: "0,003 km en m ?", a: 3 },
    { q: "250 m en km ?", a: 0.25 },
    { q: "5,5 kg en g ?", a: 5500 }
  ];

  questions = questions.sort(() => Math.random() - 0.5);
}

/* =========================
   START GAME
========================= */

function startGame() {

  generateQuestions();

  score = 0;
  current = 0;
  gameOver = false;

  timeLeft = 60;

  // 🔥 gestion boutons
  document.getElementById("startBtn").style.display = "none";
  document.getElementById("validateBtn").style.display = "inline-block";
  document.getElementById("stopBtn").style.display = "inline-block";

  startTimer();
  load();
  updateUI();
}

/* =========================
   TIMER
========================= */

function startTimer() {

  clearInterval(timer);

  timer = setInterval(() => {

    if (gameOver) return;

    timeLeft--;

    const t = document.getElementById("timer");
    if (t) t.textContent = timeLeft + "s";

    if (timeLeft <= 0) {
      endGame();
    }

  }, 1000);
}

/* =========================
   LOAD QUESTION
========================= */

function load() {

  const q = questions[current];

  document.getElementById("question").textContent = q.q;
  document.getElementById("answer").value = "";
  document.getElementById("feedback").textContent = "";
}

/* =========================
   PARSE INPUT (ROBUSTE)
========================= */

function parseInput(value) {

  if (!value) return NaN;

  value = value.replace(",", ".");

  return Number(value);
}

/* =========================
   SUBMIT
========================= */

function submitAnswer() {

  if (gameOver) return;

  let raw = document.getElementById("answer").value;

  if (!raw) return;

  const input = parseInput(raw);
  const good = questions[current].a;

  const epsilon = 1e-9;

  console.log("INPUT =", input, "GOOD =", good);

  if (!isNaN(input) && Math.abs(input - good) < epsilon) {

    score++;
    current++;

    updateUI();

    if (current >= questions.length) {
      endGame();
      return;
    }

    load();

  } else {

    document.getElementById("feedback").innerHTML =
      "✘ Faux<br>✔ Réponse : <b>" + good + "</b>";
  }
}

/* =========================
   END GAME
========================= */

function endGame() {

  if (gameOver) return;

  gameOver = true;

  clearInterval(timer);

  setTimeout(() => {
    window.location.href =
      "gameover.html?game=conversions&score=" + score;
  }, 500);
}

/* =========================
   UI
========================= */

function updateUI() {

  const s = document.getElementById("score");
  if (s) s.textContent = score;
}
