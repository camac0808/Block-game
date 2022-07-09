let canvas = document.getElementById("canvas"); // width 480 height 320
let ctx = canvas.getContext("2d");
let h1 = document.querySelector("h1");
let button = document.querySelector("button");

let x = canvas.width / 2; // 공의 x 위치
let y = canvas.height - 30; // 공의 y 위치

let paddleWidth = 75; // 패들 너비
let paddleHeight = 10; // 패들 높이
let paddleX = (canvas.width - paddleWidth) / 2; // 패들의 좌표 x값
let paddleY = canvas.height - paddleHeight; // 패들의 좌표 y값

let dx = 2; // 공의 거리
let dy = -2;
let v = 1; // 공 속도
let ballRadius = 5; // 공의 반지름
let rightPress = false;
let leftPress = false;

let color = [
  "#5adaff",
  "#5468ff",
  "#0095DD",
  "#129b3f",
  "#e4a6cf",
  "#81ecec",
  "#55efc4",
  "#fab1a0",
];
let chosenColor = "#0095DD";

let score = 0;
let lives = 3;

// 패들 만들기
function drawPaddle() {
  ctx.beginPath();
  ctx.rect(paddleX, paddleY, paddleWidth, paddleHeight);
  ctx.fillStyle = chosenColor;
  ctx.fill();
  ctx.closePath();
}
// 공 만들기
function drawBall() {
  ctx.beginPath();
  ctx.arc(x, y, ballRadius, 0, Math.PI * 2); // x, y 좌표값, 반지름값
  ctx.fillStyle = chosenColor;
  ctx.fill();
  ctx.closePath();
}

// 벽돌 그리기
function drawBricks(color) {
  for (var c = 0; c < brickColumn; c++) {
    for (var r = 0; r < brickRow; r++) {
      if (bricks[c][r].status == 1) {
        let brickX = c * (brickWidth + brickPadding) + brickOffsetTop;
        let brickY = r * (brickHeight + brickPadding) + brickOffsetLeft;
        bricks[c][r].x = brickX;
        bricks[c][r].y = brickY;

        ctx.beginPath();
        ctx.rect(brickX, brickY, brickWidth, brickHeight);
        ctx.fillStyle = color;
        ctx.fill();
        ctx.closePath();
      }
    }
  }
}

// 점수판
function drawScore() {
  ctx.font = "16px Arial";
  ctx.fillStyle = chosenColor;
  ctx.fillText("Score: " + score, 8, 20);
}

// 목숨
function drawLives() {
  ctx.font = "16px Arial";
  ctx.fillStyle = chosenColor;
  ctx.fillText("Lives: " + lives, canvas.width - 65, 20);
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height); // canvas 전체 삭제
  drawBall();
  drawPaddle();
  drawBricks(chosenColor);
  collisionDetection();
  drawScore(chosenColor);
  drawLives();

  // 왼쪽 오른쪽 부딪히면 튕김
  if (x + dx - ballRadius < 0 || x + dx + ballRadius > canvas.width) {
    dx = -dx;
  }

  // 위 부딪히면 튕김
  if (y + dy - ballRadius < 0) {
    dy = -dy;
  }
  // 아래 부딪힐때
  if (y + dy + ballRadius > canvas.height) {
    // 패들에 맞을때
    if (x > paddleX && x < paddleX + paddleWidth) {
      dy = -dy;
      v += 0.2;
    }
    // 패들에 안맞을때
    else {
      lives--;
      if (lives == 0) {
        h1.innerHTML = "GAME OVER";
        button.removeAttribute("hidden");
        document.removeEventListener("mousemove", mouseMoveHandler);
        return false;
      } else {
        x = canvas.width / 2;
        y = canvas.height - 30;
        dx = 3;
        dy = -3;
        paddleX = (canvas.width - paddleWidth) / 2;
      }
    }
  }

  // 패들의 이동
  if (rightPress && paddleX < canvas.width - paddleWidth) {
    paddleX += 7;
  } else if (leftPress && paddleX > 0) {
    paddleX -= 7;
  }

  // 패들 다 맞추면
  if (score == brickColumn * brickRow) {
    h1.innerHTML = "YOU WIN, CONGRATULATIONS!";
    button.removeAttribute("hidden");
    document.addEventListener("keydown", (event) => {
      if (event.key == "ArrowRight") {
        rightPress = false;
      } else if (event.key == "ArrowLeft") {
        leftPress = false;
      }
    });
    return false;
  }
  x += dx * v;
  y += dy * v;
  // draw()함수가 반복적으로 자신을 호출
  requestAnimationFrame(draw);
}

button.addEventListener("click", () => {
  document.location.reload();
});

document.addEventListener("keydown", (event) => {
  if (event.key == "ArrowRight") {
    rightPress = true;
  } else if (event.key == "ArrowLeft") {
    leftPress = true;
  }
});

document.addEventListener("keyup", (event) => {
  if (event.key == "ArrowRight") {
    rightPress = false;
  } else if (event.key == "ArrowLeft") {
    leftPress = false;
  }
});

document.addEventListener("mousemove", mouseMoveHandler, false);

function mouseMoveHandler(event) {
  let mouseX = event.clientX - canvas.offsetLeft;
  if (mouseX - paddleWidth / 2 > 0 && mouseX < canvas.width - paddleWidth / 2) {
    paddleX = mouseX - paddleWidth / 2;
  }
}
/* ----------------------------------------------------------------
                            벽돌 만들기 
---------------------------------------------------------------- */
var brickRow = 3;
var brickColumn = 5;
var brickWidth = 75;
var brickHeight = 20;
var brickPadding = 10;
var brickOffsetTop = 30;
var brickOffsetLeft = 30;

let bricks = [];

// 2차원 배열
for (var c = 0; c < brickColumn; c++) {
  bricks[c] = [];
  for (var r = 0; r < brickRow; r++) {
    bricks[c][r] = { x: 0, y: 0, status: 1 };
  }
}

/* ----------------------------------------------------------------
                            충돌 감지  
---------------------------------------------------------------- */

function collisionDetection() {
  for (let c = 0; c < brickColumn; c++) {
    for (let r = 0; r < brickRow; r++) {
      var brick = bricks[c][r];
      if (brick.status == 1) {
        if (x > brick.x && x < brick.x + brickWidth && y > brick.y && y < brick.y + brickHeight) {
          dy = -dy;
          brick.status = 0;
          let randomColor = color[Math.floor(Math.random() * color.length)];
          chosenColor = randomColor;
          score++;
        }
      }
    }
  }
}

draw();