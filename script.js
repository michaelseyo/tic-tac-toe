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

// create com
const com = (() => {
    let move = "o";
    let depth = 0;
    const scores = {
        'x': {score: -1}, 
        'o': {score: 1}, 
        'tie': {score: 0},
    };

    const nextMove = function() {
        let bestSpot = minimax(gameboard.arr, com.move, depth);
        com.depth++;
        let bestIndex = bestSpot.index;
        const moveContainer = document.querySelector(`#container${bestIndex}`);
        displayController.addImg(moveContainer, bestIndex, com.move);
    };

    const minimax = function(board, player, depth) {
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
                let result = minimax(board, human.move, depth + 1);
                currentMove.score = result.score;
            } else { 
                let result = minimax(board, com.move, depth + 1);
                currentMove.score = result.score; 
            }

            // reset back
            board[availableSpots[i]] = currentMove.index;
            moves.push(currentMove);
        };

        let bestMove;
        const random = Math.floor(Math.random() * moves.length);
        if (player === com.move) {
            let bestScore = -Infinity;
            for (let i = 0; i < moves.length; i++) {
                if (com.depth < 1 && displayController.normal) {
                    bestScore = moves[random].score;
                    bestMove = random;
                } else if (moves[i].score > bestScore) { 
                    bestScore = moves[i].score;
                    bestMove = i;
                } 
            }
        } else {
            let bestScore = Infinity;
            for (let i = 0; i < moves.length; i++) { 
                if (com.depth < 1 && displayController.normal) {
                    bestScore = moves[random].score;
                    bestMove = random;
                } else if (moves[i].score < bestScore) { 
                    bestScore = moves[i].score;
                    bestMove = i;
                } 
            }
        }
        return moves[bestMove];
    };

    return {
        move,
        depth,
        nextMove,
    };
})();

const human = Player("Human");

// control the flow of the game
const displayController = (() => {
    let gameOver = false;
    let currentTurn = human;
    let normal = true;
    const grid = document.querySelector(".grid");
    const resultMsg = document.querySelector("#results-message");

    const fadeIn = function(target, interval) {
        let steps = 0;
        let timer = setInterval(function() {
            steps++;
            target.style.opacity = 0.05 * steps;
            if (steps >= 20) {
                clearInterval(timer);
                timer = undefined;
            }
        }, interval);
    };

    const addImg = function(container, index, currentMove) {
        gameboard.arr[index] = currentMove
        const moveIcon = document.createElement("img");
        moveIcon.id = "move-icon";
        moveIcon.src = `icons/${currentMove}.png`;
        moveIcon.style.opacity = 0;
        if (currentMove === com.move) {
            moveIcon.style.transitionDelay = "1s";
        }
        container.appendChild(moveIcon);
        fadeIn(moveIcon, 1);
    };

    const displayMove = function() {
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

        if (isFull()) {
            return 'tie';
        } else {
            return null;
        }
    };

    const checkWin = function(move) {
        const winner = isWinner(move);
        resultMsg.style.opacity = 0;
        if (winner === "tie") {
            fadeIn(resultMsg, 70);
            resultMsg.textContent = "Tie!";
            gameOver = true;
        } else if (winner) {
            fadeIn(resultMsg, 70);
            resultMsg.textContent = (winner === "x") ? `${human.name} wins!` : `Com wins!`;
            gameOver = true;
        } 
    };

    const reset = function() {
        const imgs = document.querySelectorAll("#move-icon");
        imgs.forEach(img => img.parentElement.removeChild(img));
        gameboard.reset();
        resultMsg.textContent = "";
        com.depth = 0;
        gameOver = false;
        currentTurn = human;
    }
    
    const normalContainer = document.querySelector(".normal");
    const hardContainer = document.querySelector(".hard");
    
    const setNormal = function() {
        if (hardContainer.classList.contains("selected")) {
            hardContainer.classList.remove("selected");
        }
        normalContainer.classList.add("selected");
        displayController.normal = true;
        reset();
    };

    const setHard = function() {
        if (normalContainer.classList.contains("selected")) {
            normalContainer.classList.remove("selected");
        }
        hardContainer.classList.add("selected");
        displayController.normal = false;
        reset();
    };

    const setup = function() {
        normalContainer.addEventListener("click", setNormal);
        normalContainer.click();
        hardContainer.addEventListener("click", setHard);
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
        normal,
        setup,
        isWinner,
        addImg,
    };
})();

displayController.setup();