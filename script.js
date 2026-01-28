// ==========================
// НАСТРОЙКА СТИМУЛОВ
// ==========================
const words = [
  {
    text: "акари",
    vowels: [1, 3, 5], // позиции гласных (а, а, и)
    audio: "audio/akari.wav"
  },
  {
    text: "сакура",
    vowels: [1, 3, 5], // (а, у, а)
    audio: "audio/sakura.wav"
  }
];

let current = 0;
let audio;

// ==========================
// DOM-элементы
// ==========================
const startScreen = document.getElementById("start-screen");
const startBtn = document.getElementById("start-btn");
const app = document.getElementById("app");
const wordEl = document.getElementById("word");
const audioBtn = document.getElementById("audio-btn");
const progressEl = document.getElementById("progress");

// ==========================
// Запуск эксперимента
// ==========================
startBtn.addEventListener("click", () => {
  startScreen.style.display = "none";
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

  // создаем буквы и маркеры
  w.text.split("").forEach((char, i) => {
    const span = document.createElement("span");
    span.textContent = char;
    span.classList.add("syllable");

    // если буква — гласная (по позиции из списка)
    if (w.vowels.includes(i + 1)) {
      const marker = document.createElement("div");
      marker.classList.add("marker");
      marker.textContent = w.vowels.indexOf(i + 1) + 1; // 1, 2, 3...
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
  audio.play().catch(err => {
    console.warn("Автоматическое воспроизведение заблокировано:", err);
  });
}

function chooseStress(num) {
  document.querySelectorAll(".marker").forEach(m => m.classList.remove("selected"));
  document.querySelectorAll(".marker")[num - 1].classList.add("selected");

  console.log(`Выбран ${num}-й слог в слове "${words[current].text}"`);

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

audioBtn.addEventListener("click", () => {
  if (audio) audio.play();
});
