
// Turns animation on or off, also hides/shows output
function animation(start) {
    if (start) {
        document.getElementById("loader").style.display = "block";
        document.getElementById("output").style.display = "none";
    }
    else {
        document.getElementById("loader").style.display = "none";
        document.getElementById("output").style.display = "block";
    }
}

// Iterates through generator
function run(generator) {
    var genObject = generator();
    function iterate(iteration) {
        if (iteration.done){
            animation(false);
            return Promise.resolve(iteration.value);
        }
        return Promise.resolve(iteration.value)
        .then(x => iterate(genObject.next(x)))
        .catch(x => iterate(genObject.throw(x)));
    }
    try {
        return iterate(genObject.next());
    }
    catch (error) {
        return Promise.reject(error);
    }
}

// Displays data in DOM
function display(ship, el) {
    console.log(ship);
    document.getElementById("name" + el).innerHTML = ship.name;
    document.getElementById("cost" + el).innerHTML = ship.cost_in_credits;
    document.getElementById("speed" + el).innerHTML = ship.max_atmosphering_speed;
    document.getElementById("size" + el).innerHTML = ship.cargo_capacity;
    document.getElementById("pass" + el).innerHTML = ship.passengers;
}

// Generator function - makes all the API calls
function* gen() {
    var input1 = document.getElementById("input1").value;
    var input2 = document.getElementById("input2").value;

    // Fetch starship info
    var response1 = yield fetch("https://swapi.co/api/starships/" + input1 + "/");
    var response2 = yield fetch("https://swapi.co/api/starships/" + input2 + "/");

    // Get starship stats
    var ship1 = yield response1.json();
    var ship2 = yield response2.json();

    // Display in DOM
    display(ship1, "1");
    display(ship2, "2");
}

// STARTS HERE: Adds click event to button and starts the iterator (run) function
document.getElementById("compareButton").addEventListener("click", function() {
    animation(true);
    run(gen).catch(function(err) {
        alert(err.message)
    });
});

