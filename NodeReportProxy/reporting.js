var express = require('express');
var app = express();
var http = require('http');
var cors = require("cors");
var parseString = require('xml2js').parseString;
var soap = require('soap');
var url = 'http://192.168.121.117/IBISIntelligence/Services/Intelligence/IBISIntelligence.asmx?wsdl';
var args = {data: "<parameters><parameter id='granularity' value='month'/><parameter id='normalization' value='Temperature'/><parameter id='hourFilter' value='None'/><parameter id='parentEntities' value='1'/><parameter id='BaselineStartDate' value='7/10/2012'/><parameter id='BaselineEndDate' value='7/15/2012'/><parameter id='ReportingStartDate' value='9/1/2012'/><parameter id='ReportingEndDate' value='12/1/2012'/><parameter id='startDate' value='1/1/2012'/><parameter id='endDate' value='12/31/2012'/></parameters>", provider: "Ipmvp Normalized Delta OAT Report"};

var paramUtil = require("./custom_modules/paramsUtil");

var bodyParser = require('body-parser')

app.use(cors());
//app.use(bodyParser());

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({
    extended: true
}));

app.get('/', cors(), function (request, response) {

});

app.options('/', cors(), function (request, response) {

});


app.post('/api/selections', cors(), function (request, response) {

    var selections = [];

    var s1 = {
        BaselineStartDate: "7/10/2012",
        BaselineEndDate: "7/15/2012",
        ReportingStartDate: "9/1/2012",
        ReportingEndDate: "12/1/2012",
        leftLabel: "Baseline",
        rightLabel: "Reporting",
        label: "New Chiller ECM (7/15/12 - 9/1/12)",
        reportProvider: "Ipmvp Normalized Delta OAT Report",
        parentEntities: "1",
        default: false,
        granularity: "month",
        normalization: "Temperature",
        hourFilter: "None",
        startDate: "1/1/2012",
        endDate: "12/31/2012"
    };

    selections.push(s1);


    var s2 = {
        BaselineStartDate: "7/10/2012",
        BaselineEndDate: "8/15/2012",
        ReportingStartDate: "10/1/2012",
        ReportingEndDate: "12/1/2012",
        leftLabel: "Baseline",
        rightLabel: "Reporting",
        label: "New Boiler ECM (8/15/12 - 10/1/12)",
        reportProvider: "Ipmvp Normalized Delta OAT Report",
        parentEntities: "1",
        default: false,
        granularity: "month",
        normalization: "Temperature",
        hourFilter: "None",
        startDate: "1/1/2012",
        endDate: "12/31/2012"
    };

    selections.push(s2);


    var s3 = {
        BaselineStartDate: "6/10/2012",
        BaselineEndDate: "9/15/2012",
        ReportingStartDate: "11/1/2012",
        ReportingEndDate: "12/31/2012",
        leftLabel: "Baseline",
        rightLabel: "Reporting",
        label: "New Lighting System ECM (9/15/12 - 11/1/12)",
        reportProvider: "Ipmvp Normalized Delta OAT Report",
        parentEntities: "1",
        default: true,
        granularity: "month",
        normalization: "Temperature",
        hourFilter: "None",
        startDate: "1/1/2012",
        endDate: "12/31/2012"
    };

    selections.push(s3);


    response.send(selections);

})


app.post('/', cors(), function (request, response) {
    soap.createClient(url, function (err, client) {
        args.data =  paramUtil.parse(request.body);
        args.provider = request.body.reportProvider;

        client.LoadBaseEntityReportUncompressed(args, function (err, result) {
            console.log(result);

            var xml = result.LoadBaseEntityReportUncompressedResult.toString();
            parseString(xml, function (err, result) {
                console.dir(result);

                var arr = [];
                var baselineData = [];
                var reportingData = [];
                var seriesArray = [];
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


                var baselineSeries = {"name": "Baseline",
                    type: "column"
                }


                var reportingSeries = {"name": "Reporting",
                    type: "column"
                }


                for (var index in trendArr) {
                    trendObj = trendArr[index];

                    parentArr = trendObj.parent;
                    parentObj = parentArr[0];
                    parentArr = parentObj.item;
                    parentObj = parentArr[0];
                    parentArr = parentObj.item;

                    baselineObj = parentArr[0];
                    reportingObj = parentArr[1];

                    newBaselineObj = {};
                    newBaselineObj.name = baselineObj.$.name;
                    newBaselineObj.y = Number(baselineObj.$.value);
                    newBaselineObj.color = 'rgba(255, 255, 255, 0.5)';

                    baselineData.push(newBaselineObj);
                    baselineSeries.data = baselineData;


                    newReportingObj = {};
                    newReportingObj.name = reportingObj.$.name;
                    newReportingObj.y = Number(reportingObj.$.value);
                    newReportingObj.color = 'rgba(252,144,5,0.5)';
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