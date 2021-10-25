const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');

class SnakePart {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
}

let speed = 7;
let tileCount = 20;
let tileSize = canvas.width / tileCount - 2;
let headX = 10;
let headY = 10;

const snakeParts = [];
let tailLength = 2;

let appleX = 5;
let appleY = 5;
let score = 0;

let xVelocity = 0;
let yVelocity = 0;

const gulpSound = new Audio('gulp.mp3');

const clearScreen = () => {
    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
};

const changeSnakePosition = () => {
    headX = headX + xVelocity;
    headY = headY + yVelocity;
};

const changeAppleCollision = () => {
    if(appleX === headX && appleY == headY) {
        appleX = Math.floor(Math.random() * tileCount);
        appleY = Math.floor(Math.random() * tileCount);
        tailLength++;
        score++;
        gulpSound.play();
    }
};

const drawApple = () => {
    ctx.fillStyle = 'red';
    ctx.fillRect(appleX * tileCount, appleY * tileCount, tileSize, tileSize)
};

const drawSnake = () => {
    ctx.fillStyle = 'green';
    for(let i = 0; i < snakeParts.length; i++) {
        let part = snakeParts[i];
        ctx.fillRect(part.x * tileCount, part.y * tileCount, tileSize, tileSize);
    }
    snakeParts.push(new SnakePart(headX, headY));

    while (snakeParts.length > tailLength) {
        snakeParts.shift();
    }    

    ctx.fillStyle = 'orange';
    ctx.fillRect(headX * tileCount, headY * tileCount, tileSize, tileSize);
};

const drawScore = () => {
    ctx.fillStyle = 'white';
    ctx.font = '10px Verdana';
    ctx.fillText(`Score ${score}`, canvas.width - 50, 10);
};

const isGameOver = () => {
    let gameOver = false;

    if (yVelocity === 0 && xVelocity === 0) return false;

    //walls
    if(headX < 0 || headX === tileCount || headY < 0 || headY === tileCount) gameOver = true;

    for (let i = 0; i < snakeParts.length; i++) {
        let part = snakeParts[i];
        if (part.x === headX && part.y === headY) {
          gameOver = true;
          break;
        }
    }

    if (gameOver) {
        ctx.fillStyle = "white";
        ctx.font = "50px Verdana";
        ctx.fillText("Game Over!", canvas.width / 6.5, canvas.height / 2);
    }
    
      return gameOver;
};

const drawGame = () => {
    changeSnakePosition();
    let result = isGameOver();
    if(result) return;
    clearScreen();
    changeAppleCollision();
    drawApple();
    drawSnake();
    drawScore();
    if(score > 3) speed = 10;
    else if(score > 10) speed = 15;
    setTimeout(drawGame, 1000/speed);
};

const keyDown = (event) => {
    if(event.keyCode == 38) {
        if(yVelocity == 1) return;
        yVelocity--;
        xVelocity = 0;
    } else if(event.keyCode == 40) {
        if(yVelocity == -1) return;
        yVelocity++;
        xVelocity = 0;
    } else if(event.keyCode == 37) {
        if(xVelocity == 1) return;
        yVelocity = 0;
        xVelocity--;
    } else if(event.keyCode == 39) {
        if(xVelocity == -1) return;
        yVelocity = 0;
        xVelocity++;
    }
}

document.body.addEventListener('keydown', keyDown);

drawGame();

