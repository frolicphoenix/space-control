let score = 0;
let powerLevel = 100;
let fuelLevel = 100;
let oxygenLevel = 100;
let shieldStrength = 100;
let gameInterval;
let tasks = [];
let currentTaskIndex = 0;

function generateTasks() {
    const controls = ["tempControl", "speedControl", "shieldControl"];
    const descriptions = [
        "Adjust temperature to",
        "Increase speed to",
        "Maintain shield strength at"
    ];
    const baseValues = [50, 70, 80]; // Base target values

    tasks = []; // Clear existing tasks before generating new ones
    for (let i = 0; i < 50; i++) {
        const controlIndex = Math.floor(Math.random() * controls.length);
        let variation = (Math.floor(Math.random() * 5) - 2) * 10; // -20, -10, 0, 10, 20
        let target = Math.max(0, Math.min(100, baseValues[controlIndex] + variation)); // Ensure target is within 0-100
        tasks.push({
            description: `${descriptions[controlIndex]} ${target}`,
            control: controls[controlIndex],
            target: target
        });
    }
}

function startGame() {
    document.getElementById('startButton').disabled = true;
    document.getElementById('restartButton').disabled = false;
    document.getElementById('spaceView').src = "images/WarpTrails001.gif"; // Change image to simulate engine start
    resetGame();
    generateTasks();
    enableControls(true);
    gameInterval = setInterval(simulateSpaceConditions, 1000);
    assignNewTask();
}

function simulateSpaceConditions() {
    powerLevel -= 1;
    fuelLevel -= 0.5;
    oxygenLevel -= 0.2;
    updateStatusDisplays();
    if (powerLevel <= 0 || fuelLevel <= 0 || oxygenLevel <= 0) {
        endGame("Critical systems failure! Mission failed.");
    }
}

function checkTaskCompletion() {
    let task = tasks[currentTaskIndex];
    let controlValue = parseInt(document.getElementById(task.control).value);
    if (controlValue === task.target) {
        score += 10;
        currentTaskIndex++;
        if (currentTaskIndex < tasks.length) {
            assignNewTask();
        } else {
            endGame("Mission successful! All tasks completed. Restart to continue improving your score.");
        }
    }
    updateStatusDisplays();
}

function assignNewTask() {
    if (currentTaskIndex < tasks.length) {
        let task = tasks[currentTaskIndex];
        document.getElementById('tasks').textContent = task.description;
    } else {
        document.getElementById('tasks').textContent = "All tasks completed!";
    }
}

function endGame(message) {
    clearInterval(gameInterval);
    enableControls(false);
    document.getElementById('startButton').disabled = false;
    document.getElementById('restartButton').disabled = true;
    document.getElementById('spaceView').src = "images/stars.gif"; // Reset to original image
    alert(message);
}

function restartGame() {
    clearInterval(gameInterval);
    resetGame();
    startGame();
}

function resetGame() {
    score = 0;
    powerLevel = 100;
    fuelLevel = 100;
    oxygenLevel = 100;
    shieldStrength = 100;
    currentTaskIndex = 0;
    updateStatusDisplays();
    generateTasks(); // Regenerate tasks on each restart
    assignNewTask();
}

function enableControls(enabled) {
    ['tempControl', 'speedControl', 'shieldControl'].forEach(control => {
        document.getElementById(control).disabled = !enabled;
    });
}

function updateStatusDisplays() {
    document.getElementById('powerLevel').textContent = `${powerLevel}%`;
    document.getElementById('fuelLevel').textContent = `${fuelLevel}%`;
    document.getElementById('oxygenLevel').textContent = `${oxygenLevel}%`;
    document.getElementById('score').textContent = `Score: ${score}`;
}

// Ensure the HTML DOM is fully loaded before setting up listeners
document.addEventListener("DOMContentLoaded", function() {
    ['tempControl', 'speedControl', 'shieldControl'].forEach(id => {
        document.getElementById(id).addEventListener("input", () => {
            if (!document.getElementById(id).disabled) {
                checkTaskCompletion();
            }
        });
    });
});
