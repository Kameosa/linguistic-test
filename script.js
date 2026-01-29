// === ПОДСТАВЬ свой URL Google Form ===
const FORM_URL = "https://docs.google.com/forms/d/e/1FAIpQLSeb7aZPzETSR3Uzp3K99XZ2OeFYK7B8yM6XKHWlgIUBy4p75w/viewform"; 
const SHEET_URL = "https://script.google.com/macros/s/AKfycbyBDQ3AVo7CMEHCM5hOQfZx_ROBPvFAbZV6tfJOGJbTaRdhizvX--JGiyaAXBtI7kMRzw/exec"; // твой Apps Script

// === Список стимулов ===
const words = [
  { text: "акари", vowels: [1, 3, 5], audio: "audio/akari.wav" },
  { text: "сакура", vowels: [2, 4, 6], audio: "audio/sakura.wav" }
];

let current = 0;
let audio;
let participant = "";

// ==== Элементы ====
const welcome = document.getElementById("welcome-screen");
const startBtn = document.getElementById("start-btn");
const formBtn = document.getElementById("open-form-btn");
const app = document.getElementById("app");
const wordEl = document.getElementById("word");
const progressEl = document.getElementById("progress");
const audioBtn = document.getElementById("audio-btn");

// === Открыть анкету ===
formBtn.addEventListener("click", () => {
  console.log("Открываю форму:", FORM_URL);
  window.open(FORM_URL, "_blank");
});

// === Начать тест ===
startBtn.addEventListener("click", () => {
  participant = prompt("Введите свой идентификатор участника (такой же, как в анкете):", "");
  if (!participant) {
    alert("Пожалуйста, введите идентификатор участника!");
    return;
  }
  welcome.style.display = "none";
  app.style.display = "block";
  loadWord(current);
});

function loadWord(i) {
  const w = words[i];
  progressEl.textContent = `Слово ${i + 1} из ${words.length}`;
  wordEl.innerHTML = "";

  w.text.split("").forEach((c, j) => {
    const span = document.createElement("span");
    span.textContent = c;
    span.classList.add("syllable");

    if (w.vowels.includes(j + 1)) {
      const marker = document.createElement("div");
      marker.classList.add("marker");
      marker.textContent = w.vowels.indexOf(j + 1) + 1;
      marker.addEventListener("click", () => chooseStress(w.vowels.indexOf(j + 1) + 1));
      span.appendChild(marker);
    }
    wordEl.appendChild(span);
  });

  playAudio(w.audio);
}

function playAudio(src) {
  if (audio) audio.pause();
  audio = new Audio(src);
  audio.play();
}

function chooseStress(num) {
  document.querySelectorAll(".marker").forEach(m => m.classList.remove("selected"));
  document.querySelectorAll(".marker")[num - 1].classList.add("selected");

  fetch(SHEET_URL, {
    method: "POST",
    mode: "no-cors",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      participant: participant,
      word: words[current].text,
      stress: num
    })
  });

  setTimeout(nextWord, 1000);
}

function nextWord() {
  current++;
  if (current < words.length) loadWord(current);
  else {
    progressEl.textContent = "Эксперимент завершён. Спасибо!";
    wordEl.innerHTML = "";
    audioBtn.style.display = "none";
  }
}

audioBtn.addEventListener("click", () => audio && audio.play());
