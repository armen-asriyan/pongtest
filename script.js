// Get the canvas element and store it in the canvas variable
const canvas = document.getElementById("gameArea");
// Creating the ctx variable to store the 2D rendering context
const ctx = canvas.getContext('2d', { alpha: false });

// Divider variables
const dividerWidth = 17;
const dividerHeight = 80;
const dividerX = (canvas.width / 2);
let dividerY = 1;
const dividerOffset = 17;

// Paddle default width and height
const paddleWidth = 17;
const paddleHeight = 150;
// Store paddle y position in a variable
let paddleY = (canvas.height - paddleHeight) / 2;
let paddleX = (canvas.width - paddleWidth) - paddleWidth;
// Opponent's paddle
let opponentPaddleY = (canvas.height - paddleHeight) / 2;
let opponentPaddleX = paddleWidth;  // Place it on the right side

// Ball variables
let ballX = (canvas.width / 2) + 17; // Ball default x (horizontal) position
let ballY = (canvas.height / 2); // Ball default y (vertical) position
let ballWidth = 17; // Ball default width
let ballHeight = 17; // Ball default height
let ballSpeedX = 5;
let ballSpeedY = 4;

let mouseY;

// Points variables
let playerPoints = 10;
let opponentPoints = 10;

let gameEnded = false;

document.addEventListener("keydown", resetGame, false);

canvas.addEventListener('click', startGame);

drawPreGame();

function drawPreGame() {
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    console.log("Canvas has been cleared");

    // Draw a text saying tap to start the game
    ctx.fillStyle = "white";
    ctx.font = "30px 'Press Start 2P'";
    ctx.textAlign = "center";
    ctx.fillText("Click on the screen to play", canvas.width / 2, canvas.height / 2);
    console.log("Pre-game text has been drawned");
}


function startGame() {
    gameLoop();
    canvas.removeEventListener('mousedown', startGame);
    canvas.removeEventListener('touchstart', startGame);
    canvas.addEventListener("mousemove", onMouseMove, false);
}


function onMouseMove(mouseEvent) {
    console.log('onMouseMove called, mouseEvent is: ', mouseEvent);

    let rect = canvas.getBoundingClientRect();
    // Accessing clientY property from mouseEvent
    mouseY = mouseEvent.clientY - rect.top;

    // You can do something with the y coordinate here
    console.log('Mouse Y coordinate:', mouseY);

    paddleY = mouseY;
    console.log("Y position of paddle is: ", paddleY);

    if (mouseY > 560) {
        console.log("Paddle reached the bottom");
        paddleY = 560;
    }
    else if (mouseY < 10) {
        console.log("Paddle reached the top");
        paddleY = 10;
    }
}

function drawGame() {
    ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear canvas

    canvas.removeEventListener('click', startGame); // Remove click input after starting the game
    document.getElementById('gameArea').style.cursor = "none"; // Hide the cursor

    // Draw the paddle
    ctx.fillStyle = "white";
    ctx.fillRect(paddleX, paddleY, paddleWidth, paddleHeight);

    // Draw the opponent paddle
    ctx.fillStyle = "white";
    ctx.fillRect(opponentPaddleX, opponentPaddleY, paddleWidth, paddleHeight);

    // Opponent paddle AI
    paddleAI();

    // Draw the ball
    ctx.fillStyle = "white";
    ctx.fillRect(ballX, ballY, ballWidth, ballHeight);


    // Draw the dividers
    for (let i = 0; i < canvas.height; i++) {
        ctx.fillStyle = "white";
        ctx.fillRect(dividerX, dividerY + i * (dividerHeight + dividerOffset), dividerWidth, dividerHeight);
    }

    ballBounce();

    // Draw points

    // Player Points
    ctx.fillStyle = "white";
    ctx.font = "150px 'Digital-7 Mono'";
    ctx.textAlign = "center";
    ctx.fillText(playerPoints, canvas.width - 500, 120);

    // Opponent Points
    ctx.fillStyle = "white";
    ctx.font = "150px 'Digital-7 Mono'";
    ctx.textAlign = "center";
    ctx.fillText(opponentPoints, 500, 120);

    // Game result function
    gameResult();

}

