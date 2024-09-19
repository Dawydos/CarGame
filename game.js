const canvas = document.getElementById("gameCanvas");
canvas.height = 900;
canvas.width = 600;
const context = canvas.getContext("2d");

// Definiere die Abmessungen des Autos
const carWidth = 90;
const carHeight = 170;

// Gegnerische Autos (etwas breiter und niedriger)
const obstacleWidth = carWidth * 1.2; // 20% breiter
const obstacleHeight = carHeight * 0.8; // 20% niedriger

// Auto-Position auf der Mittellinie zentrieren
let carX = canvas.width / 2 - carWidth / 2;
let carY = canvas.height - carHeight - 20;

// Mittellinien-Versatz
let lineOffset = 0;

// Lade die Bilder (stelle sicher, dass es transparente PNGs sind)
const carImage = new Image();
carImage.src = "assets/car1.png"; // Spielerauto (mit transparentem Hintergrund)

const leftSideImage = new Image();
leftSideImage.src = "assets/landschaftLinks.png"; // Linkes Seitenbild

const rightSideImage = new Image();
rightSideImage.src = "assets/LandschaftRechts.png"; // Rechtes Seitenbild

const hindernisse = [
  { image: new Image(), x: 150, y: -200 },
  { image: new Image(), x: 250, y: -500 },
];

hindernisse[0].image.src = "assets/car2.png";
hindernisse[1].image.src = "assets/car3.png";

let gameOver = false; // Variable zur Überprüfung, ob das Spiel vorbei ist
let restartButton;

carImage.onload = function () {
  gameLoop(); // Startet die Spielschleife, nachdem das Auto-Bild geladen wurde
};

leftSideImage.onload = function () {
  console.log("Left side image loaded");
};

rightSideImage.onload = function () {
  console.log("Right side image loaded");
};

hindernisse.forEach((hindernis, index) => {
  hindernis.image.onload = function () {
    console.log(`Hindernis ${index + 1} image loaded`);
  };
});

// Punktestand
let score = 0;

function drawTrack() {
  // Straße
  context.fillStyle = "gray";
  context.fillRect(100, 0, 400, canvas.height);

  // Mittellinie
  context.strokeStyle = "white";
  context.lineWidth = 10;
  for (let i = lineOffset; i < canvas.height; i += 40) {
    context.beginPath();
    context.moveTo(canvas.width / 2, i);
    context.lineTo(canvas.width / 2, i + 20);
    context.stroke();
  }

  lineOffset += 5;
  if (lineOffset > 40) {
    lineOffset = 0;
  }
}

function drawSideImages() {
  context.drawImage(leftSideImage, 0, 0, 100, canvas.height); // Links füllen
  context.drawImage(rightSideImage, canvas.width - 100, 0, 100, canvas.height); // Rechts füllen
}

function drawCar() {
  context.drawImage(carImage, carX, carY, carWidth, carHeight);
}

function drawHindernisse() {
  hindernisse.forEach((hindernis) => {
    context.drawImage(
      hindernis.image,
      hindernis.x,
      hindernis.y,
      obstacleWidth,
      obstacleHeight
    ); // Gegnerische Autos breiter und niedriger
    hindernis.y += 5;

    if (hindernis.y > canvas.height) {
      hindernis.y = -obstacleHeight;
    }

    // Kollisionserkennung
    if (kollisionErkennen(hindernis)) {
      gameOver = true;
      spielBeenden();
    }
  });
}

function kollisionErkennen(hindernis) {
  return (
    carX < hindernis.x + obstacleWidth &&
    carX + carWidth > hindernis.x &&
    carY < hindernis.y + obstacleHeight &&
    carY + carHeight > hindernis.y
  );
}

function drawScore() {
  context.fillStyle = "black";
  context.font = "30px Arial";
  context.fillText("Score: " + score, 20, 40);
}

function checkBoundaries() {
  if (carX < 100) {
    carX = 100;
  } else if (carX + carWidth > canvas.width - 100) {
    carX = canvas.width - 100 - carWidth;
  }
}

function updateGame() {
  if (!gameOver) {
    context.clearRect(0, 0, canvas.width, canvas.height);
    drawTrack();
    drawSideImages();
    drawCar();
    drawHindernisse();
    drawScore();
    checkBoundaries();
  }
}

function spielBeenden() {
  setTimeout(() => {
    // Zeige den Neustart-Button nach 10 Sekunden
    restartButton = document.createElement("button");
    restartButton.innerHTML = "Neustart";
    restartButton.style.position = "absolute";
    restartButton.style.top = "50%";
    restartButton.style.left = "50%";
    restartButton.style.transform = "translate(-50%, -50%)";
    restartButton.style.padding = "20px";
    restartButton.style.fontSize = "20px";
    document.body.appendChild(restartButton);

    restartButton.addEventListener("click", () => {
      window.location.reload(); // Neustart bei Button-Klick
    });
  }, 10000); // 10 Sekunden Verzögerung
}

function gameLoop() {
  score++;
  updateGame();
  if (!gameOver) {
    requestAnimationFrame(gameLoop);
  }
}

window.addEventListener("keydown", function (event) {
  const schritt = 10; // Verdoppelte Schrittweite für schnellere Bewegung
  if (event.key === "ArrowUp" && carY > 200) {
    carY -= schritt;
  }
  if (event.key === "ArrowDown" && carY + carHeight < canvas.height) {
    carY += schritt;
  }
  if (event.key === "ArrowLeft" && carX > 100) {
    carX -= schritt;
  }
  if (event.key === "ArrowRight" && carX + carWidth < canvas.width - 100) {
    carX += schritt;
  }
});

// Musik abspielen, wenn das Spiel geladen wird
const spielMusik = document.getElementById("gameMusic");
spielMusik.volume = 0.5; // Lautstärke auf 50%
spielMusik.play().catch((error) => {
  console.error("Fehler beim Abspielen der Musik: ", error);
});

musikButton.addEventListener("click", function () {
    console.log("Music button clicked");
    if (musikLäuft) {
      console.log("Pausing music");
      spielMusik.pause();
      musikLäuft = false;
      musikButton.style.background = "gray"; // Change button color to gray when music is paused
    } else {
      console.log("Playing music");
      spielMusik.play();
      musikLäuft = true;
      musikButton.style.background = "red"; // Change button color to red when music is playing
    }
  });
