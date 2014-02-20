var http = require("http");
var redis = require("redis");
var sockjs = require("sockjs");
var express = require("express");
var sockjsOpts = {sockjs_url: "http://cdn.sockjs.org/sockjs-0.3.min.js"};
var sockjsServer = sockjs.createServer(sockjsOpts);
var app = express();
var server = http.createServer(app);


sockjsServer.on("connection", function (connection){

    var browser = redis.createClient("6379", "localhost");
    browser.psubscribe("alarmsChannel");
    browser.on("pmessage",function(pattern,channel,message){
        connection.write(message);

        console.log("message");
    });
});

 sockjsServer.installHandlers(server,{prefix:"/alarms"});


app.get("/", function (req,res){
    res.sendfile(__dirname + "/index.html");
});

server.listen(8088);














