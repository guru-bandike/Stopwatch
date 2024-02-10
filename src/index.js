// Selecting DOM elements for the stopwatch
const body = document.querySelector("body");
const container = document.querySelector("#container");
const stopwatch = document.querySelector("#bar-elements");
const startButton = document.querySelector("#start-button");
const stopButton = document.querySelector("#stop-button");
const resetButton = document.querySelector("#reset-button");
const minutesAndSecondsElement = document.querySelector("#minutesAndSeconds");
const millisecondsElement = document.querySelector("#milliseconds");
const themeToggleButton = document.querySelector("#theme-toggle");
const tickingSound = new Audio("src/audios/ticking-sound.mp3");

// Initializing stopwatch time variables
let minutes = 0;
let seconds = 0;
let milliseconds = 0;
let timeIntervalId;

// Creating visual bars for each second
const barElements = [];
for (let currbarNum = 1; currbarNum <= 60; currbarNum++) {
  barElements.push(
    `<span id="barId${currbarNum}" style="--index:${currbarNum};"><p></p></span>`
  );
}

// Inserting bars into the DOM
stopwatch.insertAdjacentHTML("afterbegin", barElements.join(""));

// Event listeners for the stopwatch buttons
startButton.addEventListener("click", startInterval);
stopButton.addEventListener("click", stopInterval);
resetButton.addEventListener("click", resetInterval);
themeToggleButton.addEventListener("click", toggleTheme);

// Function to start the stopwatch
function startInterval() {
  clearInterval(timeIntervalId); // Clear any existing interval to avoid duplicates
  timeIntervalId = setInterval(() => {
    milliseconds += 1;

    if (milliseconds === 100) {
      milliseconds = 0;
      seconds += 1;
      seconds === 60 ? {} : highlightCurrentBar(seconds); // Highlight the current second bar exept 60th second bar
      if (seconds === 60) {
        seconds = 0;
        minutes += 1;
        resetBars(); // Reset the virtual representation
      }
    }

    // Updating the DOM with the new time
    minutesAndSecondsElement.textContent =
      formatTime(minutes) + ":" + formatTime(seconds);
    millisecondsElement.textContent = "." + formatTime(milliseconds);
  }, 10);
}

// Function to stop the stopwatch
function stopInterval() {
  clearInterval(timeIntervalId);
}

// Function to reset the stopwatch
function resetInterval() {
  clearInterval(timeIntervalId);
  resetBars(10);
  minutes = 0;
  seconds = 0;
  milliseconds = 0;
  minutesAndSecondsElement.textContent = "00:00";
  millisecondsElement.textContent = ".00";
}

// Helper function to format time values as two digits
function formatTime(time) {
  return time < 10 ? "0" + time : time;
}

// Resets all bars exept 60th second bar to maintain the visual design
function resetBars(deleyTime) {
  for (let barNumber = 59; barNumber >= 1; barNumber--) {
    const currentBarId = `barId${barNumber}`;
    setTimeout(() => {
      // Choose dark grey highlight color to every 5th bar to maintain the visual design
      const currBarHighlightColor =
        barNumber % 5 === 0
          ? "var(--bar-secondary-color)"
          : "var(--bar-primary-color)";
      document.querySelector(`#${currentBarId} p`).style.backgroundColor =
        currBarHighlightColor;
    }, deleyTime * (59 - barNumber)); // Delay ensures a gradual reset effect
  }
}

// Highlights the bar corresponding to the current second
function highlightCurrentBar(currentSecond) {
  const currentBarId = `barId${currentSecond}`;
  // Chooses blue highlight color to every 5th bar to maintain the visual design
  const currBarHighlightColor =
    currentSecond % 5 === 0 ? "var(--primary-color)" : "var(--secondary-color)";
  document.querySelector(`#${currentBarId} p`).style.backgroundColor =
    currBarHighlightColor;
  tickingSound.volume = 0.5;
  tickingSound.play(); // plays ticking sound when bar gets highlighted
}

// Switches themes and updates the icon accordingly
function toggleTheme() {
  const isDarkMode = body.classList.contains("dark");
  body.classList.toggle("dark");

  if (isDarkMode) {
    themeToggleButton.innerHTML = `<svg id="moon" xmlns="http://www.w3.org/2000/svg" width="25" height="25" fill="#6e6e6e" viewBox="0 0 16 16">
      <path d="M6 .278a.768.768 0 0 1 .08.858 7.208 7.208 0 0 0-.878 3.46c0 4.021 3.278 7.277 7.318 7.277.527 0 1.04-.055 1.533-.16a.787.787 0 0 1 .81.316.733.733 0 0 1-.031.893A8.349 8.349 0 0 1 8.344 16C3.734 16 0 12.286 0 7.71 0 4.266 2.114 1.312 5.124.06A.752.752 0 0 1 6 .278z"/>
      </svg>`;
  } else {
    themeToggleButton.innerHTML = `<svg id="sun" xmlns="http://www.w3.org/2000/svg" width="30" height="30" fill="#bcbcbc" viewBox="0 0 16 16">
      <path d="M8 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM8 0a.5.5 0 0 1 .5.5v2a.5.5 0 0 1-1 0v-2A.5.5 0 0 1 8 0zm0 13a.5.5 0 0 1 .5.5v2a.5.5 0 0 1-1 0v-2A.5.5 0 0 1 8 13zm8-5a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1 0-1h2a.5.5 0 0 1 .5.5zM3 8a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1 0-1h2A.5.5 0 0 1 3 8zm10.657-5.657a.5.5 0 0 1 0 .707l-1.414 1.415a.5.5 0 1 1-.707-.708l1.414-1.414a.5.5 0 0 1 .707 0zm-9.193 9.193a.5.5 0 0 1 0 .707L3.05 13.657a.5.5 0 0 1-.707-.707l1.414-1.414a.5.5 0 0 1 .707 0zm9.193 2.121a.5.5 0 0 1-.707 0l-1.414-1.414a.5.5 0 0 1 .707-.707l1.414 1.414a.5.5 0 0 1 0 .707zM4.464 4.465a.5.5 0 0 1-.707 0L2.343 3.05a.5.5 0 1 1 .707-.707l1.414 1.414a.5.5 0 0 1 0 .708z" />
      </svg>`;
  }
}

// Adds entry animation to the stopwatch container on document load
document.addEventListener("DOMContentLoaded", () => {
  container.classList.add("animate-entry");
});
