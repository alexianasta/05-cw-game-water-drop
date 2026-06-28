// Game state variables
let gameRunning = false;
let dropMaker;
let timerInterval;
let score = 0;
let timeLeft = 30;

const scoreElement = document.getElementById("score");
const timeElement = document.getElementById("time");
const gameContainer = document.getElementById("game-container");
const endMessageElement = document.getElementById("end-message");
const startButton = document.getElementById("start-btn");
const resetButton = document.getElementById("reset-btn");

const winningMessages = [
  "Great job! You caught the storm!",
  "You’re a water drop whiz! Keep shining!",
  "Perfect splash performance! You win!"
];

const losingMessages = [
  "Nice try! Drop back in and try again.",
  "Almost there! Practice makes perfect.",
  "Don't give up—next time you’ll beat 20!"
];

// Wait for button click to start or reset the game
startButton.addEventListener("click", startGame);
resetButton.addEventListener("click", resetGame);

function startGame() {
  if (gameRunning) return;

  gameRunning = true;
  score = 0;
  timeLeft = 30;
  updateScoreDisplay();
  updateTimeDisplay();
  endMessageElement.textContent = "";
  startButton.textContent = "Game Running...";
  startButton.disabled = true;
  resetButton.style.display = "inline-block";
  resetButton.disabled = false;

  dropMaker = setInterval(createDrop, 1000);
  timerInterval = setInterval(updateTimer, 1000);
}

function endGame() {
  gameRunning = false;
  clearInterval(dropMaker);
  clearInterval(timerInterval);
  startButton.textContent = "Start Game";
  startButton.disabled = false;

  // Remove any remaining drops from the screen
  gameContainer.querySelectorAll(".water-drop").forEach((drop) => drop.remove());

  if (score >= 20) {
    endMessageElement.textContent = winningMessages[Math.floor(Math.random() * winningMessages.length)];
    endMessageElement.classList.remove("lose");
    endMessageElement.classList.add("win");
    celebrateWin();
  } else {
    endMessageElement.textContent = losingMessages[Math.floor(Math.random() * losingMessages.length)];
    endMessageElement.classList.remove("win");
    endMessageElement.classList.add("lose");
  }
}

function resetGame() {
  clearInterval(dropMaker);
  clearInterval(timerInterval);
  gameRunning = false;
  score = 0;
  timeLeft = 30;
  updateScoreDisplay();
  updateTimeDisplay();
  endMessageElement.textContent = "";
  startButton.textContent = "Start Game";
  startButton.disabled = false;
  resetButton.disabled = true;
  resetButton.style.display = "none";
  document.querySelectorAll(".water-drop, .confetti-container").forEach((element) => element.remove());
}

function celebrateWin() {
  const confettiContainer = document.createElement("div");
  confettiContainer.className = "confetti-container";

  const colors = ["#FFC907", "#111111", "#d32f2f", "#0084d1"];
  const count = 28;

  for (let i = 0; i < count; i += 1) {
    const piece = document.createElement("span");
    piece.className = "confetti-piece";
    piece.style.left = `${Math.random() * 100}%`;
    piece.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
    piece.style.width = `${Math.random() * 8 + 6}px`;
    piece.style.height = `${Math.random() * 18 + 8}px`;
    piece.style.animationDelay = `${Math.random() * 0.6}s`;
    piece.style.transform = `rotate(${Math.random() * 360}deg)`;
    confettiContainer.appendChild(piece);
  }

  gameContainer.appendChild(confettiContainer);
  setTimeout(() => confettiContainer.remove(), 3200);
}

function updateTimer() {
  timeLeft -= 1;
  updateTimeDisplay();

  if (timeLeft <= 0) {
    timeLeft = 0;
    updateTimeDisplay();
    endGame();
  }
}

function updateScoreDisplay() {
  scoreElement.textContent = score;
}

function updateTimeDisplay() {
  timeElement.textContent = timeLeft;
}

function createDrop() {
  const drop = document.createElement("div");
  drop.className = "water-drop";

  const isBadDrop = Math.random() < 0.25;
  if (isBadDrop) {
    drop.classList.add("bad-drop");
  }

  const initialSize = 60;
  const sizeMultiplier = Math.random() * 0.8 + 0.5;
  const size = initialSize * sizeMultiplier;
  drop.style.width = drop.style.height = `${size}px`;

  const gameWidth = gameContainer.offsetWidth;
  const xPosition = Math.random() * Math.max(0, gameWidth - size);
  drop.style.left = xPosition + "px";

  drop.style.animationDuration = "4s";

  drop.addEventListener("click", () => {
    if (!gameRunning) return;

    if (isBadDrop) {
      score = Math.max(0, score - 1);
    } else {
      score += 1;
    }

    updateScoreDisplay();
    drop.remove();
  });

  drop.addEventListener("animationend", () => {
    drop.remove();
  });

  gameContainer.appendChild(drop);
}

