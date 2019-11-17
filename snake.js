const instructionModal = document.getElementById("start-modal");
const startGameButton = document.getElementById("start-game");
const scoresModal = document.getElementById("scores-modal");
const scoreCloseButton = document.getElementById("score-exit-btn");
const scoreButtonSave = document.getElementById("saveScoreBtn");
const userName = document.getElementById("username");
const scoresModalFill = document.getElementById("score-table-modal");

const cvs = document.getElementById("snake");
const ctx = cvs.getContext("2d");

const box = 32;

const MAX_HIGH_SCORES = 3;

const ground = new Image();
ground.src = "./img/ground.png";

const foodImg = new Image();
foodImg.src = "./img/food.png";

const dead = new Audio();
const eat = new Audio();
const up = new Audio();
const left = new Audio();
const right = new Audio();
const down = new Audio();

dead.src = "./audio/dead.mp3";
eat.src = "./audio/eat.mp3";
up.src = "./audio/up.mp3";
left.src = "./audio/left.mp3";
right.src = "./audio/right.mp3";
down.src = "./audio/down.mp3";

let snake = [];
snake[0] = {
  x: 9 * box,
  y: 10 * box
};

let food = {
  x: Math.floor(Math.random() * 17 + 1) * box,
  y: Math.floor(Math.random() * 15 + 3) * box
};

let score = 0;

startGameButton.addEventListener("click", function() {
  instructionModal.style.display = "none";
});

instructionModal.style.display = "block";

// Local storage
const highScores = JSON.parse(localStorage.getItem("highScores")) || [];


const scoreDisplay = document.getElementById("yourScore");

userName.addEventListener("keyup", () => {
  scoreButtonSave.disabled = !userName.value;
});

scoreButtonSave.addEventListener("click", saveScore);

function saveScore(event) {
  event.preventDefault();
  console.log(userName.value);

  let scores = {
    score: localStorage.getItem("mostRecentScore"),
    name: userName.value
  };
  highScores.push(scores);

  highScores.sort((a, b) => {
    return b.score - a.score
  });

  highScores.splice(3);

  localStorage.setItem("highScores", JSON.stringify(highScores));
  scoresModalFill.innerHTML = "";
  scoresModalFill.appendChild(createScoreTable(highScores));
  scoreButtonSave.disabled = true;
}

function createScoreTable(highScores) {
  const scores = highScores
    .map((row, index) => {
      return `
      <div class="Rtable-cell"><h3>${index + 1}</h3></div>
      <div class="Rtable-cell"><h3>${row.name}</h3></div>
      <div class="Rtable-cell"><h3>${row.score}</h3></div>  
  `;
    })
    .join("\n");

  const cardBody = `
  <div class="Rtable Rtable--3cols">
  ${scores}
  </div>
`;

  const div = document.createElement("div");
  div.innerHTML = cardBody;
  return div;
}

scoreCloseButton.addEventListener("click", function() {
  scoresModal.style.display = "none";
  window.location.reload(true);
});

let d;
document.addEventListener("keydown", direction);
function direction(event) {
  let key = event.keyCode;
  if (key == 37 && d != "RIGHT") {
    left.play();
    d = "LEFT";
  } else if (key == 38 && d != "DOWN") {
    up.play();
    d = "UP";
  } else if (key == 39 && d != "LEFT") {
    right.play();
    d = "RIGHT";
  } else if (key == 40 && d != "UP") {
    down.play();
    d = "DOWN";
  }
}

function collision(head, array) {
  for (let i = 0; i < array.length; i++) {
    if (head.x == array[i].x && head.y == array[i].y) {
      return true;
    }
  }
  return false;
}

function draw() {
  ctx.drawImage(ground, 0, 0);
  for (let i = 0; i < snake.length; i++) {
    ctx.fillStyle = i == 0 ? "green" : "white";
    ctx.fillRect(snake[i].x, snake[i].y, box, box);

    ctx.strokeStyle = "red";
    ctx.strokeRect(snake[i].x, snake[i].y, box, box);
  }
  ctx.drawImage(foodImg, food.x, food.y);

  let snakeX = snake[0].x;
  let snakeY = snake[0].y;

  if (d == "LEFT") snakeX -= box;
  if (d == "UP") snakeY -= box;
  if (d == "RIGHT") snakeX += box;
  if (d == "DOWN") snakeY += box;

  if (snakeX == food.x && snakeY == food.y) {
    score++;
    eat.play();
    food = {
      x: Math.floor(Math.random() * 17 + 1) * box,
      y: Math.floor(Math.random() * 15 + 3) * box
    };
  } else {
    snake.pop();
  }

  let newHead = {
    x: snakeX,
    y: snakeY
  };

  if (
    snakeX < box ||
    snakeX > 17 * box ||
    snakeY < 3 * box ||
    snakeY > 17 * box ||
    collision(newHead, snake)
  ) {
    clearInterval(game);
    dead.play();
    scoresModal.style.display = "block";
    scoreDisplay.innerText = score;
    localStorage.setItem("mostRecentScore", score);
  }

  snake.unshift(newHead);

  ctx.fillStyle = "white";
  ctx.font = "45px Changa one";
  ctx.fillText(score, 2 * box, 1.6 * box);
}

let game = setInterval(draw, 200);
