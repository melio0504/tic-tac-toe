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
      return { success: false, message: 'You are not that stupid. The cell is already occupied.' };
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

const DisplayController = (() => {
  const boardContainer = document.querySelector('#board');
  const messageDiv = document.querySelector('#message');

  const p1Input = document.querySelector("#player1");
  const p2Input = document.querySelector("#player2");
  const startBtn = document.querySelector("#startBtn");
  const resetBtn = document.querySelector("#resetBtn");

  let game;

  const render = () => {
    const board = Gameboard.getBoard();
    boardContainer.textContent = '';

    board.forEach((row, r) => {
      row.forEach((cell, c) => {
        const cellDiv = document.createElement('div');
        cellDiv.classList.add('cell');
        
        if (cell === 'X') {
          const img = document.createElement('img');
          img.src = 'assets/images/X.png';
          img.classList.add('mark-img');
          cellDiv.appendChild(img);
        }

        if (cell === 'O') {
          const img = document.createElement('img');
          img.src = 'assets/images/O.png';
          img.classList.add('mark-img');
          cellDiv.appendChild(img);
        }

        cellDiv.addEventListener('click', () => handleClick(r, c));

        boardContainer.appendChild(cellDiv);
      });
    });
  };

  const handleClick = (row, col) => {
    if (!game || game.isGameOver()) return;

    const result = game.playRound(row, col);
    render();

    if (result.message) {
      messageDiv.textContent = result.message;
    };
  };

  startBtn.addEventListener('click', () => {
    const p1 = p1Input.value || 'Player One';
    const p2 = p2Input.value || 'Player Two';

    game = GameController(p1, p2);
    Gameboard.reset();

    messageDiv.textContent = `${game.getActivePlayer().name}'s turn (${game.getActivePlayer().mark})`;

    render();
  });

  resetBtn.addEventListener('click', () => {
    if (!game) return;

    game.resetGame();
    Gameboard.reset();

    messageDiv.textContent = `${game.getActivePlayer().name}'s turn (${game.getActivePlayer().mark})`;

    render();
  })

  return { render };
})();

DisplayController.render();
