document.addEventListener('DOMContentLoaded', () => {
    // --- DOM ELEMENTS ---
    const gameBoard = document.getElementById('game-board');
    const scoreDisplay = document.getElementById('score-display');
    const restartBtn = document.getElementById('restart-btn');
    
    // --- GAME STATE ---
    const GRID_SIZE = 4;
    let board = [];
    let score = 0;
    let gameIsOver = false;

    // --- GAME INITIALIZATION ---
    function setupGame() {
        // 1. Reset game state
        score = 0;
        gameIsOver = false;
        board = Array.from({ length: GRID_SIZE }, () => Array(GRID_SIZE).fill(0));
        
        // 2. Reset UI
        scoreDisplay.textContent = score;
        
        // 3. Add starting tiles and render the board
        addRandomTile();
        addRandomTile();
        renderBoard();
    }
    
    // --- RENDERING ---
    function renderBoard() {
        gameBoard.innerHTML = '';
        
        // Draw background cells
        for (let i = 0; i < GRID_SIZE * GRID_SIZE; i++) {
            const cell = document.createElement('div');
            cell.classList.add('cell');
            gameBoard.appendChild(cell);
        }
        
        // Draw tiles based on the 'board' array
        for (let r = 0; r < GRID_SIZE; r++) {
            for (let c = 0; c < GRID_SIZE; c++) {
                if (board[r][c] !== 0) {
                    const tile = document.createElement('div');
                    const tileValue = board[r][c];
                    tile.classList.add('tile');
                    tile.dataset.value = tileValue;
                    tile.textContent = tileValue;
                    
                    tile.style.setProperty('grid-row-start', r + 1);
                    tile.style.setProperty('grid-column-start', c + 1);

                    gameBoard.appendChild(tile);
                }
            }
        }
    }
    
    // --- GAME LOGIC ---
    function handleKeyPress(e) {
        if (gameIsOver) return; // Stop taking input if game is over

        let direction;
        switch (e.key) {
            case 'ArrowUp': direction = 'up'; break;
            case 'ArrowDown': direction = 'down'; break;
            case 'ArrowLeft': direction = 'left'; break;
            case 'ArrowRight': direction = 'right'; break;
            default: return;
        }
        e.preventDefault();

        const boardBeforeMove = JSON.stringify(board);
        moveTiles(direction);
        const boardAfterMove = JSON.stringify(board);

        if (boardBeforeMove !== boardAfterMove) {
            addRandomTile();
            renderBoard();
            
            if (isGameOver()) {
                gameIsOver = true; // Set game over flag to stop input
            }
        }
    }

    function moveTiles(direction) {
        const isVertical = direction === 'up' || direction === 'down';
        
        for (let i = 0; i < GRID_SIZE; i++) {
            const line = isVertical ? board.map(row => row[i]) : board[i];
            const sortedLine = direction === 'up' || direction === 'left';
            
            const newLine = transformLine(line, sortedLine);
            
            if (isVertical) {
                for (let j = 0; j < GRID_SIZE; j++) {
                    board[j][i] = newLine[j];
                }
            } else {
                board[i] = newLine;
            }
        }
    }

    function transformLine(line, sortAsc) {
        let filtered = line.filter(val => val !== 0);
        
        if (sortAsc) {
            for (let i = 0; i < filtered.length - 1; i++) {
                if (filtered[i] === filtered[i + 1]) {
                    filtered[i] *= 2;
                    score += filtered[i];
                    filtered.splice(i + 1, 1);
                }
            }
        } else {
            for (let i = filtered.length - 1; i > 0; i--) {
                if (filtered[i] === filtered[i - 1]) {
                    filtered[i] *= 2;
                    score += filtered[i];
                    filtered.splice(i - 1, 1);
                }
            }
        }
        
        let result = Array(GRID_SIZE).fill(0);
        if (sortAsc) {
            for (let i = 0; i < filtered.length; i++) {
                result[i] = filtered[i];
            }
        } else {
            for (let i = 0; i < filtered.length; i++) {
                result[GRID_SIZE - filtered.length + i] = filtered[i];
            }
        }
        scoreDisplay.textContent = score;
        return result;
    }
    
    function addRandomTile() {
        const emptyCells = [];
        for (let r = 0; r < GRID_SIZE; r++) {
            for (let c = 0; c < GRID_SIZE; c++) {
                if (board[r][c] === 0) {
                    emptyCells.push({ r, c });
                }
            }
        }
        if (emptyCells.length > 0) {
            const { r, c } = emptyCells[Math.floor(Math.random() * emptyCells.length)];
            board[r][c] = Math.random() < 0.9 ? 2 : 4;
        }
    }

    function isGameOver() {
        for (let r = 0; r < GRID_SIZE; r++) {
            for (let c = 0; c < GRID_SIZE; c++) {
                if (board[r][c] === 0) return false;
                if (c < GRID_SIZE - 1 && board[r][c] === board[r][c + 1]) return false;
                if (r < GRID_SIZE - 1 && board[r][c] === board[r + 1][c]) return false;
            }
        }
        return true;
    }

    // --- EVENT LISTENERS ---
    document.addEventListener('keydown', handleKeyPress);
    restartBtn.addEventListener('click', setupGame);

    // --- START THE GAME! ---
    setupGame();
});