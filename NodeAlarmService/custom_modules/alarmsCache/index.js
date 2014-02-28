/**
 * Created by meme on 2/28/14.
 */
var http = require("http");
var redis = require("redis");
var client = redis.createClient("6379", "54.213.134.12");

var req;
var oldAlarmString;
var newAlarmString;


function callBack(res) {

    var bodyChunks = [];
    res.on('data',function (chunk) {
        bodyChunks.push(chunk);
    }).on('end', function () {

            var body = Buffer.concat(bodyChunks);
            client.get('alarms', function (err, resp) {
                oldAlarmString = resp;
                newAlarmString = body.toString();
                console.log("read it..");
                publishChanges();

            });

        })
};

function getAlarms()
{
    req = http.get("http://54.213.134.12/rest/api/alarm", callBack);
    req.on("error", function (error)
    {
        console.log("Error" + error)
    });
}

function publishChanges()
{
    if (oldAlarmString !== newAlarmString)
    {
        client.set('alarms', newAlarmString);
        client.publish("alarmsChannel", "change");
        console.log("pub");
    }
    setTimeout(getAlarms, 2000);
}

var initialize = function ()
{
    setTimeout(getAlarms, 2000)
}

module.exports = initialize;


