let score = 0;
let timeLeft = 180;
let timer = null;

let gameOver = false;
let currentQuestion = null;

/* =========================
   BASE QUESTIONS
========================= */

function generateQuestion() {

  const mode = getMode();

  const base = [

    // EASY (arrondi)
    {
      type: "round",
      q: "3,14159",
      answer: "3,14",
      choices: ["3,14", "3,141", "3,1", "3,15"]
    },

    // MEDIUM (incertitude écriture)
    {
      type: "write",
      q: "12,3456 ± 0,0789",
      answer: "12,35 ± 0,08",
      choices: [
        "12,35 ± 0,08",
        "12,3 ± 0,1",
        "12,345 ± 0,079",
        "12,4 ± 0,08"
      ]
    },

    // HARD (piège cohérence)
    {
      type: "write",
      q: "5,67891 ± 0,1234",
      answer: "5,68 ± 0,12",
      choices: [
        "5,68 ± 0,12",
        "5,7 ± 0,1",
        "5,679 ± 0,123",
        "5,6 ± 0,12"
      ]
    }
  ];

  if (mode === "easy") return base[0];
  if (mode === "medium") return base[1];
  return base[2];
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
   LOAD
========================= */

function load() {

  currentQuestion = generateQuestion();

  document.getElementById("question").textContent =
    "Résultat : " + currentQuestion.q;

  const container = document.getElementById("choices");
  container.innerHTML = "";

  currentQuestion.choices.forEach((c, i) => {

    const btn = document.createElement("button");
    btn.textContent = c;

    btn.onclick = () => submit(i);

    container.appendChild(btn);
  });

  document.getElementById("feedback").textContent = "";
}

/* =========================
   SUBMIT
========================= */

function submit(index) {

  if (gameOver) return;

  const choice = currentQuestion.choices[index];

  if (choice === currentQuestion.answer) {

    playGoodSound();

    score++;
    updateUI();

    load();

  } else {

    playBadSound();

    document.getElementById("feedback").textContent =
      "❌ Mauvaise réponse\n✔ Réponse : " + currentQuestion.answer;

    setTimeout(() => endGame(), 2000);
  }
}

/* =========================
   TIMER
========================= */

function startTimer() {

  clearInterval(timer);

  timer = setInterval(() => {

    if (gameOver) return;

    timeLeft--;

    document.getElementById("timer").textContent = timeLeft + "s";

    if (timeLeft <= 0) endGame();

  }, 1000);
}

/* =========================
   START
========================= */

function startGame() {

  score = 0;
  timeLeft = 180;
  gameOver = false;

  load();
  updateUI();
  startTimer();

  document.getElementById("startBtn").style.display = "none";
  document.getElementById("stopBtn").style.display = "inline-block";
}

/* =========================
   END GAME (IMPORTANT SCOREBOARD)
========================= */

function endGame() {

  if (gameOver) return;

  gameOver = true;
  clearInterval(timer);

  setTimeout(() => {
    window.location.href =
      "gameover.html?game=incertitudes&score=" + score;
  }, 1500);
}
function quitGame() {

  if (gameOver) return;

  const confirmQuit = confirm("Quitter la partie ?");

  if (!confirmQuit) return;

  gameOver = true;
  clearInterval(timer);

  window.location.href = "index.html";
}

window.quitGame = quitGame;

/* =========================
   UI
========================= */

function updateUI() {

  document.getElementById("score").textContent = score;

  const mode = getMode();
  document.getElementById("mode").textContent = mode;
}

/* =========================
   SOUND
========================= */

function playGoodSound() {
  const s = document.getElementById("goodSound");
  if (s) s.play();
}

function playBadSound() {
  const s = document.getElementById("badLight");
  if (s) s.play();
}

/* =========================
   EXPORT
========================= */

window.startGame = startGame;
window.submit = submit;
window.endGame = endGame;
