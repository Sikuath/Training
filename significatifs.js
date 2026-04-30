let questions = [];
let i = 0;
let score = 0;
let streak = 0;
let level = 1;
let playing = false;

/* =========================
   GENERATION
========================= */

function generate() {
  const set = new Set();
  questions = [];

  while (questions.length < 200) {

    const cs = Math.floor(Math.random() * 5) + 1;
    const type = Math.floor(Math.random() * 3);

    let obj;

    if (type === 0) obj = genInteger(cs);
    if (type === 1) obj = genDecimal(cs);
    if (type === 2) obj = genScientific(cs);

    if (obj && !set.has(obj.q)) {
      set.add(obj.q);
      questions.push(obj);
    }
  }

  questions.sort(() => Math.random() - 0.5);
}

/* =========================
   ENTIER
========================= */

function genInteger(cs) {

  let s = "";

  for (let i = 0; i < cs; i++) {
    if (i === 0) {
      s += Math.floor(Math.random() * 9 + 1);
    } else {
      s += Math.floor(Math.random() * 10);
    }
  }

  return { q: s, a: cs };
}

/* =========================
   DECIMAL CORRIGÉ
========================= */

function genDecimal(cs) {

  // pas de décimal pour 1 CS
  if (cs === 1) {
    return genInteger(cs);
  }

  let digits = "";

  for (let i = 0; i < cs; i++) {

    if (i === 0) {
      // 🔥 pas de zéro en tête
      digits += Math.floor(Math.random() * 9 + 1);
    } else {
      digits += Math.floor(Math.random() * 10);
    }

  }

  const pos = Math.floor(Math.random() * (cs - 1)) + 1;

  let q = digits.slice(0, pos) + "," + digits.slice(pos);

  return { q, a: cs };
}

/* =========================
   SCIENTIFIQUE PROPRE
========================= */

function genScientific(cs) {

  let first = Math.floor(Math.random() * 9 + 1);

  let rest = "";
  for (let i = 0; i < cs - 1; i++) {
    rest += Math.floor(Math.random() * 10);
  }

  let mant = cs === 1 ? String(first) : first + "," + rest;

  let exp = Math.floor(Math.random() * 10 - 5);

  let sign = exp < 0 ? "⁻" : "";
  let absExp = Math.abs(exp);

  let q = mant + " × 10" + sign + "<sup>" + absExp + "</sup>";

  return { q, a: cs };
}

/* =========================
   AUDIO
========================= */

function sound(type) {
  const map = {
    good: "goodSound",
    light: "badLight",
    heavy: "badHeavy"
  };

  const audio = document.getElementById(map[type]);
  if (!audio) return;

  audio.currentTime = 0;
  audio.play().catch(()=>{});
}

/* =========================
   GAME
========================= */

function startGame() {
  generate();

  playing = true;
  i = 0;
  score = 0;
  streak = 0;
  level = 1;

  document.getElementById("startBtn").style.display = "none";
  document.getElementById("validateBtn").style.display = "inline-block";
  document.getElementById("stopBtn").style.display = "inline-block";

  load();
  updateUI();
}

/* =========================
   QUESTION
========================= */

function load() {
  const q = questions[i];

  document.getElementById("question").innerHTML =
    "Combien de chiffres significatifs dans : " + q.q;

  document.getElementById("answer").value = "";
  document.getElementById("feedback").textContent = "";
}

/* =========================
   REPONSE
========================= */

function submit() {

  if (!playing) return;

  const val = Number(document.getElementById("answer").value);
  const good = questions[i].a;

  if (isNaN(val)) {
    document.getElementById("feedback").textContent = "⚠ entre un nombre";
    sound("heavy");
    return;
  }

  if (val === good) {
    score++;
    streak++;
    sound("good");
    document.getElementById("feedback").textContent = "✔ Correct";
  } else {
    streak = 0;

    if (Math.abs(val - good) === 1) {
      sound("light");
    } else {
      sound("heavy");
    }

    document.getElementById("feedback").textContent =
      "✘ Faux (réponse : " + good + ")";
  }

  level = 1 + Math.floor(score / 5);
  i++;

  updateUI();

  if (i >= questions.length) {
    playing = false;
    return;
  }

  setTimeout(load, 400);
}

/* =========================
   UI
========================= */

function updateUI() {
  document.getElementById("score").textContent = score;
  document.getElementById("streak").textContent = streak;
  document.getElementById("level").textContent = level;

  document.getElementById("progress").style.width =
    (i / questions.length) * 100 + "%";
}

/* =========================
   INIT
========================= */

generate();
