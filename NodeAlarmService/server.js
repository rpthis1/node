var Primus = require("primus.io");
var alarmsCache = require("./custom_modules/alarmsCache");
var valuesCache = require("./custom_modules/valuesCache");
var messageBus = require("./custom_modules/messageBus");
var server = require("http").createServer();


var primus = Primus(server, {transformer: "websockets", parser: "JSON" });

primus.save(__dirname + '/primus.client.js');

var connections = [];

primus.on("connection", function (connection) {


    var client = {client: connection,
        sendNewAlarms: function (alarms) {

            this.connection.send("newAlarms", alarms);

        }, sendNewData: function (data) {
            this.connection.send("newData", data);

        }, sendCurrentAlarms: function (alarms){

        },sendCurrentData: function (data){

        } };

    obj.sendCurrentAlarms(alarmsCache)
    messageBus.receive("newAlarms", obj.sendNewAlarms);
    messageBus.receive("newData", obj.sendNewData);

    connections.push(client);



});

server.listen(8080);

alarmsCache.init();
valuesCache.init();




