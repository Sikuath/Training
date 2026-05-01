let questions = [];
let i = 0;

let score = 0;
let streak = 0;
let level = 1;

let playing = false;
let gameOver = false;

let timeLeft = 180;
let timer = null;

/* =========================
   DIGIT
========================= */

function digit() {
  return Math.random() < 0.3
    ? 0
    : Math.floor(Math.random() * 9) + 1;
}

/* =========================
   GENERATION
========================= */

function generate() {

  const set = new Set();
  questions = [];

  while (questions.length < 200) {

    let cs;

    if (Math.random() < 0.7) cs = Math.floor(Math.random() * 4) + 2;
    else cs = Math.floor(Math.random() * 3) + 5;

    const type = Math.floor(Math.random() * 4);

    let q;

    if (type === 0) q = genInteger(cs);
    if (type === 1) q = genDecimal(cs);
    if (type === 2) q = genScientific(cs);
    if (type === 3) q = genHardcore();

    if (!set.has(q.q)) {
      set.add(q.q);
      questions.push(q);
    }
  }

  questions.sort(() => Math.random() - 0.5);
}

/* =========================
   INTEGER
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

/* =========================
   DECIMAL
========================= */

function genDecimal(cs) {

  if (cs === 1) return genInteger(cs);

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

/* =========================
   SCIENTIFIQUE
========================= */

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

/* =========================
   HARDCORE
========================= */

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
   TIMER
========================= */

function startTimer() {

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
   START GAME
========================= */

function startGame() {

  generate();

  playing = true;
  gameOver = false;

  i = 0;
  score = 0;
  streak = 0;
  level = 1;

  timeLeft = 180;

  document.getElementById("startBtn").style.display = "none";
  document.getElementById("validateBtn").style.display = "inline-block";

  startTimer();
  load();
  updateUI();
}

/* =========================
   LOAD
========================= */

function load() {

  const q = questions[i];

  document.getElementById("question").innerHTML =
    "Combien de chiffres significatifs dans : " + q.q;

  document.getElementById("answer").value = "";
  document.getElementById("feedback").textContent = "";
}

/* =========================
   SUBMIT
========================= */

function submit() {

  if (gameOver) return;

  if (!questions[i]) {
    endGame();
    return;
  }

  const input = document.getElementById("answer").value;

  if (input === "" || isNaN(input)) return;

  const val = Number(input);
  const good = questions[i].a;

  if (val === good) {

    score++;
    streak++;
    i++;

    if (i >= questions.length) {
      endGame();
      return;
    }

    load();

  } else {

    const fb = document.getElementById("feedback");

    if (fb) {
      fb.innerHTML =
        "✘ Faux<br><br>✔ Bonne réponse : <b>" + good + "</b>";
    }

    const snapshot = streak;

    gameOver = true;
    clearInterval(timer);

    setTimeout(() => {

      console.log("SCORE ENVOYÉ =", snapshot);

      window.location.href = "gameover.html?score=" + snapshot;

    }, 1200);
  }

  updateUI();
}

/* =========================
   END GAME
========================= */

function endGame() {

  if (gameOver) return;

  gameOver = true;
  clearInterval(timer);

  const snapshot = streak;

  window.location.href = "gameover.html?score=" + snapshot;
}

/* =========================
   UI
========================= */

function updateUI() {

  const s = document.getElementById("score");
  const st = document.getElementById("streak");

  if (s) s.textContent = score;
  if (st) st.textContent = streak;
}

/* =========================
   INIT
========================= */

document.addEventListener("DOMContentLoaded", () => {

  generate();

  const btn = document.getElementById("startBtn");

  if (btn) {
    btn.addEventListener("click", startGame);
  }
});
