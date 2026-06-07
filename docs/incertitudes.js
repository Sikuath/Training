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

  // génération unique (évite duplication de code)
  const ex = incTypeA.generateUncertaintyQuestion();

  // adaptation légère selon difficulté (optionnel mais utile)
  if (mode === "easy") {

    return {
      ...ex,
      mode: "easy",

      // option pédagogique : affichage simplifié
      hint: "Mesures simples, dispersion faible"
    };
  }

  if (mode === "medium") {

    return {
      ...ex,
      mode: "medium",

      hint: "Utilise moyenne et incertitude type A"
    };
  }

  // HARD
  return {
    ...ex,
    mode: "hard",

    hint: "Résultat attendu sous forme x ± u avec unités"
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
   LOAD
========================= */

function load() {

  currentQuestion = generateQuestion();

  // -------------------------
  // RENDU selon type
  // -------------------------

  let html = "";

  if (currentQuestion.type === "typeA") {
    html = incTypeA.render(currentQuestion);
  }

  document.getElementById("question").innerHTML = html;

  // -------------------------
  // CHOIX
  // -------------------------

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
