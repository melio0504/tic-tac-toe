// Utilize Factory Function and Module Pattern
function Player(name, mark) {
  return { name, mark };
}

const Gameboard = (() => {
  const ROWS = 3;
  const COLS = 3;

  let board = Array.from({length: ROWS}, () => Array.from({ length: COLS}, () => ''));

  const getBoard = () => board.map(row => row.slice());

  const reset = () => {
    board = Array.from({length: ROWS}, () => Array.from({length: COLS}, () => ''));
  }

  const setMark = (row, col, mark) => {
    if (row < 0 || row >= ROWS || col < 0 || col >= COLS) return false;

    if (board[row][col] !== '') return false;

    board[row][col] = mark;

    return true;
  }

  const getCell = (row, col) => {
    if (row < 0 || row >= ROWS || col < 0 || col >= COLS) return null;
    
    return board[row][col];
  }

  const showBoard = () => {
    console.log('\n' + board.map(row => row.map(cell => cell === '' ? '-': cell)).join(' | ').join('\n---------\n') + '\n');

    return { getBoard, setMark, getCell, showBoard, reset}
  }
})

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
