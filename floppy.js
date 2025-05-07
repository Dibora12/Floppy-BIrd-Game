const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const gameOverScreen = document.getElementById("gameOverScreen");
const startOverBtn = document.getElementById("startOverBtn");
const finalScore = document.getElementById("finalScore");
const startScreen = document.getElementById("startScreen");
const startBtn = document.getElementById("startBtn");

// Scoreboard UI
const scoreboard = document.createElement("div");
scoreboard.id = "scoreboard";
document.body.appendChild(scoreboard);

// Set canvas size
canvas.width = 500;
canvas.height = 500;

// Image resources
const birdImg = new Image();
const pipeImg = new Image();
const bgImage = new Image();
birdImg.src = "https://i.postimg.cc/gcCyyfrB/pngwing-com.png"; 
pipeImg.src = "https://i.postimg.cc/0yRhMWpp/Nice-Png-pipes-png-388476.png"; 
bgImage.src = "https://i.postimg.cc/dQfbvt3N/pxfuel.jpg"; 

// Game Music
const gameMusic = new Audio("https://www.bensound.com/bensound-music/bensound-creativeminds.mp3");
gameMusic.loop = true;

let birdY;
let birdVelocity;
let gravity = 0.6;
let jump = -10;
let birdRadius = 15;
let birdX = 50;
let score;
let pipes;
let pipeWidth = 50;
let pipeGap = 140;
let gameOver;
let gameSpeed;

// **Initialize Game Variables**
function initGame() {
    birdY = canvas.height / 2;
    birdVelocity = 0;
    pipes = [];
    score = 0;
    gameOver = false;
    gameSpeed = 2;
}

// **Draw Background**
function drawBackground() {
    ctx.drawImage(bgImage, 0, 0, canvas.width, canvas.height);
}

// **Draw Bird**
function drawBird() {
    ctx.drawImage(birdImg, birdX - birdRadius, birdY - birdRadius, birdRadius * 2, birdRadius * 2);
}

// **Draw Pipes**
function drawPipes() {
    pipes.forEach((pipe, index) => {
        ctx.drawImage(pipeImg, pipe.x, 0, pipeWidth, pipe.topHeight);
        ctx.drawImage(pipeImg, pipe.x, pipe.topHeight + pipeGap, pipeWidth, canvas.height - pipe.topHeight - pipeGap);
        pipe.x -= gameSpeed;

        // **Collision Detection**
        if (
            birdX + birdRadius > pipe.x &&
            birdX - birdRadius < pipe.x + pipeWidth &&
            (birdY - birdRadius < pipe.topHeight || birdY + birdRadius > pipe.topHeight + pipeGap)
        ) {
            gameOver = true;
            displayGameOver();
        }

        // **Remove Passed Pipes & Increase Speed**
        if (pipe.x + pipeWidth < 0) {
            pipes.splice(index, 1);
            score++;
            if (score % 5 === 0) {
                gameSpeed += 0.2;
            }
        }
    });
}

// **Generate Pipes**
function generatePipes() {
    if (pipes.length === 0 || pipes[pipes.length - 1].x < canvas.width - 200) {
        let topHeight = Math.floor(Math.random() * (canvas.height - pipeGap - 50)) + 50;
        pipes.push({ x: canvas.width, topHeight });
    }
}

// **Update Game Logic**
function update() {
    if (gameOver) return;
    birdVelocity += gravity;
    birdY += birdVelocity;
    
    // **Prevent Bird from Falling Off**
    if (birdY > canvas.height - birdRadius) {
        birdY = canvas.height - birdRadius;
        gameOver = true;
        displayGameOver();
    }

    generatePipes();
    drawBackground();
    drawBird();
    drawPipes();
    drawScore();
}

// **Draw Score**
function drawScore() {
    scoreboard.innerHTML = "Score: " + score;
}

// **Display Game Over Screen**
function displayGameOver() {
    gameOverScreen.style.display = "block";
    finalScore.textContent = score;
    gameMusic.pause();
}

// **Reset Game & Restart**
function resetGame() {
    initGame();
    gameOverScreen.style.display = "none";
    gameMusic.play();
    gameLoop();
}

// **Game Loop**
function gameLoop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    update();
    if (!gameOver) {
        requestAnimationFrame(gameLoop);
    }
}

// **Handle Bird Jump**
function handleJump() {
    if (!gameOver) {
        birdVelocity = jump;
    }
}

// **Start Game on Button Click**
startBtn.addEventListener("click", () => {
    startScreen.style.display = "none";
    gameMusic.play();
    resetGame();
});

// **Restart Game on "Restart" Button**
startOverBtn.addEventListener("click", resetGame);

// **Jump on Key Press**
document.addEventListener("keydown", handleJump);
