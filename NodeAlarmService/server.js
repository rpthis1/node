var http = require("http");

var options = {host: "http://localhost", path: "/rest/api/values" }

http.get("http://localhost/rest/api/values",function (res) {
    console.log(res.responseText)
}).on("error", function (error) {
        console.log("Error" + error)
    });


