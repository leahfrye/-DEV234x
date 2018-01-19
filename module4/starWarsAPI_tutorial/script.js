function run(genFunc){
    const genObject = genFunc();

    function iterate(iteration) {
        if (iteration.done){
            return Promise.resolve(iteration.value);
        }
        return Promise.resolve(iteration.value)
        .then(x => iterate(genObject.next(x)))
        .catch(x => iterate(genObject.throw(x)));
    }

    try {
        return iterate(genObject.next());
    }
    catch(ex) {
        return Promise.reject(ex);
    }
}

function *gen() {
    var input = document.getElementById("input").value;

    // Check if input is valid
    if (input > 7 || input < 1) {
        throw new Error("Invalid Input - Enter a number between 1 and 7.");
    }

    // Fetch the film
    var filmResponse = yield fetch("https://swapi.co/api/films/" + input + "/");
    var film = yield filmResponse.json();

    // Fetch the characters
    var characters = film.characters;
    var characterString = "Characters: <br>";
    for(let i = 0; i < characters.length ; i++) {
        var tempCharacterResponse = yield fetch(characters[i]);
        var tempCharacter = yield tempCharacterResponse.json();
        characterString += tempCharacter.name + "<br>";
    }

    // Display film title and characters
    document.getElementById("filmsText").innerHTML = "Film: <br/>" + film.title;
    document.getElementById("peopleText").innerHTML = characterString;
}

document.getElementById("button").addEventListener("click", function() {
    run(gen).catch(function(err) {
        alert(err.message);
    });
});

