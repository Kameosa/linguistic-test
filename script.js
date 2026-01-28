// =============================
// Настройка списка стимулов
// =============================
const words = [
  {
    text: "акари",            // можно и латиницей — "akari"
    vowelsCount: 3,            // число гласных (слогов)
    audio: "akari.m4a"   // путь к файлу
  },
  {
    text: "сакура",
    vowelsCount: 3,
    audio: "sakura.m4a"
  }
];

// =============================
// Глобальные переменные
// =============================
let current = 0;
let audio;

// =============================
// DOM-элементы
// =============================
const wordEl = document.getElementById("word");
const markersEl = document.getElementById("markers");
const audioBtn = document.getElementById("audio-btn");
const progressEl = document.getElementById("progress");

// =============================
// Функции
// =============================
function loadWord(index) {
  const w = words[index];
  progressEl.textContent = `Слово ${index + 1} из ${words.length}`;
  wordEl.textContent = w.text;
  markersEl.innerHTML = "";

  // создаем кликабельные маркеры над гласными
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
  audio.play();
}

function chooseStress(pos) {
  // подсветить выбранный элемент
  document.querySelectorAll(".marker").forEach(m => m.classList.remove("selected"));
  const selected = document.querySelector(`.marker:nth-child(${pos})`);
  selected.classList.add("selected");

  // записать результат (здесь просто в консоль)
  console.log(`Выбран слог ${pos} для слова "${words[current].text}"`);

  // задержка перед переходом к следующему слову
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

// событие на кнопку "прослушать"
audioBtn.addEventListener("click", () => {
  if (audio) audio.play();
});

// автозапуск при загрузке страницы
window.onload = () => {
  loadWord(current);
};
