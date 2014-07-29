/**
 * Created by meme on 2/28/14.
 */
var http = require("http");
var couch = require("couchbase");
var xml2js = require('xml2js');
var path = require("path");
var messageBus = require(path.join(__dirname, "..", "messageBus"));

var db = new couch.Connection({"host": "ec2-54-213-134-12.us-west-2.compute.amazonaws.com", "bucket": "points2", "password": "101010" }, function (err, couch) {

    console.log("couch connection.....");
    if (err) {
        console.log("couch connection Error.....");
        throw(err);
    }
});

var parser = new xml2js.Parser();

var activeAlarmsCount = "0";
var activeAlarmsArray;
var req;
var oldAlarmString = "old";
var newAlarmString = "new";
var alarmsStore = {activeAlarms: ""};
var currentAlarmsState = {count: 0, alarms: ""};

function extractXML(err, result) {
    activeAlarmsArray = result.Data.ActiveAlarmsList;

    if (activeAlarmsArray) {  // TODO: need to check if this works when alarms = 0
        currentAlarmsState.count = activeAlarmsArray[0].alarm.length;
        module.exports.currentAlarmsState = currentAlarmsState;
    }
}


function callBack(res) {

    var bodyChunks = [];
    res.on('data',function (chunk) {
        bodyChunks.push(chunk);
    }).on('end', function () {
            var body = Buffer.concat(bodyChunks);
          //  currentAlarmsState.alarms = body;
            parser.parseString(body, extractXML);
            db.get('alarms', function (err, resp) {
                if (resp.value) {
                    oldAlarmString = resp.value.activeAlarms;
                    newAlarmString = body.toString();
                }
                publishChanges();
            });

        })
};

function getAlarms() {
    req = http.get("http://54.213.134.12/rest/api/alarm", callBack);
    req.on("error", function (error) {
        console.log("Error" + error)
    });
}

function publishChanges() {
    if (oldAlarmString !== newAlarmString) {
        alarmsStore.activeAlarms = newAlarmString;
        db.set('alarms', alarmsStore, function (err, resp) {

            setTimeout(getAlarms, 2000);

        });
        messageBus.send("MESSAGE_BUS_newAlarms", currentAlarmsState);
    }
    else {
        setTimeout(getAlarms, 2000);
    }
}

var init = function () {
    setTimeout(getAlarms, 1000)
}

module.exports.init = init;



