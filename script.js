// Gameboard

function Gameboard() {
    const rows = 3;
    const columns = 3;
    const board = [];
    for (let i = 0; i < rows; i++) {
        board[i] = [];
        for (let j = 0; j < columns; j++) {
            board[i].push(Cell());
        }
    }

    const getBoard = () => board;


    const dropMarker = (column, row, player) => {
        if (board[column][row].getValue() != 0) {
            return false;
        }
        board[column][row].addMark(player);
        return true;
    };
    

    const printBoard = () => {
        const boardWithCellValues = board.map((row) =>
            row.map((cell) => cell.getValue()))
        console.log(boardWithCellValues);
    };

    const checkWinner = (player) => {
        for (let row = 0; row < 3; row++) {
            if (board[row].every(cell => cell.getValue() === player))
                return true;
        }

        for (let col = 0; col < 3; col++) {
            if (board.every(row => row[col].getValue() === player)) {
                return true;
            }
        }

        if (board[0][0].getValue() === player &&
            board[1][1].getValue() === player &&
            board[2][2].getValue() === player) {
            return true;
        }

        if (board[0][2].getValue() === player &&
            board[1][1].getValue() === player &&
            board[2][0].getValue() === player) {
            return true;
        }

        return false;
    };

    return { getBoard, dropMarker, printBoard, checkWinner };
}

// Cell

function Cell() {
    let value = 0;

    const addMark = (player) => {
        value = player;
    };

    const getValue = () => value;

    return {
        addMark,
        getValue
    };
}

// Game flow

let gameOver = false;

function GameController(
    playerOneName = "Player One",
    playerTwoName = "Player Two"
) {
    const board = Gameboard();

    const players = [
        {
            name: playerOneName,
            marker: 1
        },
        {
            name: playerTwoName,
            marker: 2
        }
    ];

    let activePlayer = players[0];

    gameOver = false;

    const switchPlayerTurn = () => {
        activePlayer = activePlayer === players[0] ? players[1] : players[0];
    };

    const getActivePlayer = () => activePlayer;

    const printNewRound = () => {
        board.printBoard();
        if (!gameOver) {
            console.log(`${getActivePlayer().name}'s turn`)
        }
    };

    const playRound = (column, row) => {

        console.log(
            `Dropping ${getActivePlayer().name}'s marker into column ${column} row ${row}...`
        );

        if (!board.dropMarker(column, row, getActivePlayer().marker)) {
            console.log("That position is already taken! Try again.")
            return;
        }

        //Winner Logic

        if (board.checkWinner(getActivePlayer().marker)) {
            gameOver = true;
            board.printBoard();
            console.log(`${getActivePlayer().name} wins!`);
            return;
        }
        
        //Tie Logic


        const isBoardFull = () => {
            return board.getBoard().every(row =>
                row.every(cell => cell.getValue() !== 0)
            );
        };

        if (isBoardFull()) {
            console.log("It's a tie!");
            board.printBoard();
            gameOver = true;
            return;
        }

        switchPlayerTurn();
        printNewRound();
    };

    //Initial play game message
    printNewRound();

    return {
        playRound,
        getActivePlayer
    };
}

//DOM controls

const GameModule = function() {

    //Private variables

    let game;
    let playerOneText = document.querySelector("#player1").value;
    let playerTwoText = document.querySelector("#player2").value;
    let count = 0;
    let gameEnd = true;
    const player1Marker = "X";
    const player2Marker = "O";

    //Cache DOM elements

    const newGame = document.querySelector("#new-game");
    const changePlayer1 = document.querySelector("#change-player1");
    const changePlayer2 = document.querySelector("#change-player2");
    const squares = document.querySelectorAll('.square');
    const rows = document.querySelectorAll('div.row');

    //Private functions

    function isOdd(num) { return num % 2; }

    function bindEvents() {
        newGame.addEventListener('click', handleNewGame);
        bindPlayerChanges();
        bindSquareClicks();
    }

    function handleNewGame() {
        game = GameController(playerOneText, playerTwoText);
        count = 0;
        for (const square of squares) {
            square.textContent = "";
        }
        gameEnd = true;
        for (const row of rows) {
            row.style.visibility = "visible";
        }
    }

    function bindPlayerChanges() {
        [changePlayer1, changePlayer2].forEach((button, index) => {
            button.addEventListener('click', function() {
                const playerInput = document.querySelector(`#player${index + 1}`);
                if (index === 0) {
                    playerOneText = playerInput.value;
                } else {
                    playerTwoText = playerInput.value;
                }
            });
        });
    }

    function bindSquareClicks() {
        for (const square of squares) {
            square.addEventListener('click', function() {
                const [row, col] = square.id.split('-').map(Number);

                if (square.textContent == "" && gameEnd) {
                    game.playRound(row, col);
                    if (!isOdd(count) && gameEnd) {
                        square.textContent = player1Marker;
                    } else if (isOdd(count) && gameEnd) {
                        square.textContent = player2Marker;
                    }
                    count++;
                }
                if (gameOver == true) {
                    gameEnd = false;
                }
            });
        }
    }

    bindEvents();

}();