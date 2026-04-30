let questions = [];
let i = 0;
let score = 0;
let streak = 0;
let level = 1;
let playing = false;

/* ---------------- DATA ---------------- */

const base = [
  { q: "0,00450", a: 3 },
  { q: "12,0", a: 3 },
  { q: "100", a: 1 },
  { q: "1,2300", a: 5 },
  { q: "0,010", a: 2 },
  { q: "3,1416", a: 5 },
  { q: "2,00 × 10^3", a: 3 }
];

/* ---------------- GENERATION ---------------- */

function generate() {
  questions = [];
  for (let k = 0; k < 200; k++) {
    questions.push(base[k % base.length]);
  }
}

/* ---------------- AUDIO ---------------- */

function sound(type) {
  let a;

  if (type === "good") a = "goodSound";
  if (type === "light") a = "badLight";
  if (type === "heavy") a = "badHeavy";

  const audio = document.getElementById(a);
  audio.currentTime = 0;
  audio.play().catch(()=>{});
}

/* ---------------- GAME ---------------- */

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

  screenIn();
  load();
}

function load() {
  document.getElementById("question").textContent =
    "Combien de chiffres significatifs dans : " + questions[i].q;

  document.getElementById("answer").value = "";
  updateUI();
}

/* ---------------- ANSWER ---------------- */

function submit() {
  let val = parseInt(document.getElementById("answer").value);
  let good = questions[i].a;

  let card = document.getElementById("card");

  if (val === good) {
    score++;
    streak++;

    sound("good");
    flash("good");

  } else {
    streak = 0;

    if (Math.abs(val - good) === 1) {
      sound("light");
      flash("bad");
    } else {
      sound("heavy");
      flash("bad");
    }
  }

  level = 1 + Math.floor(score / 5);

  i++;

  save();

  if (i >= questions.length) {
    end();
    return;
  }

  setTimeout(load, 500);
  updateUI();
}

/* ---------------- UI EFFECTS ---------------- */

function flash(type) {
  const c = document.getElementById("card");

  c.classList.remove("good","bad");
  void c.offsetWidth;

  c.classList.add(type === "good" ? "good" : "bad");
}

/* ---------------- GAME CONTROL ---------------- */

function stopGame() {
  playing = false;
  screenOut();
}

function end() {
  playing = false;
  addRanking(score);
  screenOut();
}

/* ---------------- UI UPDATE ---------------- */

function updateUI() {
  document.getElementById("score").textContent = score;
  document.getElementById("streak").textContent = streak;
  document.getElementById("level").textContent = level;

  document.getElementById("progress").style.width =
    (i / questions.length) * 100 + "%";
}

/* ---------------- SCREEN ANIMATION ---------------- */

function screenIn() {
  document.getElementById("screen").style.opacity = 1;
}

function screenOut() {
  document.getElementById("screen").style.opacity = 0.3;
}

/* ---------------- LOCAL STORAGE ---------------- */

function save() {
  localStorage.setItem("sig_score", score);
  localStorage.setItem("sig_streak", streak);
}

function loadSave() {
  score = parseInt(localStorage.getItem("sig_score") || 0);
  streak = parseInt(localStorage.getItem("sig_streak") || 0);
}

/* ---------------- RANKING ---------------- */

function addRanking(s) {
  let data = JSON.parse(localStorage.getItem("ranking") || "[]");
  data.push(s);
  data.sort((a,b)=>b-a);
  data = data.slice(0,5);
  localStorage.setItem("ranking", JSON.stringify(data));

  showRanking();
}

function showRanking() {
  let data = JSON.parse(localStorage.getItem("ranking") || "[]");

  document.getElementById("rankingList").innerHTML =
    data.map((v,i)=> `<p>${i+1}. ${v}</p>`).join("");
}

/* ---------------- INIT ---------------- */

showRanking();
loadSave();
