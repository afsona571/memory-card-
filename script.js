const gameContainer = document.querySelector(".game");
const resetButton = document.querySelector(".reset");
const timerDisplay = document.querySelector(".timer");
const movesDisplay = document.querySelector(".moves");
const winMessage = document.querySelector(".win-message");

let emojis = ["😂", "😎", "🥰", "😤", "😡", "🤩", "🤧", "😺"]; // добавлен "😺"
let emojiList = [...emojis, ...emojis]; // парные смайлы
let firstCard = null;
let secondCard = null;
let lockBoard = false;
let moves = 0;
let timer = 0;
let interval = null;

function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

function startTimer() {
  timer = 0;
  timerDisplay.textContent = timer;
  clearInterval(interval);
  interval = setInterval(() => {
    timer++;
    timerDisplay.textContent = timer;
  }, 1000);
}

function stopTimer() {
  clearInterval(interval);
}

function resetStats() {
  moves = 0;
  movesDisplay.textContent = moves;
  winMessage.classList.add("hidden");
}

function createBoard() {
  shuffle(emojiList);
  gameContainer.innerHTML = "";
  resetStats();
  startTimer();

  emojiList.forEach((emoji) => {
    const card = document.createElement("div");
    card.classList.add("item");
    card.dataset.emoji = emoji;
    card.textContent = "";
    card.addEventListener("click", handleFlip);
    gameContainer.appendChild(card);
  });
}

function handleFlip() {
  if (lockBoard || this.classList.contains("correct") || this === firstCard) return;

  this.textContent = this.dataset.emoji;
  this.classList.add("flipped");

  if (!firstCard) {
    firstCard = this;
  } else {
    secondCard = this;
    moves++;
    movesDisplay.textContent = moves;
    checkMatch();
  }
}

function checkMatch() {
  lockBoard = true;

  if (firstCard.dataset.emoji === secondCard.dataset.emoji) {
    firstCard.classList.add("correct");
    secondCard.classList.add("correct");
    resetTurn();
    checkWin();
  } else {
    setTimeout(() => {
      firstCard.textContent = "";
      secondCard.textContent = "";
      firstCard.classList.remove("flipped");
      secondCard.classList.remove("flipped");
      resetTurn();
    }, 800);
  }
}

function resetTurn() {
  [firstCard, secondCard] = [null, null];
  lockBoard = false;
}

function checkWin() {
  const allCorrect = document.querySelectorAll(".item.correct");
  if (allCorrect.length === emojiList.length) {
    stopTimer();
    winMessage.classList.remove("hidden");
  }
}

resetButton.addEventListener("click", createBoard);

createBoard();
