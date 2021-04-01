"use strict";

// Create the canvas
var canvas = document.getElementById("canvas");
    canvas.width = 655;
    canvas.height = 570;
    canvas.style.cursor = "pointer";

var ctx = canvas.getContext("2d");
var canLeft = canvas.offsetLeft;
var canTop = canvas.offsetTop;

// Background image
var bgReady = false;
var bgImage = new Image();
    bgImage.onload = function () {
        bgReady = true;
    };
    bgImage.src = "img/background.jpeg";


// bird objects
var birdReady = false;
var birdImage = new Image();
var bird = {};
var score = 0;

birdImage.onload = function () {
    birdReady = true;
};
birdImage.src = "img/bird.png";


// Speed / time variables 
var speed = 3000;
var newSpeed = speed;
var speedFactor = 1.2;


// Reset the game when the user clicks bird
var reset = function () {
    // Places the bird randomly 
    bird.x = 60 + (Math.random() * (canvas.width - 120));
    bird.y = 60 + (Math.random() * (canvas.height - 120));
};


// Reset the game score when the user clicks reset score button
function resetScore() {
    newSpeed = speed;
    score = 0;
    reset();
    then = Date.now();
}


// Reset speed of bird
function resetSpeed() {
   newSpeed = speed;
   then = Date.now();
}


// Event listeners 
function pickBird(e) {
    var x = e.pageX - canLeft;
    var y = e.pageY - canTop;

    if (y > bird.y && y < bird.y + 600 && x > bird.x && x < 980) 
    {
        score++;
        reset();
        newSpeed = newSpeed / speedFactor;
        then = Date.now();
    }
}

// Draw everything
var render = function () {
    if (bgReady) 
    {
        ctx.drawImage(bgImage, 0, 0);
    }

    if (birdReady) 
    {
        ctx.drawImage(birdImage, bird.x, bird.y);
    }

    // Score
    ctx.fillStyle = "rgb(250, 250, 250)";
    ctx.font = "24px Helvetica";
    ctx.textAlign = "left";
    ctx.textBaseline = "top";
    ctx.fillText("Score: " + score, 20, 20);
};


// The main game loop
var main = function () {
    var now = Date.now();
    var delta = now - then;

    if (delta > newSpeed) 
    {
        reset();
    }
    render();

    if (delta > newSpeed)
    {
        then = Date.now();
    }

    requestAnimationFrame(main);
};


// Cross-browser support for requestAnimationFrame
var w = window;
requestAnimationFrame = w.requestAnimationFrame || w.webkitRequestAnimationFrame || w.msRequestAnimationFrame || w.mozRequestAnimationFrame;

function createEventListeners() {
    addEventListener("mousedown", pickBird, false);
    document.getElementById("resetScore").addEventListener("click", resetScore, false);
    document.getElementById("resetSpeed").addEventListener("click", resetSpeed, false);
}

// Start game
var then = Date.now();
reset();
main();

window.addEventListener("load", createEventListeners, false);