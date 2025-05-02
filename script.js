// Module to manage the game board state
const gameboard = (() => {
    const board = [["", "", ""], ["", "", ""], ["", "", ""]]; // 3x3 grid initialized as empty

    // Get current board state
    const getBoard = () => board;

    // Set a cell's value if it's empty
    const setBoard = (row, col, value) => {
        if (board[row][col] === "") {
            board[row][col] = value;
        }
    }

    // Reset the board to empty values
    const resetBoard = () => {
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                board[i][j] = "";
            }
        }
    }

    return { getBoard, setBoard, resetBoard };
})();

// Module to manage the UI display
const displayController = (() => {
    const message = document.querySelector("#message");

    // Update a specific cell's appearance
    const updateCell = (row, col, value) => {
        const cell = document.querySelector(`#cell-${row}-${col}`);
        cell.textContent = value;
        cell.classList.remove("x", "o"); // Clear previous styles

        if (value === "X") {
            cell.classList.add("x");
        } else if (value === "O") {
            cell.classList.add("o");
        }
    }

    // Show messages like win/draw info
    const showMessage = (text) => {
        message.textContent = text;
    }

    // Clear the board and message display
    const resetDisplay = () => {
        const cells = document.querySelectorAll(".cell");
        cells.forEach(cell => {
            cell.textContent = "";
        });
        message.textContent = "";
    }

    return { updateCell, showMessage, resetDisplay };
})();

// Factory function to create player objects
const playerFactory = (name, symbol) => {
    const getName = () => name;
    const getSymbol = () => symbol;
    return { getName, getSymbol };
}

// Main game module
const game = (() => {
    const player1 = playerFactory("Player 1", "X");
    const player2 = playerFactory("Player 2", "O");
    let currentPlayer = player1;
    let gameOver = false;

    // Switch to the other player
    const switchPlayer = () => {
        currentPlayer = currentPlayer === player1 ? player2 : player1;
    }

    // Update hover ghost effect based on current player
    const updateHoverStyle = () => {
        const cells = document.querySelectorAll(".cell");
        cells.forEach(cell => {
            cell.classList.remove("hover-x", "hover-o");
            cell.removeAttribute("data-ghost");

            if (cell.textContent === "") {
                if (currentPlayer.getSymbol() === "X") {
                    cell.classList.add("hover-x");
                    cell.setAttribute("data-ghost", "X");
                } else {
                    cell.classList.add("hover-o");
                    cell.setAttribute("data-ghost", "O");
                }
            }
        });
    };

    // Check if the current player has won
    const checkWinner = () => {
        const board = gameboard.getBoard();
        const symbol = currentPlayer.getSymbol();

        // Rows
        for (let i = 0; i < 3; i++) {
            if (board[i][0] === symbol && board[i][1] === symbol && board[i][2] === symbol) {
                return true;
            }
        }

        // Columns
        for (let i = 0; i < 3; i++) {
            if (board[0][i] === symbol && board[1][i] === symbol && board[2][i] === symbol) {
                return true;
            }
        }

        // Diagonals
        if (board[0][0] === symbol && board[1][1] === symbol && board[2][2] === symbol) {
            return true;
        }
        if (board[0][2] === symbol && board[1][1] === symbol && board[2][0] === symbol) {
            return true;
        }

        return false;
    }

    // Check if the game is a draw
    const checkDraw = () => {
        const board = gameboard.getBoard();
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                if (board[i][j] === "") {
                    return false;
                }
            }
        }
        return true;
    }

    // Handle what happens when a cell is clicked
    const handleCellClick = (row, col) => {
        if (gameOver || gameboard.getBoard()[row][col] !== "") return;

        // Update game state and UI
        gameboard.setBoard(row, col, currentPlayer.getSymbol());
        displayController.updateCell(row, col, currentPlayer.getSymbol());

        if (checkWinner()) {
            displayController.showMessage(`${currentPlayer.getName()} wins!`);
            gameOver = true;
        } else if (checkDraw()) {
            displayController.showMessage("It's a draw!");
            gameOver = true;
        } else {
            switchPlayer();
            updateHoverStyle();
        }
    }

    // Reset the entire game
    const resetGame = () => {
        console.log("Resetting game...");
        gameboard.resetBoard();
        displayController.resetDisplay();
        currentPlayer = player1;
        gameOver = false;
        updateHoverStyle();
    }

    // Initialize game: build board, add listeners
    const init = () => {
        const gameboardElement = document.querySelector("#gameboard");

        // Create grid cells
        for (let row = 0; row < 3; row++) {
            for (let col = 0; col < 3; col++) {
                const cell = document.createElement("div");
                cell.classList.add("cell");
                cell.id = `cell-${row}-${col}`;
                gameboardElement.appendChild(cell);
            }
        }

        // Add click events for cells
        const cells = document.querySelectorAll(".cell");
        cells.forEach((cell, index) => {
            cell.addEventListener("click", () => {
                const row = Math.floor(index / 3);
                const col = index % 3;
                handleCellClick(row, col);
            });
        });

        // Add reset button listener
        const resetButton = document.querySelector("#reset-button");
        resetButton.addEventListener("click", resetGame);

        updateHoverStyle(); // Show initial hover effects
    };

    return { init, resetGame }; // Public methods
})();

// Start game once DOM is fully loaded
window.addEventListener("DOMContentLoaded", () => {
    game.init();
});
