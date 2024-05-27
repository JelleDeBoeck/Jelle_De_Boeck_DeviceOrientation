const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

canvas.width = 400;
canvas.height = 400;

let ball = {
    x: 60,
    y: 60,
    radius: 10,
    color: 'white',
    speed: 2,
    dx: 0,
    dy: 0
};

let maze = [
    { x: 0, y: 0, width: canvas.width, height: 30 },
    { x: 0, y: 0, width: 20, height: canvas.height },
    { x: 0, y: canvas.height - 20, width: canvas.width, height: 20 },
    { x: canvas.width - 20, y: 0, width: 20, height: canvas.height - 100 },

    { x: 100, y: 20, width: 20, height: 100 },
    { x: 160, y: 20, width: 20, height: 60 },
    { x: 240, y: 20, width: 20, height: 120 },
    { x: 160, y: 200, width: 160, height: 20 },
    { x: 160, y: 140, width: 20, height: 60 },
    { x: 20, y: 200, width: 160, height: 20 },
    { x: 80, y: 290, width: 320, height: 20 },
];

let score = 0;
let startX = 60;
let startY = 60;
let exitX = 395; 
let exitY = 310;

window.addEventListener('deviceorientation', handleOrientation);

function handleOrientation(event) {
    const beta = event.beta;
    const gamma = event.gamma;

    ball.dx = gamma < 0 ? -ball.speed : gamma > 0 ? ball.speed : 0;
    ball.dy = beta < 90 ? -ball.speed : beta > 90 ? ball.speed : 0;

    moveBall();
    checkExit();
    draw();
}

function moveBall() {
    let newX = ball.x + ball.dx;
    let newY = ball.y + ball.dy;

    for (let wall of maze) {
        if (
            newX + ball.radius > wall.x &&
            newX - ball.radius < wall.x + wall.width &&
            newY + ball.radius > wall.y &&
            newY - ball.radius < wall.y + wall.height
        ) {
            if (newX + ball.radius > wall.x && ball.x - ball.radius < wall.x + wall.width) {
                ball.dx = 0;
            }
            if (newY + ball.radius > wall.y && ball.y - ball.radius < wall.y + wall.height) {
                ball.dy = 0;
            }
            newX = ball.x + ball.dx;
            newY = ball.y + ball.dy;
        }
    }

    if (newX - ball.radius < 0 || newX + ball.radius > canvas.width) {
        ball.dx = 0;
    }
    if (newY - ball.radius < 0 || newY + ball.radius > canvas.height) {
        ball.dy = 0;
    }

    ball.x += ball.dx;
    ball.y += ball.dy;
}

function checkExit() {
    if (ball.x + ball.radius > exitX &&
        ball.x - ball.radius < exitX + 20 &&
        ball.y + ball.radius > exitY &&
        ball.y - ball.radius < exitY + 20) {
        score++;
        ball.x = startX;
        ball.y = startY;
    }
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = 'black';
    maze.forEach(wall => {
        ctx.fillRect(wall.x, wall.y, wall.width, wall.height);
    });

    ctx.fillStyle = 'white';
    ctx.fillRect(exitX, exitY, 5, 70);

    ctx.beginPath();
    ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
    ctx.fillStyle = ball.color;
    ctx.fill();
    ctx.closePath();

    ctx.fillStyle = 'white';
    ctx.font = '16px Arial';
    ctx.fillText('Score: ' + score, 170, 20);
}

draw();
