const X = "X";
const O = "O";
let board;
let currentPlayer;
let gameOver = false;

function initializeGame() {
  board = ["", "", "", "", "", "", "", "", ""];
  currentPlayer = document.querySelector('input[name="side"]:checked').value;
  gameOver = false;
  document.querySelectorAll(".cell").forEach((cell) => (cell.textContent = ""));
  if (currentPlayer === O) {
    const bestMove = getBestMove();
    board[bestMove] = O;
    document.querySelector(`.cell[data-index="${bestMove}"]`).textContent = O;
    currentPlayer = X;
  }
}

document.querySelectorAll(".cell").forEach((cell) => {
  cell.addEventListener("click", () => {
    if (gameOver) return;

    const index = cell.getAttribute("data-index");
    if (!board[index]) {
      board[index] = currentPlayer;
      cell.textContent = currentPlayer;
      if (checkWinner(currentPlayer)) {
        setTimeout(() => alert(`${currentPlayer} Wins!`), 10);
        gameOver = true;
        return;
      }
      if (!board.includes("")) {
        setTimeout(() => alert("It's a Tie!"), 10);
        gameOver = true;
        return;
      }
      currentPlayer = currentPlayer === X ? O : X;
      if (currentPlayer === O && !gameOver) {
        const bestMove = getBestMove();
        board[bestMove] = O;
        document.querySelector(`.cell[data-index="${bestMove}"]`).textContent =
          O;
        if (checkWinner(O)) {
          setTimeout(() => alert(`O Wins!`), 10);
          gameOver = true;
          return;
        }
        currentPlayer = X;
      }
    }
  });
});

document
  .getElementById("restart-btn")
  .addEventListener("click", initializeGame);

document.querySelectorAll('input[name="side"]').forEach((input) => {
  input.addEventListener("change", initializeGame);
});

document.getElementById("theme-switch").addEventListener("change", (event) => {
  if (event.target.checked) {
    document.body.classList.add("dark-mode");
  } else {
    document.body.classList.remove("dark-mode");
  }
});

function checkWinner(player) {
  const winPatterns = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  return winPatterns.some((pattern) => {
    return pattern.every((index) => board[index] === player);
  });
}

function getBestMove() {
  let bestScore = -Infinity;
  let move;
  for (let i = 0; i < board.length; i++) {
    if (!board[i]) {
      board[i] = O;
      let score = minimax(board, 0, false);
      board[i] = "";
      if (score > bestScore) {
        bestScore = score;
        move = i;
      }
    }
  }
  return move;
}

function minimax(board, depth, isMaximizing) {
  const scores = { [O]: 10, [X]: -10, Tie: 0 };
  const result = checkGameOver();
  if (result !== null) return scores[result];

  if (isMaximizing) {
    let bestScore = -Infinity;
    for (let i = 0; i < board.length; i++) {
      if (!board[i]) {
        board[i] = O;
        let score = minimax(board, depth + 1, false);
        board[i] = "";
        bestScore = Math.max(score, bestScore);
      }
    }
    return bestScore;
  } else {
    let bestScore = Infinity;
    for (let i = 0; i < board.length; i++) {
      if (!board[i]) {
        board[i] = X;
        let score = minimax(board, depth + 1, true);
        board[i] = "";
        bestScore = Math.min(score, bestScore);
      }
    }
    return bestScore;
  }
}

function checkGameOver() {
  if (checkWinner(O)) return O;
  if (checkWinner(X)) return X;
  return board.includes("") ? null : "Tie";
}

initializeGame();
