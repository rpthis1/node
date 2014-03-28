/**
 * Created by me on 1/16/14.
 */

var xml2js = require("xml2js");
var parser = xml2js.Parser();


var xlsx = require('node-xlsx');
var obj = xlsx.parse(__dirname + '/Book1.xlsx');


function parse(err, res) {

    console.log("");
    schID = res.SNMPDevice.$.ip;
}


console.log(__dirname);
var ws = obj.worksheets[0];

var wsData = ws.data;
var row;
var schID;
var description;
var index = 0;
var schName;
var encoded;
var xml;
var group = "PHX02";
var match = 0;
var nomatch = 0;
for (var i = 0; i < wsData.length; i++) {
    index++;
    row = wsData[i];

    if (row[2] != undefined && row[2] != undefined) {


    parser.parseString(row[2].value.toString(), parse);
    group = row[4].value.toString();


    if (schID === group) {
        match++;
    }
    else {
        nomatch++;
    }
}
/*    console.log(index + "");
 console.log("Name: " + schName);
 console.log("Schedule ID: " + schID);
 console.log("Description: " + description);
 console.log("\n");*/


/*
 console.log("UPDATE dbo.Mnt_MaintenanceSchedule");
 console.log("SET Description = " + "'" + description +  "'");
 console.log("WHERE ScheduleId =" + schID);
 console.log("");
 */




/*  xml = "<data><rp></rp><description>" + description  + "</description><group>" + group + "</group></data>";

 var b = new Buffer(xml);
 encoded = b.toString('base64');



 console.log("UPDATE dbo.Mnt_MaintenanceSchedule");
 console.log("SET Description = " + "'" + encoded +  "'");
 console.log("WHERE ScheduleId =" + schID);
 console.log("");*/





}

console.log(index);
console.log("Match : " + match);
console.log("NO Match :" + nomatch);



