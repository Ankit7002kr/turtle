// cars.js - Updated with Turtle Image, Animations, Music, Restart, and Car Images

console.log("Game Loaded!");

document.addEventListener("DOMContentLoaded", () => {
    let turtle = document.getElementById("turtle");
    let container = document.querySelector(".container");
    let statusText = document.getElementById("status");
    let scoreText = document.createElement("h2");
    document.body.insertBefore(scoreText, container);
    
    let restartButton = document.createElement("button");
    restartButton.innerText = "Restart";
    restartButton.id = "restart-btn";
    restartButton.style.display = "none";
    restartButton.onclick = restartGame;
    document.body.appendChild(restartButton);

    let gameOver = false;
    let turtleBottom = 0;
    const jumpStep = 20;
    let score = 0;
    let carSpeed = 5;
    let carInterval = 4000;
    let bgMusic = new Audio("bg-music.mp3");
    let gameOverSound = new Audio("game-over.mp3");
    let winSound = new Audio("win.mp3");
    bgMusic.loop = true;
    bgMusic.play();

    // Set turtle image
    turtle.style.backgroundImage = "url('turtle.png')";
    turtle.style.backgroundSize = "contain";
    turtle.style.backgroundRepeat = "no-repeat";
    turtle.style.width = "50px";
    turtle.style.height = "50px";

    window.addEventListener("keydown", (e) => {
        if (e.keyCode === 32 || e.keyCode === 40) e.preventDefault();
    });

    function control(e) {
        if (gameOver) return;
        if (e.keyCode === 32) moveTurtleUp();
        if (e.keyCode === 40) moveTurtleDown();
    }

    function moveTurtleUp() {
        turtleBottom += jumpStep;
        if (turtleBottom > container.clientHeight - 40) {
            turtleBottom = container.clientHeight - 40;
            showWinMessage();
        }
        turtle.style.bottom = turtleBottom + "px";
        turtle.style.transition = "bottom 0.2s ease-out";
    }

    function moveTurtleDown() {
        turtleBottom -= jumpStep;
        if (turtleBottom < 0) turtleBottom = 0;
        turtle.style.bottom = turtleBottom + "px";
        turtle.style.transition = "bottom 0.2s ease-out";
    }

    document.addEventListener("keydown", control);

    function createCars() {
        if (gameOver) return;

        for (let i = 0; i < 2; i++) {
            let carLeft = container.clientWidth;
            let carTop = Math.floor(Math.random() * (container.clientHeight - 30));
            let carSpeedLocal = carSpeed + Math.random() * 3;
            let newCar = document.createElement("div");
            
            let carIndex = Math.floor(Math.random() * 5) + 1; // Random car image selection
            newCar.style.backgroundImage = `url('car${carIndex}.png')`;
            newCar.style.backgroundSize = "contain";
            newCar.style.backgroundRepeat = "no-repeat";
            newCar.style.left = carLeft + "px";
            newCar.style.top = carTop + "px";
            newCar.style.width = "100px";
            newCar.style.height = "80px";
            newCar.classList.add("cars");
            container.appendChild(newCar);

            function moveCars() {
                if (gameOver) {
                    clearInterval(carTimerId);
                    return;
                }

                carLeft -= carSpeedLocal;
                newCar.style.left = carLeft + "px";

                let turtleRect = turtle.getBoundingClientRect();
                let carRect = newCar.getBoundingClientRect();

                if (
                    carRect.left < turtleRect.right &&
                    carRect.right > turtleRect.left &&
                    carRect.top < turtleRect.bottom &&
                    carRect.bottom > turtleRect.top
                ) {
                    showGameOverMessage();
                    return;
                }

                if (carLeft < -80) {
                    clearInterval(carTimerId);
                    newCar.remove();
                }
            }

            let carTimerId = setInterval(moveCars, 80);
        }
        setTimeout(createCars, carInterval);
    }

    function increaseDifficulty() {
        if (gameOver) return;
        score++;
        scoreText.innerText = "Score: " + score;
        if (score % 5 === 0) {
            carSpeed += 1;
            carInterval -= 100;
        }
        setTimeout(increaseDifficulty, 1000);
    }

    function showGameOverMessage() {
        statusText.innerText = "💀 Game Over!";
        gameOver = true;
        gameOverSound.play();
        bgMusic.pause();
        restartButton.style.display = "block";
    }

    function showWinMessage() {
        statusText.innerText = "🎉 You Win!";
        gameOver = true;
        winSound.play();
        bgMusic.pause();
        restartButton.style.display = "block";
    }

    function restartGame() {
        gameOver = false;
        statusText.innerText = "";
        score = 0;
        carSpeed = 10;
        carInterval = 1200;
        turtleBottom = 0;
        turtle.style.bottom = "0px";
        scoreText.innerText = "Score: " + score;
        document.querySelectorAll(".cars").forEach(car => car.remove());
        bgMusic.play();
        restartButton.style.display = "none";
        createCars();
        increaseDifficulty();
    }

    createCars();
    increaseDifficulty();
});
