// Create canvas
var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");
canvas.width = 655;
canvas.height = 570;

// Global constant variables
var roleWidth = 70;
var roleHeight = 70;
var bgBoundaryWidth = canvas.width - roleWidth;
var bgBoundaryHeight = canvas.height - roleHeight;
var birdMoveId;
var speedInterval = 5000;


// Background image
var bgReady = false;
var bgImg = new Image();
bgImg.src = "img/background.jpeg";
bgImg.onload = function () {
    bgReady = true;
};

// plane image
var planeReady = false;
var planeImg = new Image();
planeImg.src = "img/airplane.png";
planeImg.onload = function () {
    planeReady = true;
};

// bird image
var birdReady = false;
var birdImg = new Image();
birdImg.src = "img/bird.png";
birdImg.onload = function () {
    birdReady = true;
};

// Game objects
var plane = {
    speed: 256,
    x: canvas.width / 2,
    y: canvas.height / 2
};
var bird = {
    x: 0,
    y: 0
};
var birdCaught = 0;

// Handle keyboard controls
var keysDown = {};

addEventListener("keydown", function (e) {
    keysDown[e.keyCode] = true;
}, false);

addEventListener("keyup", function (e) {
    delete keysDown[e.keyCode];
}, false);


// Reset the game when the player catches a bird
var reset = function () 
{
    // Throw the bird somewhere on the screen randomly
    bird.x = Math.random() * bgBoundaryWidth;
    bird.y = Math.random() * bgBoundaryHeight;

    if (bird.x < 0 || bird.x > bgBoundaryWidth || bird.y < 0 || bird.y > bgBoundaryHeight) 
    {
        bird.x = Math.random() * bgBoundaryWidth;
        bird.y = Math.random() * bgBoundaryHeight;
    }
};


// The bird will move if the player doesn't catch it within a specific time interval
function startBirdMove() {
    birdMoveId = setInterval(reset, speedInterval);
}


function stopBirdMove() {
    clearInterval(birdMoveId);
}

// Reset Score
function resetScore() {
    birdCaught = 0;
}

// Reset SpeedInterval
function resetSpeedInterval() {
    stopBirdMove();
    speedInterval = 5000;
}

// Update game objects
var update = function (modifier) {
    if (38 in keysDown) 
    { // Player holding up
        if (plane.y > 0) 
        {
            plane.y -= plane.speed * modifier;
        }
    }
    if (40 in keysDown) 
    { // Player holding down
        if (plane.y < bgBoundaryHeight) 
        {
            plane.y += plane.speed * modifier;
        }
    }
    if (37 in keysDown) 
    { // Player holding left
        if (plane.x > 0) 
        {
            plane.x -= plane.speed * modifier;
        }
    }
    if (39 in keysDown) 
    { // Player holding right
        if (plane.x < bgBoundaryWidth) 
        {
            plane.x += plane.speed * modifier;
        }
    }
    
    // touching?
    if (
        plane.x <= (bird.x + roleWidth / 2)
        && bird.x <= (plane.x + roleWidth / 2)
        && plane.y <= (bird.y + roleHeight / 2)
        && bird.y <= (plane.y + roleHeight / 2)
       )
    {
        planeImg.src = "img/airplane.png";
        birdImg.src = "img/angrybird.png";
        
        setTimeout(function () 
        {
            planeImg.src = "img/crashedplane.png";
            birdImg.src = "img/smilebird.png";
        }, 500);

        if (speedInterval > 500) {
            speedInterval -= 500;
        }
        stopBirdMove();
        startBirdMove();
        ++birdCaught;
        reset();
    }
};

// Draw everything
var render = function () 
{
    if (bgReady) 
    {
        ctx.drawImage(bgImg, 0, 0);
    }
    if (planeReady) 
    {
        ctx.drawImage(planeImg, plane.x, plane.y, roleWidth, roleHeight);
    }
    if (birdReady) 
    {
        ctx.drawImage(birdImg, bird.x, bird.y, roleWidth, roleHeight);
    }

    // Score
    ctx.fillStyle = "rgb(250, 250, 250)";
    ctx.font = "24px Helvetica";
    ctx.textAlign = "left";
    ctx.textBaseLine = "top";
    ctx.fillText("Score: " + birdCaught, roleWidth / 4, roleHeight / 2);

};

// The main game loop
var main = function () {
    var now = Date.now();
    var delta = now - then;

    update(delta / 1000);
    render();

    then = now;

    // Request to do this again ASAP
    requestAnimationFrame(main);
};

// Cross-browser support for requestAnimationFrame
var w = window;
requestAnimationFrame = w.requestAnimationFrame || w.webkitRequestAnimationFrame || w.msRequestAnimationFrame || w.mozRequestAnimationFrame;

// Let's play this game!
var then = Date.now();
reset();
main();

// Set Bird Move
startBirdMove();


