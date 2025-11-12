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
  };

  const setMark = (row, col, mark) => {
    if (row < 0 || row >= ROWS || col < 0 || col >= COLS) return false;

    if (board[row][col] !== '') return false;

    board[row][col] = mark;

    return true;
  };

  const getCell = (row, col) => {
    if (row < 0 || row >= ROWS || col < 0 || col >= COLS) return null;
    
    return board[row][col];
  };

  const showBoard = () => {
    const formatted = board.map(row => row.map(cell => (cell === '' ? '-' : cell))
                      .join(' | '))
                      .join('\n---------\n');
                      
    console.log('\n' + formatted + '\n');
  };

  return { getBoard, setMark, getCell, showBoard, reset };
})();

// This will handle the game logic
function GameController(player1Name = 'Player One', player2Name = 'Player Two') {
  const players = [Player(player1Name, 'O'), Player(player2Name, 'X')];

  let activeIndex = 0;
  let gameOver = false;
  let winner = null;

  const getActivePlayer = () => players[activeIndex];
  const switchPlayer = () => { activeIndex = 1 - activeIndex; };

  const resetGame = () => {
    Gameboard.reset();
    activeIndex = 0;
    gameOver = false;
    winner = null;
  };

  const checkWinner = () => {
    const b = Gameboard.getBoard();

    // Rows
    for (let r = 0; r < 3; r++) {
      if (b[r][0] !== '' && b[r][0] === b[r][1] && b[r][1] === b[r][2]) {
        return b[r][0];
      }
    }

    // Columns
    for (let c = 0; c < 3; c++) {
      if (b[0][c] !== '' && b[0][c] === b[1][c] && b[1][c] === b[2][c]) {
        return b[0][c];
      }
    }

    // Diagonals
    if (b[0][0] !== '' && b[0][0] === b[1][1] && b[1][1] === b[2][2]) return b[0][0];
    if (b[0][2] !== '' && b[0][2] === b[1][1] && b[1][1] === b[2][0]) return b[0][2];

    return null;
  };

  const isTie = () => {
    const b = Gameboard.getBoard();
    for (let r = 0; r < 3; r++) {
      for (let c = 0; c < 3; c++) {
        if (b[r][c] === '') return false;
      }
    }
    return checkWinner() === null;
  };


  const playRound = (row, col) => {
    if (gameOver) {
      return { success: false, message: 'Game is over. Reset to play again.' };
    }

    const player = getActivePlayer();
    const placed = Gameboard.setMark(row, col, player.mark);

    if (!placed) {
      return { success: false, message: 'Invalid move. The cell is already occupied or out of bounds' };
    }

    const winMark = checkWinner();

    if (winMark) {
      gameOver = true;
      winner = players.find(p => p.mark === winMark);
      
      Gameboard.showBoard();

      return { success: true, message: `${winner.name} wins!`, winner: winner };
    }

    if (isTie()) {
      gameOver = true;

      Gameboard.showBoard();

      return { success: true, message: 'Tie game (draw).' };
    }

    switchPlayer();
    Gameboard.showBoard();

    return { success: true, message: `Move accepted. Next: ${getActivePlayer().name}`, nextPlayer: getActivePlayer() };
  };

  return {
    playRound,
    getActivePlayer,
    resetGame,
    isGameOver: () => gameOver,
    getWinner: () => winner,
    showBoard: Gameboard.showBoard
  };
}

const game = GameController('Alice', 'Bob');
