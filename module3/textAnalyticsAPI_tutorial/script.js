
document.getElementById("analyzeButton").addEventListener("click", analyze);

function analyze() {
    var reqBody = {
        "documents": [
            {
            "language":"en",
            "id" : 1,
            "text": document.getElementById("input").value
            }
        ]
    };
    var myHeader = new Headers({
        "Content-Type": "application/json",
        "Ocp-Apim-Subscription-Key": key
    });
    var initObject = {
        method: "POST",
        body: JSON.stringify(reqBody),
        headers: myHeader
    }

    var request = new Request("https://westcentralus.api.cognitive.microsoft.com/text/analytics/v2.0/keyPhrases", initObject);

    fetch(request).then(function(response) {
        if (response.ok) {
            return response.json();
        }
        else {
            return Promise.reject(new Error(response.statusText));
        }
    }).then(function(response) {
        document.getElementById("output").innerHTML = "Total Key Phrases: " + response.documents[0].keyPhrases.length + "</br>" + response.documents[0].keyPhrases;
    }).catch(function(err) {
        alert(err);
        document.getElementById("output").innerHTML = "";
    })
};