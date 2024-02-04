const canvas = document.getElementById("snakeCanvas");
const ctx = canvas.getContext("2d");

const boxSize = 50;
let snake = [];
let food = { x: 0, y: 0 };
let dx = 1;
let dy = 0;
let gameInterval;

const headImage = new Image();
headImage.src = 'fataul lu akos.png';

const bodyImage = new Image();
bodyImage.src = 'BODY.jpg';

const foodImage = new Image();
foodImage.src = 'pizza.png';

const gameOverSound = new Audio('mor_out.mp3');

function playGameOverSound() {
    gameOverSound.play();
}

function gameOver() {
    clearInterval(gameInterval);
    playGameOverSound();
    alert("S-a dus pe pula Akos!");
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (let i = 1; i < snake.length; i++) {
        ctx.drawImage(bodyImage, snake[i].x * boxSize, snake[i].y * boxSize, boxSize, boxSize);
    }

    ctx.save();
    ctx.translate(snake[0].x * boxSize + boxSize / 2, snake[0].y * boxSize + boxSize / 2);
    ctx.rotate((Math.PI / 2) * (dy === 1 ? 2 : dy === -1 ? 0 : dx === -1 ? 3 : 1));
    ctx.drawImage(headImage, -boxSize / 2, -boxSize / 2, boxSize, boxSize);
    ctx.restore();

    ctx.drawImage(foodImage, food.x * boxSize, food.y * boxSize, boxSize, boxSize);
}

let moveCounter = 0;
const moveInterval = 5;

function move() {
    moveCounter++;
    
    if (moveCounter >= moveInterval) {
        const head = { x: snake[0].x + dx, y: snake[0].y + dy, direction: getDirection(dx, dy) };
        snake.unshift(head);

        if (head.x === food.x && head.y === food.y) {
            generateFood();
        } else {
            snake.pop();
            moveCounter = 3;
        }
    }
}

function checkCollision() {
    const head = snake[0];

    if (head.x < 0 || head.x * boxSize >= canvas.width || head.y < 0 || head.y * boxSize >= canvas.height) {
        gameOver();
    }

    for (let i = 1; i < snake.length; i++) {
        if (head.x === snake[i].x && head.y === snake[i].y) {
            gameOver();
        }
    }
}

function getDirection(dx, dy) {
    if (dx === 1) return 'right';
    if (dx === -1) return 'left';
    if (dy === 1) return 'down';
    if (dy === -1) return 'up';
}

function generateFood() {
    food = {
        x: Math.floor(Math.random() * (canvas.width / boxSize)),
        y: Math.floor(Math.random() * (canvas.height / boxSize))
    };
}

function update() {
    move();
    checkCollision();
    draw();
}

function startGame() {
    snake = [{ x: 10, y: 10 }];
    dx = 1;
    dy = 0;
    generateFood();

    const countdownElement = document.getElementById("countdown");
    countdownElement.style.display = "block";

    countdown(3, function () {
        gameInterval = setInterval(update, 100);

        document.getElementById("startButton").style.display = "none";

        countdownElement.style.display = "none";

        document.getElementById("startButton").removeEventListener("click", startGame);

        document.addEventListener("keydown", handleKeyPress);
    });
}

function countdown(seconds, callback) {
    let currentSecond = seconds;
    const countdownElement = document.getElementById("countdown");

    const countdownInterval = setInterval(function () {
        if (currentSecond > 0) {
            countdownElement.textContent = "Akos va incepe sa manance in " + currentSecond + " secunde.";
            currentSecond--;
        } else {
            clearInterval(countdownInterval);
            countdownElement.style.display = "none";
            callback();
        }
    }, 1000);
}

function handleKeyPress(event) {
    switch (event.key) {
        case "ArrowUp":
            if (dy !== 1) {
                dx = 0;
                dy = -1;
            }
            break;
        case "ArrowDown":
            if (dy !== -1) {
                dx = 0;
                dy = 1;
            }
            break;
        case "ArrowLeft":
            if (dx !== 1) {
                dx = -1;
                dy = 0;
            }
            break;
        case "ArrowRight":
            if (dx !== -1) {
                dx = 1;
                dy = 0;
            }
            break;
    }
}

document.getElementById("startButton").addEventListener("click", startGame);
