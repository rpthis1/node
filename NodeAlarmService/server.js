var Primus = require("primus.io");
var alarmsCache = require("./custom_modules/alarmsCache");
var valuesCache = require("./custom_modules/valuesCache");
var messageBus = require("./custom_modules/messageBus");
var server = require("http").createServer();


var primus = Primus(server, {transformer: "websockets", parser: "JSON" });

primus.save(__dirname + '/primus.client.js');

var connections = [];

primus.on("connection", function (connection) {

    console.log("client connected.." + connection);

    var newClient = {client: connection,
        sendAlarms: function (alarms) {
            console.log("new alarms");
            this.client.send("newAlarms", JSON.stringify(alarms));
        }, sendData: function (data) {
            this.client.send("newData", JSON.stringify(data));
        } };

    newClient.sendAlarms(alarmsCache.currentAlarmsState);
    newClient.sendData(valuesCache.currentDataState);

    messageBus.receive("MESSAGE_BUS_newAlarms", newClient.sendAlarms.bind(newClient));
    messageBus.receive("MESSAGE_BUS_newData", newClient.sendData.bind(newClient));

    connections.push(newClient);

});

server.listen(8080);

alarmsCache.init();
valuesCache.init();




