// ==========================
// НАСТРОЙКА СТИМУЛОВ
// ==========================
const words = [
  { text: "акари", vowels: [1, 3, 5], audio: "audio/akari.wav" },
  { text: "сакура", vowels: [1, 3, 5], audio: "audio/sakura.wav" }
];

// ==========================
// GOOGLE SHEETS (твой URL)
// ==========================
const SHEET_URL = "https://script.google.com/macros/s/AKfycbyBDQ3AVo7CMEHCM5hOQfZx_ROBPvFAbZV6tfJOGJbTaRdhizvX--JGiyaAXBtI7kMRzw/exec";

// ==========================
// СОСТОЯНИЕ ЭКСПЕРИМЕНТА
// ==========================
let current = 0;
let audio;
let participant = {}; // сюда запишем анкету

// ==========================
// DOM‑элементы
// ==========================
const formScreen = document.getElementById("form-screen");
const formSubmit = document.getElementById("form-submit");
const app = document.getElementById("app");
const wordEl = document.getElementById("word");
const audioBtn = document.getElementById("audio-btn");
const progressEl = document.getElementById("progress");

// ==========================
// Запуск эксперимента
// ==========================
formSubmit.addEventListener("click", () => {
  const gender = document.getElementById("gender").value;
  const age = document.getElementById("age").value;
  const native = document.getElementById("native").checked ? "да" : "нет";
  const pid = document.getElementById("participant-id").value.trim();
  const consent = document.getElementById("consent").checked;

  if (!consent) {
    alert("Чтобы начать исследование, необходимо дать согласие на участие.");
    return;
  }

  if (!gender || !age) {
    alert("Пожалуйста, выберите пол и возраст.");
    return;
  }

  participant = { id: pid || "аноним", gender, age, native, consent: "да" };

  formScreen.style.display = "none";
  app.style.display = "block";
  loadWord(current);
});


// ==========================
// Основные функции
// ==========================
function loadWord(index) {
  const w = words[index];
  progressEl.textContent = `Слово ${index + 1} из ${words.length}`;
  wordEl.innerHTML = "";

  w.text.split("").forEach((char, i) => {
    const span = document.createElement("span");
    span.textContent = char;
    span.classList.add("syllable");

    if (w.vowels.includes(i + 1)) {
      const marker = document.createElement("div");
      marker.classList.add("marker");
      marker.textContent = w.vowels.indexOf(i + 1) + 1;
      marker.addEventListener("click", () => chooseStress(w.vowels.indexOf(i + 1) + 1));
      span.appendChild(marker);
    }

    wordEl.appendChild(span);
  });

  playAudio(w.audio);
}

function playAudio(src) {
  if (audio) audio.pause();
  audio = new Audio(src);
  audio.play().catch(err => console.warn("Автоматическое воспроизведение заблокировано:", err));
}

function chooseStress(num) {
  document.querySelectorAll(".marker").forEach(m => m.classList.remove("selected"));
  document.querySelectorAll(".marker")[num - 1].classList.add("selected");

  const word = words[current].text;
  console.log(`Участник ${participant.id}: слог ${num} для слова "${word}"`);

  // 📤 сохраняем в таблицу
  fetch(SHEET_URL, {
    method: "POST",
    mode: "no-cors",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      timestamp: new Date().toISOString(),
      participant: participant.id,
      gender: participant.gender,
      age: participant.age,
      native: participant.native,
      word: word,
      stress: num
    })
  });

  setTimeout(nextWord, 1200);
}

function nextWord() {
  current++;
  if (current < words.length) {
    loadWord(current);
  } else {
    progressEl.textContent = "Эксперимент завершён.";
    wordEl.innerHTML = "<h2>Спасибо за участие!</h2>";
    audioBtn.style.display = "none";
  }
}

audioBtn.addEventListener("click", () => audio && audio.play());
