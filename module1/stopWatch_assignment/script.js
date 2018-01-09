
// Global variables
var timing = false;
var interval;
var time = [0, 0 ,0];
var recordings = [];

// Starts interval that adds time
function addTime() {
    interval = setInterval(function() {
        if (time[2] < 9) {
            time[2] ++;        
        }
        else if (time[2] === 9) {
            time[2] = 0;
            if (time[1] < 9) {
                time[1] ++;
            }
            else if (time[1] === 9) {
                time[1] = 0;
                time[0] ++;
            }
        }
        updateDOM();
    }, 10);
}

// Updates time in the DOM
function updateDOM() {
    document.getElementById("timer").innerHTML = time[0] + "." + time[1] + "" + time[2];
}

// Stops the interval
function stop() {
    timing = false;
    clearInterval(interval);
}

// Stops interval if it's going, resets time and recordings, and updates DOM
function reset() {
    if (timing) {
        stop();
    }
    time = [0, 0 ,0];
    recordings = [];
    updateDOM();
    document.getElementById("recordings").innerHTML = "";
}

// Adds current time to list of recorded times
function record() {
    recordings.push(time[0] + "." + time[1] + "" + time[2]);
    document.getElementById("recordings").innerHTML = recordings.join("<br/>");
}

// Adds click events to startStop button
document.getElementById("startStop").addEventListener("click", function() {
    if (!timing) {
        timing = true;
        addTime();
    }
    else {
        stop();
    }
});

// Adds click event to reset button
document.getElementById("reset").addEventListener("click", function() {
    reset();
});

// Adds click event to record  button
document.getElementById("record").addEventListener("click", function() {
    record();
});

