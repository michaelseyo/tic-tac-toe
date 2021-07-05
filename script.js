// create gameboard
const gameboard = (() => {
    let arr = Array(9);

    for (let i = 0; i < 9; i++) {
        arr[i] = `${i}`;
    }

    const reset = function() {
        for (let i = 0; i < 9; i++) {
            arr[i] = `${i}`;
        }
    };

    const emptyIndexes = function() {
        return arr.filter(elem => elem !== "x" && elem != "o");
    };

    return {
        arr,
        emptyIndexes,
        reset,
    };    
})();

// create player
const Player = (name) => {
    let move = "x";
    return {
        name,
        move,
    };
};

const com = (() => { // com move is "o";
    let move = "o";

    const scores = {
        'x': {score: -1}, 
        'o': {score: 1}, 
        'tie': {score: 0},
    };

    const nextMove = function() {
        let bestSpot = minimax(gameboard.arr, com.move);  
        let bestIndex = bestSpot.index;

        const moveContainer = document.querySelector(`#container${bestIndex}`);
        displayController.addImg(moveContainer, bestIndex, com.move);
    };

    const minimax = function(board, player) {
        let availableSpots = gameboard.emptyIndexes();
        let winner = displayController.isWinner(player);

        if (winner !== null) {
            return scores[winner]; 
        }

        let moves = [];

        for (let i = 0; i < availableSpots.length; i++) {
            let currentMove = {};
            // save original index        
            currentMove.index = board[availableSpots[i]]; 
            board[availableSpots[i]] = player; 

            // alternating turns
            if (player === com.move) {
                let result = minimax(board, human.move);
                currentMove.score = result.score;
            } else { 
                let result = minimax(board, com.move);
                currentMove.score = result.score;
            }

            // reset back
            board[availableSpots[i]] = currentMove.index;
            moves.push(currentMove);
        };

        let bestMove;
        if (player === com.move) {
            let bestScore = -Infinity;
            for (let i = 0; i < moves.length; i++) {
                // the bestMove is the one with the highest score 
                if (moves[i].score > bestScore) { 
                    bestScore = moves[i].score;
                    bestMove = i;
                } 
            }
        } else {
            let bestScore = Infinity;
            for (let i = 0; i < moves.length; i++) { 
                // the bestMove is the one with the lowest score
                if (moves[i].score < bestScore) {
                    bestScore = moves[i].score;
                    bestMove = i;
                } 
            }
        }
        return moves[bestMove];
    };
    // to ensure the smartest AI, we could have the depth; moves that can win in least depth is higher score
    return {
        move,
        nextMove,
    }
})();

const human = Player("Human");

// control the flow of the game
const displayController = (() => {
    let gameOver = false;
    let currentTurn = human;
    const grid = document.querySelector(".grid");
    const resultMsg = document.querySelector("#results-message");

    const addImg = function(container, index, currentMove) {
        gameboard.arr[index] = currentMove
        const moveIcon = document.createElement("img");
        moveIcon.id = "move-icon";
        moveIcon.src = `icons/${currentMove}.png`;
        container.appendChild(moveIcon);
    };

    const displayMove = function() {
        console.log(gameOver);
        if (!this.hasChildNodes() && !gameOver) {
            if (currentTurn === human) {
                const index = this.id.slice(-1);
                addImg(this, index, human.move);
                checkWin(human.move);
                currentTurn = com;

                if (!gameOver) {
                    com.nextMove();
                    checkWin(com.move);
                    currentTurn = human;    
                }
            }
        }
    };

    const isFull = function() {
        return (gameboard.emptyIndexes().length === 0) ? true : false;
    };

    const isWinner = function(move) {   
        if (
            (gameboard.arr[0] === move && gameboard.arr[1] === move && gameboard.arr[2] === move) ||
            (gameboard.arr[3] === move && gameboard.arr[4] === move && gameboard.arr[5] === move) ||
            (gameboard.arr[6] === move && gameboard.arr[7] === move && gameboard.arr[8] === move) ||
            (gameboard.arr[0] === move && gameboard.arr[3] === move && gameboard.arr[6] === move) ||
            (gameboard.arr[1] === move && gameboard.arr[4] === move && gameboard.arr[7] === move) ||
            (gameboard.arr[2] === move && gameboard.arr[5] === move && gameboard.arr[8] === move) ||
            (gameboard.arr[0] === move && gameboard.arr[4] === move && gameboard.arr[8] === move) ||
            (gameboard.arr[2] === move && gameboard.arr[4] === move && gameboard.arr[6] === move)
        ) {
            return move;
        }

        // the above will process the relevant wins if there is any if not goes to here
        if (isFull()) {
            return 'tie';
        } else {
            return null;
        }
    };

    const checkWin = function(move) {
        const winner = isWinner(move);
        if (winner === "tie") {
            resultMsg.textContent = "Tie!";
            gameOver = true;
        } else if (winner) {
            resultMsg.textContent = (winner === "x") ? `${human.name} win!` : `Com win!`;
            gameOver = true;
        } 
    };

    const reset = function() {
        const imgs = document.querySelectorAll("#move-icon");
        imgs.forEach(img => img.parentElement.removeChild(img));
        gameboard.reset();
        resultMsg.textContent = "";
        gameOver = false;
        currentTurn = human;
    }

    const setupGrid = function() {
        const resetBtn = document.querySelector("#reset");
        resetBtn.addEventListener("click", reset);
    
        for (let i = 0; i < 9; i++) {
            const moveContainer = document.createElement("div");
            moveContainer.id = `container${i}`;
            moveContainer.addEventListener("click", displayMove.bind(moveContainer));
            grid.appendChild(moveContainer);
        } 
    };

    return {
        setupGrid,
        isWinner,
        addImg,
    };
})();

displayController.setupGrid();
