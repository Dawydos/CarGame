const canvas = document.getElementById('gameCanvas');
canvas.height = 900;
canvas.width = 600;
const context = canvas.getContext('2d');

// Definiere die Abmessungen des Autos
const carWidth = 90;
const carHeight = 170;

// Auto-Position auf der Mittellinie zentrieren
let carX = (canvas.width / 2) - (carWidth / 2);
let carY = canvas.height - carHeight - 20;

// Mittellinien-Versatz
let lineOffset = 0;

// Lade die Bilder
const carImage = new Image();
carImage.src = 'assets/audir8.png';  // Pfad zum Auto-Bild

const leftSideImage = new Image();
leftSideImage.src = 'assets/landschaftLinks.png'; // Pfad zum linken Seitenbild

const rightSideImage = new Image();
rightSideImage.src = 'assets/LandschaftRechts.png'; // Pfad zum rechten Seitenbild

const obstacles = [
    { image: new Image(), x: 150, y: -200 },
    { image: new Image(), x: 250, y: -500 },
    { image: new Image(), x: 350, y: -800 }
];
obstacles[0].image.src = 'assets/car1.png'; // Pfad zum Hindernisbild
obstacles[1].image.src = 'assets/car2.png'; // Pfad zum Hindernisbild
obstacles[2].image.src = 'assets/car3.png'; // Pfad zum Hindernisbild

carImage.onload = function() {
    console.log('Car image loaded');
    gameLoop(); // Startet die Spielschleife, nachdem das Auto-Bild geladen wurde
};

leftSideImage.onload = function() {
    console.log('Left side image loaded');
};

rightSideImage.onload = function() {
    console.log('Right side image loaded');
};

obstacles.forEach((obstacle, index) => {
    obstacle.image.onload = function() {
        console.log(`Obstacle ${index + 1} image loaded`);
    };
});

const music = document.getElementById('gameMusic');

const muteIcon = document.getElementById('muteIcon');
const unmuteIcon = document.getElementById('unmuteIcon');

function toggleMusic() {
    if (music.paused) {
        music.play();
        muteIcon.style.display = 'none';
        unmuteIcon.style.display = 'block';
    } else {
        music.pause();
        muteIcon.style.display = 'block';
        unmuteIcon.style.display = 'none';
    }
}

muteIcon.addEventListener('click', toggleMusic);
unmuteIcon.addEventListener('click', toggleMusic);

function drawTrack() {
    // Straße
    context.fillStyle = 'gray';
    context.fillRect(100, 0, 400, canvas.height);  // Straße zeichnen

    // Mittellinien dicker machen (10px statt 5px)
    context.strokeStyle = 'white';
    context.lineWidth = 10;
    for (let i = lineOffset; i < canvas.height; i += 40) {
        context.beginPath();
        context.moveTo(canvas.width / 2, i);
        context.lineTo(canvas.width / 2, i + 20);
        context.stroke();
    }

    // Linie nach unten bewegen
    lineOffset += 5;
    if (lineOffset > 40) {
        lineOffset = 0;
    }
}

function drawSideImages() {
    // Linkes und rechtes Seitenbild zeichnen
    context.drawImage(leftSideImage, 0, 0, 100, canvas.height); // Linke Seite
    context.drawImage(rightSideImage, canvas.width - 100, 0, 100, canvas.height); // Rechte Seite
}

function drawCar() {
    context.drawImage(carImage, carX, carY, carWidth, carHeight);
}

function drawObstacles() {
    obstacles.forEach(obstacle => {
        context.drawImage(obstacle.image, obstacle.x, obstacle.y, carWidth, carHeight);
        obstacle.y += 5; // Bewege das Hindernis nach unten

        if (obstacle.y > canvas.height) {
            obstacle.y = -carHeight; // Setze das Hindernis zurück, wenn es aus dem Bildschirm verschwindet
        }
    });
}

function checkBoundaries() {
    if (carX < 100) {
        carX = 100;  // Linke Begrenzung der Straße
    } else if (carX + carWidth > canvas.width - 100) {  // Rechte Begrenzung der Straße
        carX = canvas.width - 100 - carWidth;  // Passe die Position an, damit das Auto innerhalb der Straße bleibt
    }
}

function updateGame() {
    context.clearRect(0, 0, canvas.width, canvas.height);
    drawTrack();
    drawSideImages(); // Zeichne die Seitenbilder
    drawCar();
    drawObstacles(); // Zeichne die Hindernisse
    checkBoundaries();
}

function gameLoop() {
    updateGame();
    requestAnimationFrame(gameLoop);
}

window.addEventListener("keydown", function (event) {
    const step = 10; // Schrittgröße für die Bewegung
    if (event.key === 'ArrowUp' && carY > 200) { 
        carY -= step;
    }
    if (event.key === 'ArrowDown' && carY + carHeight < canvas.height) { 
        carY += step;
    }
    if (event.key === 'ArrowLeft' && carX > 100) { 
        carX -= step;
    }
    if (event.key === 'ArrowRight' && carX + carWidth < canvas.width - 100) {
        carX += step;
    }
});
