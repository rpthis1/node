/**
 * Created by me on 1/16/14.
 */

var xlsx = require('node-xlsx');
var obj = xlsx.parse('C:/Users/me/WebstormProjects/NodeExcelParser/schedules.xlsx');


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
for ( var i = 1; i< wsData.length;i++)
{
    index++;
    row = wsData[i];
    schID = row[0].value;
    schName = row[1].value;

    if( row[6] === undefined )
    {
        description = "";
    }
    else
    {
        description = row[6].value;
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

    xml = "<data><rp></rp><description>" + description  + "</description><group>" + group + "</group></data>";

    var b = new Buffer(xml);
    encoded = b.toString('base64');

    console.log("UPDATE dbo.Mnt_MaintenanceSchedule");
    console.log("SET Description = " + "'" + encoded +  "'");
    console.log("WHERE ScheduleId =" + schID);
    console.log("");





}



