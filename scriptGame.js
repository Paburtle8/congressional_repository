const enterBTN = document.getElementById("enterBTN");
const target = document.getElementById("target"); 
const timer = document.getElementById("timer");
const testButton = document.getElementById("testButton");
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const scoreText = document.getElementById("scoreText");

scoreText.style.display = "none";
timer.style.display = "none";
testButton.style.display = "none";

if (testButton) {
    testButton.addEventListener("click", gameStart);
}
let score = 0;
function gameStart() {
    game();
    clock();
    touch();

}

function game() {
    timer.style.display = "block";
    scoreText.style.display = "block";
    testButton.style.display = "none";

    
    target.onload = () => {
        teleport(); 
        setInterval(teleport, 600); 
    };

    
    if (target.complete) {
        teleport();
        setInterval(teleport, 600);
    }
}

const targetSize = 200;
const aspectRatio = target.naturalHeight / target.naturalWidth;

let targetX = 0;
let targetY = 0;

function teleport() {

    

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    targetX = Math.random() * (canvas.width - targetSize);
    targetY = Math.random() * (canvas.height - targetSize * aspectRatio);

    ctx.drawImage(target, targetX, targetY, targetSize, targetSize * aspectRatio);
}

canvas.addEventListener("click", function (e) {
    const rect = canvas.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const clickY = e.clientY - rect.top;

    if (
        clickX >= targetX &&
        clickX <= targetX + targetSize && 
        clickY >= targetY &&
        clickY <= targetY + targetSize
    ) {
        addScore();
    }
});

let i = 30;
let countdown;

function clock() {
    countdown = setInterval(function () {
        i--;
        timer.innerHTML = "Time left: " + i;

        if (i < 1) {
            clearInterval(countdown);
            timer.innerHTML = "Time's up!";
            canvas.style.display = "none";
            scoreText.style.display = "none";
        }
    }, 1000);
}

function addScore() {
    
    score += 1;
    scoreText.textContent = `Score: ${score}`;
}


    

