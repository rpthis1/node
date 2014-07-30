var express = require('express');
var app = express();
var http = require('http');
var cors = require("cors");

var bodyParser = require('body-parser')

app.use(cors());
//app.use(bodyParser());

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({
    extended: true
}));

app.get('/', cors(),function(request, response) {
    response.send("Calling GET");
});

app.options('/', cors(), function(request, response) {

});
app.post('/', cors(), function(request, response) {

    var options = {
        host: 'localhost',
        port: 80,
        path: "/box/",
        method: "POST",
        headers: {"Authorization":"Basic YWRtaW46I0NBUk9NQTEw"}
    };

    var req=http.request(options, function(res) {
        var body = "";
        res.on('data', function (chunk) {
            body += chunk;
        });
        res.on('end', function () {
            response.send(body);
        });
    });
     req.write(JSON.stringify(request.body));
     req.end();
});







app.listen(3000);





