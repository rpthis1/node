/**
 * Created by meme on 2/28/14.
 */
var http = require("http");
var redis = require("redis");
var xml2js = require('xml2js');

var client = redis.createClient("6379", "54.213.134.12");
var parser = new xml2js.Parser();

var activeAlarmsCount= "";
var activeAlarmsArray;
var req;
var oldAlarmString;
var newAlarmString;


function extractXML(err,result)
{
    activeAlarmsArray = result.Data.ActiveAlarmsList;

    if( activeAlarmsArray)
    {
        activeAlarmsCount = activeAlarmsArray[0].alarm.length;
        console.log("there are " + activeAlarmsCount + " Alarm(s)");
    }



}


function callBack(res) {

    var bodyChunks = [];
    res.on('data',function (chunk) {
        bodyChunks.push(chunk);
    }).on('end', function () {

            var body = Buffer.concat(bodyChunks);

            parser.parseString(body, extractXML);

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
        client.publish("alarmsChannel", activeAlarmsCount.toString());
        console.log("pub");
    }
    setTimeout(getAlarms, 2000);
}

var initialize = function ()
{
    setTimeout(getAlarms, 1000)
}

module.exports.init = initialize;
module.exports.activeAlarmsCount = activeAlarmsCount;


