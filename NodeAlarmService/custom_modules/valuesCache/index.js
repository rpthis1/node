var config = require("./config.json");
var xml2js = require('xml2js');
var parser = new xml2js.Parser();
var path = require("path");
var http = require("http");
var messageBus = require(path.join(__dirname, "..", "messageBus"));


var currentDataState = {values: []};
function getValues()
{
    req = http.get("http://54.213.134.12/rest/api/data/"+config.points , callBack);

    req.on("error", function (error)
    {
        console.log("Error" + error)
    });
}


function callBack(res) {

    var bodyChunks = [];
    res.on('data',function (chunk) {
        bodyChunks.push(chunk);
    }).on('end', function () {

           // console.log("got values from data API");

            var body = Buffer.concat(bodyChunks);

          //  console.log("BODY"+ body);
          parser.parseString(body, extractXML);

        })
};


function extractXML(err,result)
{
    var point;
    var points = result.IBIS.ObjectCache[0];
    points = points.DataPointValues //array
    currentDataState.values = points;
    module.exports.currentDataState = currentDataState;

    messageBus.send("MESSAGE_BUS_newData", currentDataState);

    setTimeout(getValues, 5000)

    //TOD0: need to check for data changes//

//    for (var i in points)
//    {
//        point =  points[i];
//        console.log(point.data);
//    }
}

var init = function () {
    setTimeout(getValues, 5000)
}


module.exports.init = init;