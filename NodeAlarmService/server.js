var Primus = require("primus.io");
var alarmsCache = require("./custom_modules/alarmsCache");
var server = require("http").createServer();


var primus = Primus(server, {transformer: "websockets", parser: "JSON" });

primus.save(__dirname +'/primus.client.js');

primus.on("connection", function (spark) {

    spark.on("hi", function (msg) {

        console.log(msg);

        spark.send("hello","hello from the server");

    });


});

server.listen(8080);
alarmsCache.init();

