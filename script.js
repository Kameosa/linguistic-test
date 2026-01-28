const words = [
  {
    text: "あかり",
    vowelsCount: 3,
    audio: "audio/akari.wav"
  },
  {
    text: "さくら",
    vowelsCount: 3,
    audio: "audio/sakura.wav"
  }
];

let current = 0;
let audio;

const startScreen = document.getElementById("start-screen");
const startBtn = document.getElementById("start-btn");
const app = document.getElementById("app");
const wordEl = document.getElementById("word");
const markersEl = document.getElementById("markers");
const audioBtn = document.getElementById("audio-btn");
const progressEl = document.getElementById("progress");

// старт эксперимента
startBtn.addEventListener("click", () => {
  startScreen.style.display = "none";
  app.style.display = "block";
  loadWord(current);
});

function loadWord(index) {
  const w = words[index];
  progressEl.textContent = `Слово ${index + 1} из ${words.length}`;
  wordEl.textContent = w.text;
  markersEl.innerHTML = "";

  // создаем маркеры
  for (let i = 1; i <= w.vowelsCount; i++) {
    const marker = document.createElement("span");
    marker.textContent = i;
    marker.classList.add("marker");
    marker.addEventListener("click", () => chooseStress(i));
    markersEl.appendChild(marker);
  }

  playAudio(w.audio);
}

function playAudio(src) {
  if (audio) audio.pause();
  audio = new Audio(src);
  audio.play().catch(err => {
    console.warn("Автоматическое воспроизведение заблокировано:", err);
  });
}

function chooseStress(pos) {
  document.querySelectorAll(".marker").forEach(m => m.classList.remove("selected"));
  const selected = document.querySelector(`.marker:nth-child(${pos})`);
  selected.classList.add("selected");

  console.log(`Выбран слог ${pos} для слова "${words[current].text}"`);

  setTimeout(nextWord, 1200);
}

function nextWord() {
  current++;
  if (current < words.length) {
    loadWord(current);
  } else {
    wordEl.textContent = "Спасибо за участие!";
    markersEl.innerHTML = "";
    progressEl.textContent = "Эксперимент завершён.";
    audioBtn.style.display = "none";
  }
}

audioBtn.addEventListener("click", () => {
  if (audio) audio.play();
});
