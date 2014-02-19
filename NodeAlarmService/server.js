var http = require("http");
var redis = require("redis");

var client = redis.createClient("6379", "localhost");
var client2 = redis.createClient("6379", "localhost");
var options = {host: "http://localhost", path: "/rest/api/values" }
var req;

init();
setInterval(getAlarms, 2000)


function callBack (res) {

    var bodyChunks = [];
    res.on('data',function (chunk) {
        bodyChunks.push(chunk);
    }).on('end', function () {
            var body = Buffer.concat(bodyChunks);
            console.log('BODY: ' + body);

            client.set("test", body.toString())
        })
};


function init()
{

}
function getAlarms() {
    req = http.get("http://localhost/rest/api/alarm", callBack);
    req.on("error", function (error) {
        console.log("Error" + error)
    });
}



