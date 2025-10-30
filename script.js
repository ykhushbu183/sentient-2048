const grid = document.getElementById("grid");
const size = 4;
let board = [];
let score = 0;
let bestScore = localStorage.getItem("bestScore") || 0;

function initBoard() {
  board = Array.from({ length: size }, () => Array(size).fill(0));
  score = 0;
  addNumber();
  addNumber();
  drawBoard();
  updateScore();
}

function drawBoard() {
  grid.innerHTML = "";
  for (let r = 0; r < size; r++) {
    for (let c = 0; c < size; c++) {
      const cell = document.createElement("div");
      cell.className = "cell";
      const value = board[r][c];
      if (value !== 0) {
        cell.textContent = value;
        cell.dataset.value = value;
      }
      grid.appendChild(cell);
    }
  }
}

function addNumber() {
  let empty = [];
  for (let r = 0; r < size; r++) {
    for (let c = 0; c < size; c++) {
      if (board[r][c] === 0) empty.push({ r, c });
    }
  }
  if (empty.length === 0) return;
  const { r, c } = empty[Math.floor(Math.random() * empty.length)];
  board[r][c] = Math.random() < 0.9 ? 2 : 4;
}

function slide(row) {
  row = row.filter(val => val);
  for (let i = 0; i < row.length - 1; i++) {
    if (row[i] === row[i + 1]) {
      row[i] *= 2;
      score += row[i];
      row[i + 1] = 0;
    }
  }
  row = row.filter(val => val);
  while (row.length < size) row.push(0);
  return row;
}

function rotateBoard() {
  let newBoard = Array.from({ length: size }, () => Array(size).fill(0));
  for (let r = 0; r < size; r++) {
    for (let c = 0; c < size; c++) {
      newBoard[r][c] = board[c][r];
    }
  }
  return newBoard;
}

function handleMove(direction) {
  let oldBoard = JSON.stringify(board);

  if (direction === "left") {
    for (let r = 0; r < size; r++) board[r] = slide(board[r]);
  } else if (direction === "right") {
    for (let r = 0; r < size; r++) board[r] = slide(board[r].reverse()).reverse();
  } else if (direction === "up") {
    board = rotateBoard();
    for (let r = 0; r < size; r++) board[r] = slide(board[r]);
    board = rotateBoard();
  } else if (direction === "down") {
    board = rotateBoard();
    for (let r = 0; r < size; r++) board[r] = slide(board[r].reverse()).reverse();
    board = rotateBoard();
  }

  if (JSON.stringify(board) !== oldBoard) {
    addNumber();
    drawBoard();
    updateScore();
  }
}

function updateScore() {
  document.getElementById("score").textContent = score;
  if (score > bestScore) {
    bestScore = score;
    localStorage.setItem("bestScore", bestScore);
  }
  document.getElementById("best").textContent = bestScore;
}

function newGame() {
  initBoard();
}

window.addEventListener("keydown", (e) => {
  if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(e.key)) {
    e.preventDefault();
    if (e.key === "ArrowUp") handleMove("up");
    if (e.key === "ArrowDown") handleMove("down");
    if (e.key === "ArrowLeft") handleMove("left");
    if (e.key === "ArrowRight") handleMove("right");
  }
});

let startX, startY;
grid.addEventListener("touchstart", e => {
  const touch = e.touches[0];
  startX = touch.clientX;
  startY = touch.clientY;
});

grid.addEventListener("touchend", e => {
  const touch = e.changedTouches[0];
  const dx = touch.clientX - startX;
  const dy = touch.clientY - startY;
  if (Math.abs(dx) > Math.abs(dy)) {
    if (dx > 30) handleMove("right");
    if (dx < -30) handleMove("left");
  } else {
    if (dy > 30) handleMove("down");
    if (dy < -30) handleMove("up");
  }
});

initBoard();
