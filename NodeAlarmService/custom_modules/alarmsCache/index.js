/**
 * Created by meme on 2/28/14.
 */
var http = require("http");
var couch = require("couchbase");
var xml2js = require('xml2js');
var path = require("path");
var messageBus = require(path.join(__dirname, "..", "messageBus"));

var db = new couch.Connection({"host":"ec2-54-213-134-12.us-west-2.compute.amazonaws.com" , "bucket":"points2", "password":"101010" }, function (err,couch){

    console.log("couch connection.....");
    if( err)
    {
        console.log("couch connection Error.....");
        throw(err);
    }
});

var parser = new xml2js.Parser();

var activeAlarmsCount= "0";
var activeAlarmsArray;
var req;
var oldAlarmString ="old";
var newAlarmString = "new";
var alarmsStore = {activeAlarms:""};


function extractXML(err,result)
{
    activeAlarmsArray = result.Data.ActiveAlarmsList;

    if( activeAlarmsArray)
    {
        activeAlarmsCount = activeAlarmsArray[0].alarm.length;
        module.exports.activeAlarmsCount = activeAlarmsCount;

    }

}


function callBack(res) {

    var bodyChunks = [];
    res.on('data',function (chunk) {
        bodyChunks.push(chunk);
    }).on('end', function () {

          //  console.log("got alarms from API");

            var body = Buffer.concat(bodyChunks);

            parser.parseString(body, extractXML);

            db.get('alarms', function (err, resp) {

                if( resp.value)
                {

                oldAlarmString = resp.value.activeAlarms;
                newAlarmString = body.toString();
                 //console.log("read it couch.. :" + resp.value.activeAlarms);

                }
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
        alarmsStore.activeAlarms = newAlarmString;
        db.set('alarms', alarmsStore, function(err,resp){

          //  console.log("dp update..");

        });
        messageBus.send("newAlarms", {count:activeAlarmsCount.toString() });
    }
    setTimeout(getAlarms, 2000);
}

var initialize = function ()
{
    setTimeout(getAlarms, 1000)
}

module.exports.init = initialize;



