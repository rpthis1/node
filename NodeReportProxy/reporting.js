var express = require('express');
var app = express();
var http = require('http');
var cors = require("cors");
var parseString = require('xml2js').parseString;
var soap = require('soap');
var url = 'http://localhost:1290/Services/Intelligence/IBISIntelligence.asmx?wsdl';
var args = {data: "<parameters><parameter id='granularity' value='month'/><parameter id='normalization' value='Temperature'/><parameter id='hourFilter' value='None'/><parameter id='parentEntities' value='1'/><parameter id='BaselineStartDate' value='7/10/2012'/><parameter id='BaselineEndDate' value='7/15/2012'/><parameter id='ReportingStartDate' value='9/1/2012'/><parameter id='ReportingEndDate' value='12/1/2012'/><parameter id='startDate' value='1/1/2012'/><parameter id='endDate' value='12/31/2012'/></parameters>", provider: "Ipmvp Normalized Delta OAT Report"};

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

    console.log("called  poinst");

    soap.createClient(url, function(err, client) {
        client.LoadBaseEntityReportUncompressed(args, function(err, result) {
            console.log(result);

            var xml = result.LoadBaseEntityReportUncompressedResult.toString();
            parseString(xml, function (err, result) {
                console.dir(result);

                var arr = [];
                var baselineData = [];
                var reportingData = [];
                var seriesArray =[];
                var datumArr = result.datums.datum;
                var dataObj = datumArr[0];
                var trendArr = dataObj.trend;
                var newObj;
                var trendObj;
                var parentArr;
                var parentObj;
                var baselineObj;
                var reportingObj;
                var newBaselineObj;
                var newReportingObj;




//
//                {
//                    name: 'Point 5',
//                        color: '#CCCCCC',
//                    y: 313706
//
//                }




                var baselineSeries =   {"name": "Baseline",
                    type: "column"
                }


                var reportingSeries =   {"name": "Reporting",
                    type: "column"
                }



                for ( var index in trendArr)
                {
                    trendObj = trendArr[index];

                    parentArr = trendObj.parent;
                    parentObj = parentArr[0];
                    parentArr = parentObj.item;
                    parentObj = parentArr[0];
                    parentArr = parentObj.item;

                    baselineObj = parentArr[0];
                    reportingObj = parentArr[1];

                    newBaselineObj = {};
                    newBaselineObj.name = baselineObj.name;
                    newBaselineObj.y = baselineObj.value;
                    newBaselineObj.color = "#CCCCCC";

                    baselineData.push(newBaselineObj);
                    baselineSeries.data = baselineData;


                    newReportingObj = {};
                    newReportingObj.name = reportingObj.name;
                    newReportingObj.y = reportingObj.value;
                    newReportingObj.color = "#FC9005";
                    reportingData.push(newReportingObj);
                    reportingSeries.data = reportingData;



                }

                seriesArray.push(baselineSeries);
                seriesArray.push(reportingSeries);

                response.send(seriesArray);
            });


        });
    });



});







app.listen(3000);





