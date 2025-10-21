document.addEventListener("DOMContentLoaded", () => {
    const cells = document.querySelectorAll(".cell");
    const turnIndicator = document.getElementById("turn-indicator");
    const restartBtn = document.getElementById("resetGame");

    const xScore = document.querySelector(".x-score span");
    const oScore = document.querySelector(".o-score span");
    const tiesScore = document.querySelector(".ties span");

    const playVsCPUButton = document.getElementById("playVsCPU");
    const playVsFriendButton = document.getElementById("playVsFriend");

    let gameBoard = ["", "", "", "", "", "", "", "", ""];
    let currentPlayer = "X";
    let gameActive = true;
    let playVsCPU = true;
    let scores = { X: 0, O: 0, ties: 0 };

    const winningCombinations = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8],
        [0, 3, 6], [1, 4, 7], [2, 5, 8],
        [0, 4, 8], [2, 4, 6]
    ];

    playVsCPUButton.addEventListener("click", () => switchMode(true));
    playVsFriendButton.addEventListener("click", () => switchMode(false));

    function switchMode(cpuMode) {
        playVsCPU = cpuMode;
        playVsCPUButton.classList.toggle("active", cpuMode);
        playVsFriendButton.classList.toggle("active", !cpuMode);
        resetGame();
    }

    cells.forEach(cell => {
        cell.addEventListener("click", () => {
            const index = cell.getAttribute("data-index");

            if (gameBoard[index] || !gameActive) return;

            gameBoard[index] = currentPlayer;
            cell.textContent = currentPlayer;

            if (checkWinner()) return;
            if (checkDraw()) return;

            switchTurn();

            if (playVsCPU && currentPlayer === "O" && gameActive) {
                setTimeout(cpuMove, 500);
            }
        });
    });

    function switchTurn() {
        currentPlayer = currentPlayer === "X" ? "O" : "X";
        turnIndicator.textContent = `${currentPlayer} TURN`;
    }

    function checkWinner() {
        for (const [a, b, c] of winningCombinations) {
            if (gameBoard[a] && gameBoard[a] === gameBoard[b] && gameBoard[a] === gameBoard[c]) {
                gameActive = false;
                turnIndicator.textContent = `Winner: ${gameBoard[a]}`;
                scores[gameBoard[a]]++;
                updateScore();
                return true;
            }
        }
        return false;
    }

    function checkDraw() {
        if (!gameBoard.includes("") && gameActive) {
            gameActive = false;
            turnIndicator.textContent = "Draw!";
            scores.ties++;
            updateScore();
            return true;
        }
        return false;
    }

    function cpuMove() {
        if (!gameActive) return;

        for (const [a, b, c] of winningCombinations) {
            if (gameBoard[a] === "O" && gameBoard[b] === "O" && gameBoard[c] === "") return makeMove(c);
            if (gameBoard[a] === "O" && gameBoard[c] === "O" && gameBoard[b] === "") return makeMove(b);
            if (gameBoard[b] === "O" && gameBoard[c] === "O" && gameBoard[a] === "") return makeMove(a);
        }

        for (const [a, b, c] of winningCombinations) {
            if (gameBoard[a] === "X" && gameBoard[b] === "X" && gameBoard[c] === "") return makeMove(c);
            if (gameBoard[a] === "X" && gameBoard[c] === "X" && gameBoard[b] === "") return makeMove(b);
            if (gameBoard[b] === "X" && gameBoard[c] === "X" && gameBoard[a] === "") return makeMove(a);
        }

        if (gameBoard[4] === "") return makeMove(4);

        const corners = [0, 2, 6, 8].filter(index => gameBoard[index] === "");
        if (corners.length > 0) return makeMove(corners[Math.floor(Math.random() * corners.length)]);

        const availableCells = gameBoard
            .map((val, idx) => (val === "" ? idx : null))
            .filter(val => val !== null);

        if (availableCells.length > 0) {
            makeMove(availableCells[Math.floor(Math.random() * availableCells.length)]);
        }
    }

    function makeMove(index) {
        gameBoard[index] = "O";
        cells[index].textContent = "O";

        if (checkWinner()) return;
        if (checkDraw()) return;

        switchTurn();
    }

    function updateScore() {
        xScore.textContent = scores.X;
        oScore.textContent = scores.O;
        tiesScore.textContent = scores.ties;
    }

    function resetGame() {
        gameBoard.fill("");
        cells.forEach(cell => (cell.textContent = ""));
        gameActive = true;
        currentPlayer = "X";
        turnIndicator.textContent = "X TURN";
    }

    restartBtn.addEventListener("click", resetGame);
});