
document.getElementById("analyzeButton").addEventListener("click", analyze);

// Clears output
function clearOutput() {
    document.getElementById("output").innerHTML = "";
}

// Shows or hides loading animation
function updateLoadingAnimation(displaying) {
    if (displaying) {
        document.getElementById("circularG").style.display = "block";
    }
    else {
        document.getElementById("circularG").style.display = "none";
    }
}

function analyze() {
    clearOutput();

    // Show loading animation
    updateLoadingAnimation(true);

    var imageURL = document.getElementById("input").value;
    var uriBase = "https://westcentralus.api.cognitive.microsoft.com/face/v1.0/detect";
    var params = {
        "returnFaceId": "true",
        "returnFaceLandmarks": "false",
        "returnFaceAttributes": "age,gender"
    };
    
    serialize = function(obj) {
        var str = [];
        for(var p in obj)
          if (obj.hasOwnProperty(p)) {
            str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
          }
        return str.join("&");
    }

    serializedParams = serialize(params);

    var header = new Headers({
        "Content-Type": "application/json",
        "Ocp-Apim-Subscription-Key": key
    });

    var body = {
        "url": imageURL
    };

    var init = {
        method: "POST",
        body: JSON.stringify(body),
        headers: header
    };

    var request = new Request(uriBase + "?" + serializedParams, init)

    function updateDOM(info) {
        var output = document.getElementById("output");

        if (info === "error") {
            output.innerHTML = "No face detected :(";
        }
        else {
            var image = "<center><img src='" + imageURL + "'></center>";
            var title = "<h3>Attributes</h3>";
            var age = "<span class='title'>Age: </span>" + info.age + "<br/>";
            var gender = "<span class='title'>Gender: </span>" + info.gender + "<br/>";
            output.innerHTML = image + title + age + gender;
        }
    }

    fetch(request).then(function(response) {
        if (response.ok) {
            return response.json();
        }
        else {
            updateDOM();
            return Promise.reject(new Error(response.statusText));
        }
    }).then(function(response) {
        if (response.length === 0) {
            return Promise.reject("no-face");
        }
        var info = response[0].faceAttributes;
        updateLoadingAnimation(false);
        updateDOM(info);
    }).catch(function(err) {
        if (err === "no-face") {
            updateLoadingAnimation(false);
            updateDOM("error");
        }
        else {
            updateLoadingAnimation(false);
            alert(err);
            clearOutput();
        }
    })
};