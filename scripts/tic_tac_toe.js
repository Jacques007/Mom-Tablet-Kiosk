   const board = Array(9).fill(null);
    const cells = document.querySelectorAll('.cell');
    const status = document.getElementById('status');
    const restartBtn = document.getElementById('restart');
    let gameOver = false;

    const winningCombos = [
      [0,1,2], [3,4,5], [6,7,8],
      [0,3,6], [1,4,7], [2,5,8],
      [0,4,8], [2,4,6]
    ];

    function checkWinner(b = board) {
      for (let combo of winningCombos) {
        const [a, bIdx, c] = combo;
        if (b[a] && b[a] === b[bIdx] && b[a] === b[c]) {
          return b[a];
        }
      }
      return null;
    }

    function boardFull(b = board) {
      return !b.includes(null);
    }

    function getEmpty(b = board) {
      return b.map((cell, i) => cell === null ? i : -1).filter(i => i >= 0);
    }

    // SUPER EASY AI for Mom – wins/draws ~30% of games, you win ~70%!
    function aiMove() {
      const emptySpots = getEmpty();

      // 1. Check if AI can win (20% chance to "miss" even this)
      if (Math.random() < 0.8) {
        for (let i = 0; i < 9; i++) {
          if (board[i] === null) {
            board[i] = 'O';
            if (checkWinner()) {
              placeMark(i, 'O');
              updateStatus();
              return;
            }
            board[i] = null;
          }
        }
      }

      // 2. Check if player is about to win (50% chance to block)
      if (Math.random() < 0.5) {
        for (let i = 0; i < 9; i++) {
          if (board[i] === null) {
            board[i] = 'X';
            if (checkWinner()) {
              board[i] = null;
              placeMark(i, 'O');
              updateStatus();
              return;
            }
            board[i] = null;
          }
        }
      }

      // 3. Otherwise... PURE RANDOM (60% of all moves are random now!)
      if (emptySpots.length > 0) {
        const randomMove = emptySpots[Math.floor(Math.random() * emptySpots.length)];
        placeMark(randomMove, 'O');
        updateStatus();
      }
    }

    function placeMark(index, mark) {
      board[index] = mark;
      const cell = cells[index];
      cell.textContent = mark;
      cell.classList.add(mark.toLowerCase());
    }

    function playerMove(index) {
      if (gameOver || board[index]) return;
      placeMark(index, 'X');
      updateStatus();
      if (!gameOver) {
        setTimeout(aiMove, 800); // Slower AI for easier wins
      }
    }

    function updateStatus() {
      const winner = checkWinner();
      if (winner) {
        if (winner === 'X') {
          status.textContent = "You Win! 🎉🏆👏";
          // Flash win message
          status.style.color = '#28a745';
          setTimeout(() => status.style.color = '', 2000);
        } else {
          status.textContent = "Computer Wen! 😎";
        }
        gameOver = true;
        return;
      }
      if (boardFull()) {
        status.textContent = "Dis is Gelykop! 🤝";
        gameOver = true;
        return;
      }
      gameOver = false;
      const xCount = board.filter(c => c === 'X').length;
      if (xCount > board.filter(c => c === 'O').length) {
        status.textContent = "Computer se beurt... 🤖";
      } else {
        status.textContent = "Jou Beurt! 👆";
      }
    }

    function restart() {
      board.fill(null);
      cells.forEach((cell) => {
        cell.textContent = '';
        cell.classList.remove('x', 'o');
      });
      status.style.color = '';
      gameOver = false;
      updateStatus();
    }

    cells.forEach((cell, index) => {
      cell.addEventListener('click', () => playerMove(index));
    });

    restartBtn.addEventListener('click', restart);

    updateStatus();
