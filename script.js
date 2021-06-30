// create gameboard
const gameboard = (() => {
    let boardArray = Array(9).fill('');
    return {
        boardArray,
    };            
})();

// create player
const Player = (name) => {
    let move = "";
    return {
        name,
        move,
    };
};

// control the flow of the game
const displayController = (() => {
    const player1 = Player("1");
    const player2 = Player("2");
    let currentTurn = player1;
    let gameOver = false;
    const grid = document.querySelector(".grid");
    const resultMsg = document.querySelector("#results-message");

    const displayMove = function() {
        if (!this.hasChildNodes() && !gameOver) {
            const moveIcon = document.createElement("img");
            moveIcon.id = "move-icon";
            if (currentTurn === player1) {
                gameboard.boardArray[this.id] = player1.move;
                moveIcon.src = `icons/${player1.move}.png`;
                currentTurn = player2;
            } else {
                gameboard.boardArray[this.id] = player2.move;
                moveIcon.src = `icons/${player2.move}.png`;
                currentTurn = player1;
            }
            this.appendChild(moveIcon);
        }
    };

    const isFull = function() {
        return (gameboard.boardArray.every(move => move));
    }

    const checkGameOver = function() {
        const rowCombiA = Array(gameboard.boardArray[0], gameboard.boardArray[1], gameboard.boardArray[2]);
        const rowCombiB = Array(gameboard.boardArray[3], gameboard.boardArray[4], gameboard.boardArray[5]);
        const rowCombiC = Array(gameboard.boardArray[6], gameboard.boardArray[7], gameboard.boardArray[8]);
        const colCombiA = Array(gameboard.boardArray[0], gameboard.boardArray[3], gameboard.boardArray[6]);
        const colCombiB = Array(gameboard.boardArray[1], gameboard.boardArray[4], gameboard.boardArray[7]);
        const colCombiC = Array(gameboard.boardArray[2], gameboard.boardArray[5], gameboard.boardArray[8]);
        const diagonalCombiA = Array(gameboard.boardArray[0], gameboard.boardArray[4], gameboard.boardArray[8]);
        const diagonalCombiB = Array(gameboard.boardArray[2], gameboard.boardArray[4], gameboard.boardArray[6]);
        
        if (!gameOver) {
            if (rowCombiA.every(move => move === rowCombiA[0] && move) || 
                rowCombiB.every(move => move === rowCombiB[0] && move) ||
                rowCombiC.every(move => move === rowCombiC[0] && move) || 
                colCombiA.every(move => move === colCombiA[0] && move) ||
                colCombiB.every(move => move === colCombiB[0] && move) || 
                colCombiC.every(move => move === colCombiC[0] && move) ||
                diagonalCombiA.every(move => move === diagonalCombiA[0] && move) ||
                diagonalCombiB.every(move => move === diagonalCombiB[0] && move)) {
                    const move = this.firstChild.src.slice(-5, -4);
                    resultMsg.textContent = (move === "x") ? "Player1 wins!" : "Player2 wins!";
                    gameOver = true;
            } else if (isFull()) {
                resultMsg.textContent = "Tie!";
                gameOver = true;
            }
        }
    };

    const reset = function() {
        const imgs = document.querySelectorAll("#move-icon");
        imgs.forEach(img => img.parentElement.removeChild(img));
        gameboard.boardArray = Array(9).fill("");
        resultMsg.textContent = "";
        
        gameOver = false;
        currentTurn = player1;
        // console.log(gameboard.boardArray);
    }

    const setupGrid = function() {
        player1.move = "x";
        player2.move = "o";
        const resetBtn = document.querySelector("#reset");
        resetBtn.addEventListener("click", reset);
    
        for (let i = 0; i < gameboard.boardArray.length; i++) {
            const moveContainer = document.createElement("div");
            moveContainer.id = i;
            moveContainer.addEventListener("click", displayMove.bind(moveContainer));
            moveContainer.addEventListener("click", checkGameOver);
            grid.appendChild(moveContainer);
        } 
    };

    return {
        setupGrid,
    };
})();

displayController.setupGrid();