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
let ballWidth = 17; // Ball default width
let ballHeight = 17; // Ball default height
let ballSpeedX = 5; // Ball x movement speed
let ballSpeedY = 4; // Ball y movement speed
let ballX = (canvas.width / 2) + ballWidth; // Ball default x (horizontal) position
let ballY = (canvas.height / 2); // Ball default y (vertical) position


// Mouse y position
let mouseY;

const canvasTopBorder = 10;
const canvasBottomBorder = 560;

// Points variables 
let playerPoints = 10;
let opponentPoints = 10;
const winNumber = 11;


drawPreGame();


function drawPreGame() {
    // Listen to whenever user clicks on the canvas
    canvas.addEventListener('click', startGame);

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


// Start gameLoop 
function startGame() {
    gameLoop();
    // Listen to whenever user press Escape 
    document.addEventListener("keydown", resetGame, false);
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

    if (mouseY > canvasBottomBorder) {
        console.log("Paddle reached the bottom");
        paddleY = canvasBottomBorder;
    }
    else if (mouseY < canvasTopBorder) {
        console.log("Paddle reached the top");
        paddleY = canvasTopBorder;
    }
}

function drawGame() {
    ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear the canvas

    canvas.removeEventListener('click', startGame); // Remove click input after starting the game
    document.getElementById('gameArea').style.cursor = "none"; // Hide the cursor

    // Draw the paddle
    ctx.fillStyle = "white";
    ctx.fillRect(paddleX, paddleY, paddleWidth, paddleHeight);

    // Draw the opponent paddle
    ctx.fillRect(opponentPaddleX, opponentPaddleY, paddleWidth, paddleHeight);

    // Draw the ball
    ctx.fillRect(ballX, ballY, ballWidth, ballHeight);

    // Player Points
    ctx.font = "150px 'Digital-7 Mono'";
    ctx.textAlign = "center";
    ctx.fillText(playerPoints, canvas.width - 500, 120);

    // Opponent Points 
    ctx.fillText(opponentPoints, 500, 120);

    drawDividers();
}

function ballBounce() {
    ballX += ballSpeedX;
    ballY += ballSpeedY;

    // Bounce from top and bottom
    if ((ballY + ballSpeedY) + ballHeight > canvas.height) {
        ballSpeedY = -ballSpeedY;
    } else if ((ballY + ballSpeedY) < 0) {
        ballSpeedY = -ballSpeedY;
    }

    // Check collision with paddle
    if (ballX + ballWidth > paddleX && ballX < paddleX + paddleWidth) {
        if (ballY + ballHeight > paddleY && ballY < paddleY + paddleHeight) {
            // Collision detected, reverse ball's x-direction
            ballSpeedX = -12;
            console.log("The ball touched the paddle");
        }
    }

    // Check collision with opponent paddle
    if (ballX < opponentPaddleX + paddleWidth && ballX + ballWidth > opponentPaddleX) {
        if (ballY + ballHeight > opponentPaddleY && ballY < opponentPaddleY + paddleHeight) {
            // Collision detected, reverse ball's x-direction and adjust y-direction based on contact point
            ballSpeedX = -ballSpeedX;
            ballSpeedY *= 1.05; // Increase speed slightly after each hit 
            console.log("The ball touched the opponent paddle");
        }
    }
}


function updateGameState() {
    if (playerPoints === winNumber || opponentPoints === winNumber) {
        isGameEnded = true;
        ballSpeedX = 0;
        ballSpeedY = 0;
        ballX = (canvas.width / 2);
        canvas.removeEventListener("mousemove", onMouseMove, false);
    }
}

function renderGameResult() {
    if (playerPoints === winNumber) {
        ctx.fillText("winner", canvas.height + 250, 400);
        ctx.fillText("loser", canvas.height / 2, 400);
        ctx.font = "italic 30px 'Press Start 2P'";
        ctx.fillText("Press escape", canvas.height + 250, 600);
    } else if (opponentPoints === winNumber) {
        ctx.fillText("loser", canvas.height + 250, 400);
        ctx.fillText("winner", canvas.height / 2, 400);
        ctx.font = "italic 30px 'Press Start 2P'";
        ctx.fillText("Press escape", canvas.height + 250, 600);
    }

}

function resetGame(event) {
    if (event.key === "Escape" && isGameEnded) {
        playerPoints = 0;
        opponentPoints = 0;
        ballX = canvas.width / 2;
        ballY = canvas.height / 2;
        ballSpeedX = 5;
        ballSpeedY = 4;
        canvas.addEventListener("mousemove", onMouseMove, false);
        isGameEnded = false;
    }
}

function losePoint() {

    if ((ballX + ballSpeedX) + ballWidth > canvas.width) {
        //ballSpeedX = -ballSpeedX;
        console.log("Player lost a point");
        opponentPoints++;

        ballSpeedX = 5;
        ballSpeedY = 4;

        // Set random y position within canvas height
        ballY = Math.random() * (canvas.height - ballHeight);

        ballX = (canvas.width / 2);

    }
    else if ((ballX + ballSpeedX) + ballWidth < 0) {
        console.log("Opponent lost a point");
        playerPoints++;

        ballSpeedX = 5;
        ballSpeedY = 4;

        ballY = Math.random() * (canvas.height - ballHeight);
        ballX = (canvas.width / 2);

    }
}

function drawDividers() {

    // LOOP PROBLEM !!!

    // Draw the divider
    for (let i = 0; i < canvas.height; i++) {
        ctx.fillStyle = "white";
        ctx.fillRect(dividerX, dividerY + i * (dividerHeight + dividerOffset), dividerWidth, dividerHeight);
        // console.log("Divider is drawn");
    }
}



function paddleAI() {
    // TO CODE !!!
}


function gameLoop() {
    requestAnimationFrame(gameLoop);

    // Update game state
    updateGameState();

    // Render game elements
    drawGame();

    // Render game results
    renderGameResult();

    //Ball physics
    ballBounce();
    // Paddle AI
    paddleAI();
    // Point losing function
    losePoint();

}
