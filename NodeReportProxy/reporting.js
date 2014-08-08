var express = require('express');
var app = express();
var http = require('http');
var cors = require("cors");
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
            response.send(result);
        });
    });



});







app.listen(3000);





