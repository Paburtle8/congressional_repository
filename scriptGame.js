const enterBTN = document.getElementById("enterBTN");
const target = document.getElementById("target"); 
const timer = document.getElementById("timer");
const testButton = document.getElementById("testButton");
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

if (testButton) {
    testButton.addEventListener("click", gameStart);
}

function gameStart() {
    game();
    clock();
}

function game() {
    timer.style.display = "block";
 

    
    target.onload = () => {
        teleport(); 
        setInterval(teleport, 300); 
    };

    
    if (target.complete) {
        teleport();
        setInterval(teleport, 300);
    }
}

const targetSize = 200;

function teleport() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    let x = Math.random() * (canvas.width - targetSize);
    let y = Math.random() * (canvas.height - targetSize);

    ctx.drawImage(target, x, y, targetSize, targetSize);
}

let i = 30;
let countdown;

function clock() {
    countdown = setInterval(function () {
        i--;
        timer.innerHTML = "Time left: " + i;

        if (i < 1) {
            clearInterval(countdown);
            timer.innerHTML = "Time's up!";
        }
    }, 1000);
}
