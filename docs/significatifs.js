let questions = [];
let i = 0;

let score = 0;
let level = 1;

let gameOver = false;
let playing = false;

let timeLeft = 180;
let timer = null;

let lastGoodAnswer = null;
let currentQuestion = null; // ✅ AJOUT

/* =========================
   GLOBAL EXPORT
========================= */

console.log("JS CHARGÉ OK");

window.startGame = startGame;
window.submit = submit;
window.endGame = endGame;

/* =========================
   SON (AJOUT)
========================= */

function playGoodSound() {
  const s = document.getElementById("goodSound");
  if (s) {
    s.currentTime = 0;
    s.play();
  }
}

function playBadSound() {
  const s = document.getElementById("badLight");
  if (s) {
    s.currentTime = 0;
    s.play();
  }
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
   FEEDBACK (AJOUT UNIQUEMENT)
========================= */

function feedback(question, user, good) {

  const fb = document.getElementById("feedback");
  if (!fb) return;

  const q = question.q;

  let type = "";

  if (q.includes("× 10")) type = "scientifique";
  else if (q.includes(",")) type = "decimal";
  else type = "integer";

  let aide = "";

  if (type === "integer") {
    aide = "💡 Compte simplement le nombre de chiffres du nombre.";
  }

  else if (type === "decimal") {
    aide = "💡 Les chiffres après la virgule peuvent aussi être significatifs (attention aux zéros).";
  }

  else {
    aide = "💡 En notation scientifique, seuls les chiffres de la mantisse (chiffres avant la puissance de 10) comptent.";
  }

  fb.innerHTML = `
    <div class="feedback-box">
      <div>📌 <b>Question :</b><br>${q}</div>

      <div style="margin-top:10px">
        ❌ Ta réponse : <b>${user}</b>
      </div>

      <div style="margin-top:10px">
        ✔ Bonne réponse : <b>${good}</b>
      </div>

      <div style="margin-top:15px;color:#7CFC00;font-weight:bold">
        ${aide}
      </div>
    </div>
  `;

  fb.classList.add("active");
}

/* =========================
   DIGIT
========================= */

function digit() {
  return Math.random() < 0.3 ? 0 : Math.floor(Math.random() * 9) + 1;
}

/* =========================
   GENERATE ONE (NOUVEAU)
========================= */

function generateOne() {

  const mode = getMode();

  let cs;
  let type;

  if (mode === "easy") {
    cs = Math.floor(Math.random() * 3) + 2;
  }
  else if (mode === "medium") {
    cs = Math.floor(Math.random() * 4) + 3;
  }
  else {
    cs = Math.floor(Math.random() * 5) + 4;
  }

  const r = Math.random();

  if (mode === "easy") {
    type = (r < 0.4) ? 0 : 1;
  }
  else if (mode === "medium") {
    if (r < 0.3) type = 0;
    else if (r < 0.6) type = 1;
    else type = 2;
  }
  else {
    if (r < 0.2) type = 0;
    else if (r < 0.4) type = 1;
    else if (r < 0.8) type = 2;
    else type = 3;
  }

  if (type === 0) return genInteger(cs);
  if (type === 1) return genDecimal(cs);
  if (type === 2) return genScientific(cs);
  if (type === 3) return genHardcore();
}

/* =========================
   TYPES
========================= */

function genInteger(cs) {
  let s = "";
  for (let k = 0; k < cs; k++) {
    s += (k === 0)
      ? Math.floor(Math.random() * 9 + 1)
      : digit();
  }
  return { q: s, a: cs };
}

function genDecimal(cs) {

  let digits = "";

  for (let k = 0; k < cs; k++) {
    digits += (k === 0)
      ? Math.floor(Math.random() * 9 + 1)
      : digit();
  }

  const pos = Math.floor(Math.random() * (cs - 1)) + 1;

  return {
    q: digits.slice(0, pos) + "," + digits.slice(pos),
    a: cs
  };
}

function genScientific(cs) {

  let first = Math.floor(Math.random() * 9 + 1);

  let rest = "";
  for (let k = 0; k < cs - 1; k++) rest += digit();

  let mant = cs === 1 ? first : first + "," + rest;

  let exp = Math.floor(Math.random() * 10 - 5);
  let sign = exp < 0 ? "⁻" : "";

  return {
    q: mant + " × 10" + sign + "<sup>" + Math.abs(exp) + "</sup>",
    a: cs
  };
}

function genHardcore() {

  const list = [
    { q: "1002", a: 4 },
    { q: "2,0300", a: 4 },
    { q: "0,0020580", a: 6 },
    { q: "1,200 × 10<sup>3</sup>", a: 4 },
    { q: "4,050 × 10<sup>-2</sup>", a: 4 }
  ];

  return list[Math.floor(Math.random() * list.length)];
}

/* =========================
   START GAME
========================= */

function startGame() {

  if (timer) {
    clearInterval(timer);
    timer = null;
  }

  score = 0;
  i = 0;
  level = 1;

  gameOver = false;
  playing = true;

  timeLeft = 180;

  load(); // 🔥 plus de generate()

  updateUI();

  document.getElementById("startBtn").style.display = "none";
  document.getElementById("validateBtn").style.display = "inline-block";
  document.getElementById("stopBtn").style.display = "inline-block";

  startTimer();
}

/* =========================
   LOAD (MODIFIÉ)
========================= */

function load() {

  currentQuestion = generateOne(); // 🔥 dynamique

  lastGoodAnswer = currentQuestion.a;

  document.getElementById("question").innerHTML =
    "Combien de chiffres significatifs dans : " + currentQuestion.q;

  document.getElementById("answer").value = "";
  document.getElementById("feedback").textContent = "";
}

/* =========================
   SUBMIT (MODIFIÉ)
========================= */

function submit() {

  if (gameOver) return;

  const input = document.getElementById("answer").value;

  if (input === "" || isNaN(input)) return;

  const val = Number(input);
  const good = currentQuestion.a;

  if (val === good) {

    playGoodSound();

    score++;
    i++;

    load();

  } else {

    playBadSound();

    feedback(currentQuestion, val, good);

    setTimeout(() => {
      endGame(true);
    }, 2000);
  }

  updateUI();
}

/* =========================
   TIMER (INCHANGÉ)
========================= */

function startTimer() {

  clearInterval(timer);
  timer = null;

  timer = setInterval(() => {

    if (gameOver) {
      clearInterval(timer);
      timer = null;
      return;
    }

    timeLeft--;

    const t = document.getElementById("timer");
    if (t) t.textContent = timeLeft + "s";

    if (timeLeft <= 0) {
      clearInterval(timer);
      timer = null;
      endGame(true);
    }

  }, 1000);
}

/* =========================
   END GAME (INCHANGÉ)
========================= */

function endGame() {

  if (gameOver) return;

  gameOver = true;
  playing = false;

  if (timer) {
    clearInterval(timer);
    timer = null;
  }

  setTimeout(() => {
    window.location.href =
      "gameover.html?game=significatifs&score=" + score;
  }, 8000);
}

function quitGame() {

  if (gameOver) return;

  const confirmQuit = confirm("Êtes-vous sûr de vouloir quitter la partie ?");

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

  const lvl = document.getElementById("level");
  if (lvl) {
    lvl.textContent = mode;

    lvl.style.color =
      mode === "easy" ? "#7CFC00" :
      mode === "medium" ? "#FFD700" :
      "#FF4500";
  }

  const ranking = JSON.parse(
    localStorage.getItem("ranking_significatifs") || "[]"
  );

  const best = ranking.length
    ? Math.max(...ranking.map(x => x.score))
    : 0;

  const bestEl = document.getElementById("best");
  if (bestEl) bestEl.textContent = best;
}
