// Button Selectors
const startButton  = document.querySelector('#start-button');
const pauseButton  = document.querySelector('#pause-button');
const resumeButton = document.querySelector('#resume-button');
const stopButton   = document.querySelector('#stop-button');

// Time Selectors
const displayMinutes = document.querySelector('#show-minute');
const displaySeconds = document.querySelector('#show-second');

// Variables
const storeMinutes = localStorage.getItem("minutes");
const storeSeconds = localStorage.getItem("seconds");

if (storeMinutes !== null && storeSeconds !== null) {
    runningMinutes = storeMinutes;
    runningSeconds = storeSeconds;
}

let intervalId, startTime = 0, changeTime = 0;
let currentState = localStorage.getItem("state") || "idle";

function changeState(newState) {
    if (currentState === "idle" && newState === "started") {
        currentState = "started";
    }
    else if (currentState === "started") {
        if (newState === "paused") currentState = "paused";
        else if (newState === "stopped") currentState = "stopped";
    }
    else if (currentState === "paused") {
        if (newState === "resumed") currentState = "resumed";
        else if (newState === "stopped") currentState = "stopped";
    }
    else if (currentState === "resumed") {
        if (newState === "paused") currentState = "paused";
        else if (newState === "stopped") currentState = "stopped";
    }
    
    localStorage.setItem("state", currentState);
}

//# Start Button Handler
startButton.addEventListener('click', () => {
    changeState('started');
    
    startButton.classList.add('hidden');
    pauseButton.classList.remove('hidden');
    stopButton.classList.remove('hidden');
    
    startTime = Date.now() - changeTime;
    
    intervalId = setInterval(() => {
        changeTime = Date.now() - startTime;
        const totalSeconds = Math.floor(changeTime / 1000);
        const minutes = Math.floor(totalSeconds / 60);
        const seconds = totalSeconds % 60;

        displayMinutes.innerHTML = minutes < 10 ? '0' + minutes : minutes;
        displaySeconds.innerHTML = seconds < 10 ? '0' + seconds : seconds;
    }, 1000);
});

//# Pause Button Handler
pauseButton.addEventListener('click', () => {
    changeState("paused");
    clearInterval(intervalId);

    pauseButton.classList.add('hidden');
    resumeButton.classList.remove('hidden');

    localStorage.setItem("minutes", runningMinutes.toString());
    localStorage.setItem("seconds", runningSeconds.toString());
});

//# Resume Button Handler
resumeButton.addEventListener('click', () => {
    changeState("resumed");
    resumeButton.classList.add('hidden');
    pauseButton.classList.remove('hidden');

    startTime = Date.now() - changeTime;

    intervalId = setInterval(() => {
        changeTime = Date.now() - startTime;
        const totalSeconds = Math.floor(changeTime / 1000);
        const minutes = Math.floor(totalSeconds / 60);
        const seconds = totalSeconds % 60;

        displayMinutes.innerHTML = minutes < 10 ? '0' + minutes : minutes;
        displaySeconds.innerHTML = seconds < 10 ? '0' + seconds : seconds;
    }, 1000);
});

//# Stop Button Handler
stopButton.addEventListener('click', () => {
    localStorage.clear();
    clearInterval(intervalId);
    changeTime = 0;

    displaySeconds.innerText = '00';
    displayMinutes.innerHTML = '00';

    startButton.classList.remove('hidden');
    pauseButton.classList.add('hidden');
    resumeButton.classList.add('hidden');
    stopButton.classList.add('hidden');
});

// It clears the local storage if the page is reloaded (this is needed because if we reload the page while being in "paused" or "resumed" state, there is no way we can go back to the "started" state)
window.onbeforeunload = function() {
    localStorage.clear();
};