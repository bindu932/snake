const snakes = {
  99: 77, 95: 75, 93: 69, 87: 24, 67: 30, 63: 19, 59: 17, 16: 7
};
const ladders = {
  9: 27, 28: 51, 25: 54, 18: 37, 56: 64, 76: 97, 79: 100, 68: 88
};

const playerIcons = [
  "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQWJj8_xtSUh__M8_HA_GU6eG4lpV75VNup_g&s", 
  "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSe43cidD5-QOlCnGVL4ODFHGt280VP3Li1vw&s"  
];

let playerPositions = [0, 0];
let currentPlayer = 0;
let gameHistory = []; 

function roll() {
  document.getElementById("diceSound").currentTime = 0;
  document.getElementById("diceSound").play(); // 

  const rollValue = 1 + Math.floor(Math.random() * 6);
  let nextPos = playerPositions[currentPlayer] + rollValue;


  if (nextPos > 100) {
    updateInfoBox(rollValue, "Invalid move: You rolled too high");
    return;
  }

  let action = "normal";

  if (ladders[nextPos]) {
    nextPos = ladders[nextPos];
    action = "ladder";
  } else if (snakes[nextPos]) {
    nextPos = snakes[nextPos];
    action = "snake";
  }

  const oldTile = document.querySelector(`.tile${playerPositions[currentPlayer]}`);
  if (oldTile) {
    const images = oldTile.querySelectorAll("img");
    images.forEach(img => {
      if (img.src === playerIcons[currentPlayer]) img.remove();
    });
  }

  playerPositions[currentPlayer] = nextPos;

  const newTile = document.querySelector(`.tile${playerPositions[currentPlayer]}`);
  const img = document.createElement("img");
  img.src = playerIcons[currentPlayer];
  newTile.appendChild(img);

  if (action === "ladder") {
    document.getElementById("ladderSound").play();
  } else if (action === "snake") {
    document.getElementById("snakeSound").play();
  }

  updateInfoBox(rollValue, action);


  gameHistory.push({
    player: currentPlayer + 1,
    rollValue: rollValue,
    action: action,
    position: nextPos
  });

  
  currentPlayer = currentPlayer === 0 ? 1 : 0;
}

function updateInfoBox(rollValue, action) {
  let infoText = `It's Player ${currentPlayer + 1}'s Turn. `;
  infoText += `Player ${currentPlayer + 1} rolled a ${rollValue}.`;

  if (action === "ladder") {
    infoText += " They climbed a ladder!";
  } else if (action === "snake") {
    infoText += " They got bitten by a snake!";
  } else if (playerPositions[currentPlayer] === 100) {
    document.getElementById("winSound").play();
    infoText = `Player ${currentPlayer + 1} WON! Congratulations!`;
  }

  document.getElementById("game-info").textContent = infoText;
}

function downloadCSV() {
  const headers = ['Player', 'Roll Value', 'Action', 'Position'];
  let csvContent = "data:text/csv;charset=utf-8," + headers.join(",") + "\n";

  gameHistory.forEach((entry) => {
    const row = [entry.player, entry.rollValue, entry.action, entry.position].join(",");
    csvContent += row + "\n";
  });

  const encodedUri = encodeURI(csvContent);
  const link = document.createElement("a");
  link.setAttribute("href", encodedUri);
  link.setAttribute("download", "game_history.csv");
  document.body.appendChild(link);
  link.click();
}