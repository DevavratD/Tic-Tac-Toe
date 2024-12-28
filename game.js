const winPatterns = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
];

// Cache DOM elements
const clickToStart = document.querySelector('#start-game');
const boxes = document.querySelectorAll(".game-btn");
const resetbtn = document.querySelector('#reset');
const newGameBtn = document.querySelector('#new-game');
const popupOverlay = document.querySelector('.overlay');
const popupMessage = document.querySelector('.popup p');
const boxSound = document.querySelector('#box-click');
const resetSound = document.querySelector('#reset-audio');
const newGameSound = document.querySelector('#newgame-audio');
const bgMusic = document.querySelector('#bg-audio');
const gameContainer = document.querySelector('.game-container');



if(!localStorage.getItem('gameStarted')){
    
    document.addEventListener('click',()=>{
        clickToStart.style.display='none';
        gameContainer.style.display='grid'
        resetbtn.style.display = 'block';
        playSound(bgMusic);

        localStorage.setItem('gameStarted' , 'true')
    })


};





// Set audio properties
bgMusic.volume = 0.03;
boxSound.volume = 0.7;
bgMusic.loop = true;






let playerX = true; // true = X ; false = O
let gameOver = false;

// Play sound function
function playSound(sound) {
    sound.currentTime = 0;
    sound.play();
}

// Initialize game
function initGame() {
    boxes.forEach((box) => {
        box.innerHTML = ""; // Clear text
        box.disabled = false; // Enable box
        box.classList.remove("game-btn-x", "game-btn-o"); // Clear classes
    });
    playerX = true; // Reset to Player X
    gameOver = false;
    popupOverlay.style.display = 'none'; // Hide popup
}

// Handle box click
boxes.forEach((box) => {
    box.addEventListener('click', () => {
        if (gameOver || box.innerHTML) return; // Ignore if already filled or game over

        playSound(boxSound);
        box.innerHTML = playerX ? 'X' : 'O'; // Set X or O
        box.classList.add(playerX ? "game-btn-x" : "game-btn-o"); // Add corresponding class
        playerX = !playerX; // Switch player

        box.disabled = true; // Disable box
        checkWinner(); // Check for winner
    });
});

// Check for winner or draw
function checkWinner() {
    for (let pattern of winPatterns) {
        const [a, b, c] = pattern;
        const pos1 = boxes[a].innerText;
        const pos2 = boxes[b].innerText;
        const pos3 = boxes[c].innerText;

        if (pos1 && pos1 === pos2 && pos2 === pos3) {
            gameOver = true;
            disableBoxes();
            showPopup(`${pos1} Wins`);
            return;
        }
    }

    // Check for draw
    if (Array.from(boxes).every(box => box.innerText !== "")) {
        gameOver = true;
        disableBoxes();
        showPopup("Draw");
    }
}

// Disable all boxes
function disableBoxes() {
    boxes.forEach(box => (box.disabled = true));
}

// Show popup message
function showPopup(message) {
    popupMessage.innerText = message;
    popupOverlay.style.display = 'flex';
}

// Reset button
resetbtn.addEventListener('click', () => {
    playSound(resetSound);
    initGame();
});

// New game button
newGameBtn.addEventListener('click', () => {
    playSound(newGameSound);
    initGame();
});

// Start fresh
initGame();
