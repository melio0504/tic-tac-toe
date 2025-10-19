// Utilize Factory Function and Module Pattern
function Gameboard() {
  // This will create the 3x3 arrays for the Gameboard
  const ROWS = 3;
  const COLS = 3;
  let board = [];

  for (let i = 0; i < ROWS; i++) {
    board[i] = [];
    for (let j = 0; j < COLS; j++) {
      board[i].push(Mark());
    }
  }

  const getBoard = () => board;

  const markBoard = (row, col, player) => {
    const availableSpot = board.filter((row) => row[row][col].getMark() === 0).map(row => row[column]);

    if (!availableSpot.length) return;

    board[row][col].addMark(player);
  }

  // This will show the board with Marks in it
  const showBoard = () => {
    const boardWithMarks = board.map((row) => row.map((mark) => mark.getValue()));

    console.log(boardWithMarks);
  }

  return {
    getBoard,
    markBoard,
    showBoard
  }
}

// This will add mark in spot
function Mark() {
  let value = 0;

  const addMark = (player) => {
    value = player;
  };

  const getMark = () => value;

  return {
    addMark,
    getMark
  };
}

// This will handle the game logic
function gameController(player1 = 'Player One', player2 = 'Player Two') {
  const board = Gameboard();

  const players = [
    {
      name: player1,
      mark: 'O'
    },
    {
      name: player2,
      mark: 'X'
    }
  ]

  let activePlayer = players[0];

  const playerTurn = () => {
    activePlayer = activePlayer === players[0] ? players[1] : players[0];
  };

  const getActivePlayer = () => activePlayer;

  const printNewRound = () => {
    board.showBoard();
    console.log(`${getActivePlayer().name}'s Turn`);
  }

  const playRound = (row, col) => {
    console.log(`${getActivePlayer().name} put the mark into column ${column}...`)
    
    board.markBoard(row, col, getActivePlayer().name);

    playerTurn();
    printNewRound();
  }

  return {
    playRound,
    getActivePlayer
  }
}

const game = gameController();
