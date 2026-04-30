let questions = [];
let i = 0;
let score = 0;
let streak = 0;
let level = 1;
let playing = false;

/* =========================
   GENERATION PROGRESSIVE
========================= */

function generate() {
  questions = [];

  for (let k = 0; k < 200; k++) {
    const lvl = Math.floor(k / 50); // 4 niveaux

    let q, a;

    /* ---------------- FACILE ---------------- */
    if (lvl === 0) {
      const pool = [
        { q: "0,00450", a: 3 },
        { q: "12,0", a: 3 },
        { q: "100", a: 1 },
        { q: "45,6", a: 3 },
        { q: "0,120", a: 3 },
        { q: "7,00", a: 3 },
        { q: "500", a: 1 }
      ];

      ({ q, a } = pool[Math.floor(Math.random() * pool.length)]);
    }

    /* ---------------- MOYEN ---------------- */
    else if (lvl === 1) {
      const pool = [
        { q: "1,2300", a: 5 },
        { q: "0,0100", a: 3 },
        { q: "120,0", a: 4 },
        { q: "78,900", a: 5 },
        { q: "0,00320", a: 3 },
        { q: "1000,0", a: 5 },
        { q: "6,02 × 10^23", a: 3 },
        { q: "9,81 × 10^0", a: 3 }
      ];

      ({ q, a } = pool[Math.floor(Math.random() * pool.length)]);
    }

    /* ---------------- DIFFICILE ---------------- */
    else if (lvl === 2) {
      const pool = [
        { q: "3,00 × 10^8", a: 3 },
        { q: "1,00 × 10^-6", a: 3 },
        { q: "2,50 × 10^4", a: 3 },
        { q: "5,000 × 10^2", a: 4 },
        { q: "0,000450", a: 3 },
        { q: "6,022 × 10^23", a: 4 }
      ];

      ({ q, a } = pool[Math.floor(Math.random() * pool.length)]);
    }

    /* ---------------- EXPERT ---------------- */
    else {
      const pool = [
        { q: "0,000100", a: 3 },
        { q: "100,00", a: 5 },
        { q: "1,0000", a: 5 },
        { q: "7,000 × 10^-3", a: 4 },
        { q: "0,04000", a: 4 },
        { q: "9,000 × 10^5", a: 4 }
      ];

      ({ q, a } = pool[Math.floor(Math.random() * pool.length)]);
    }

    questions.push({ q, a });
  }

  // mélange global
  questions.sort(() => Math.random() - 0.5);
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
  audio.play().catch(() => {});
}

/* =========================
   START GAME (FIX STABLE)
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

  document.getElementById("feedback").textContent = "";

  screenIn();

  requestAnimationFrame(() => {
    load();
    updateUI();
  });
}

/* =========================
   LOAD QUESTION
========================= */

function load() {
  if (!questions || questions.length === 0) return;

  const q = questions[i];
  if (!q) return;

  document.getElementById("question").textContent =
    "Combien de chiffres significatifs dans : " + q.q;

  document.getElementById("answer").value = "";
  document.getElementById("feedback").textContent = "";
}

/* =========================
   SUBMIT
========================= */

function submit() {
  if (!playing) return;

  const val = parseInt(document.getElementById("answer").value);
  const good = questions[i].a;

  if (val === good) {
    score++;
    streak++;
    sound("good");
    flash("good");
    document.getElementById("feedback").textContent = "✔ Correct !";
  } else {
    streak = 0;
    sound(Math.abs(val - good) === 1 ? "light" : "heavy");
    flash("bad");
    document.getElementById("feedback").textContent = "✘ Incorrect";
  }

  level = 1 + Math.floor(score / 5);
  i++;

  updateUI();
  save();

  if (i >= questions.length) {
    end();
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
   VISUAL FEEDBACK
========================= */

function flash(type) {
  const card = document.getElementById("card");

  card.classList.remove("good", "bad");
  void card.offsetWidth;
  card.classList.add(type);
}

/* =========================
   STOP / END
========================= */

function stopGame() {
  playing = false;
  screenOut();
}

function end() {
  playing = false;
  screenOut();
}

/* =========================
   SCREEN
========================= */

function screenIn() {
  document.getElementById("screen").style.opacity = 1;
}

function screenOut() {
  document.getElementById("screen").style.opacity = 0.3;
}

/* =========================
   STORAGE
========================= */

function save() {
  localStorage.setItem("sig_score", score);
  localStorage.setItem("sig_streak", streak);
}

function loadSave() {
  score = parseInt(localStorage.getItem("sig_score") || 0);
  streak = parseInt(localStorage.getItem("sig_streak") || 0);
}

/* =========================
   INIT
========================= */

loadSave();