function ballBounce() {
    ballX += ballSpeedX;
    ballY += ballSpeedY;


    // Bounce from top and bottom
    if ((ballY + ballSpeedY) + 17 > canvas.height) {
        ballSpeedY = -ballSpeedY;
    }
    else if ((ballY + ballSpeedY) + 17 < 0) {
        ballSpeedY = -ballSpeedY;
    }

    // Point losing funciton
    losePoint();

    // Check collision with paddle
    if (ballX + ballWidth > paddleX && ballX < paddleX + paddleWidth) {
        if (ballY + ballHeight > paddleY && ballY < paddleY + paddleHeight) {
            // Collision detected, reverse ball's x-direction
            ballSpeedX = - 12;
            console.log("The ball touched the paddle");
        }
    }

    // Check collision with opponent paddle
    if (ballX < opponentPaddleX + paddleWidth && ballX + ballWidth > opponentPaddleX) {
        if (ballY + ballHeight > opponentPaddleY && ballY < opponentPaddleY + paddleHeight) {
            // Collision detected, reverse ball's x-direction and adjust y-direction based on contact point
            ballSpeedX = -ballSpeedX;
            ballSpeedY *= 1.05; // Increase speed slightly after each hit (optional)
            const relativeImpact = (ballY - (opponentPaddleY + paddleHeight / 2)) / (paddleHeight / 2);
            ballSpeedY *= relativeImpact;  // Adjust y-speed based on where the ball hits the paddle
            console.log("The ball touched the opponent paddle");
        }
    }


}


function gameResult() {
    if (playerPoints === 11) {
        gameEnded = true;
        ctx.fillStyle = "white";
        ctx.font = "150px 'Digital-7 Mono'";
        ctx.textAlign = "center";
        ctx.fillText("winner", canvas.height + 250, 400);
        ctx.fillText("loser", canvas.height / 2, 400);
        ctx.font = "italic 30px 'Press Start 2P'";
        ctx.fillText("Press escape", canvas.height + 250, 600);
        ballSpeedX = 0;
        ballSpeedY = 0;
        canvas.removeEventListener("mousemove", onMouseMove, false);
        document.getElementById('gameArea').style.cursor = "auto";
    }
    if (opponentPoints === 11) {
        gameEnded = true;
        ctx.fillStyle = "white";
        ctx.font = "150px 'Digital-7 Mono'";
        ctx.textAlign = "center";
        ctx.fillText("loser", canvas.height + 250, 400);
        ctx.fillText("winner", canvas.height / 2, 400);
        ctx.font = "italic 30px 'Press Start 2P'";
        ctx.fillText("Press escape", canvas.height + 250, 600);
        ballSpeedX = 0;
        ballSpeedY = 0;
        document.getElementById('gameArea').style.cursor = "auto";
    }
}

function resetGame(event) {
    if (event.key === "Escape" && gameEnded) {
        playerPoints = 0;
        opponentPoints = 0;
        ballX = canvas.width / 2;
        ballY = canvas.height / 2;
        ballSpeedX = 5;
        ballSpeedY = 4;
        canvas.addEventListener("mousemove", onMouseMove, false);
        gameEnded = false;
    }
}

function losePoint() {

    if ((ballX + ballSpeedX) + 17 > canvas.width) {
        //ballSpeedX = -ballSpeedX;
        console.log("Player lost a point");
        opponentPoints++;

        ballSpeedX = 5;
        ballSpeedY = 4;

        // Set random y position within canvas height
        ballY = Math.random() * (canvas.height - ballHeight);

        ballX = (canvas.width / 2);

    }
    else if ((ballX + ballSpeedX) + 17 < 0) {
        console.log("Opponent lost a point");
        playerPoints++;

        ballSpeedX = 5;
        ballSpeedY = 4;

        ballY = Math.random() * (canvas.height - ballHeight);
        ballX = (canvas.width / 2);

    }
}


function paddleAI() {


}

function gameLoop() {
    requestAnimationFrame(gameLoop);
    drawGame();
}