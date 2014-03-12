var alarmsCache = require("./custom_modules/alarmsCache");
var http = require("http");
var redis = require("redis");
var sockjs = require("sockjs");
var express = require("express");
var sockjsOpts = {sockjs_url: "http://cdn.sockjs.org/sockjs-0.3.min.js"};
var sockjsServer = sockjs.createServer(sockjsOpts);
var app = express();
var server = http.createServer(app);


sockjsServer.on("connection", function (connection){

    var redisClient = redis.createClient("6379", "54.213.134.12");


   /** Write current alarm count on initial connection **/
    connection.write(alarmsCache.activeAlarmsCount)

  /** Subscribe to changes in the alarm count for future notifications **/
    redisClient.psubscribe("alarmsChannel");


    redisClient.on("pmessage",function(pattern,channel,message){
        connection.write(message);

        console.log("message");
    });
});

sockjsServer.installHandlers(server,{prefix:"/alarms"});


app.get("/", function (req,res){
    res.sendfile(__dirname + "/index.html");
});

server.listen(8088);
alarmsCache.init();





