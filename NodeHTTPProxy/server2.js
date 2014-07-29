var http = require('http');
var sys  = require('sys');
var qs = require('querystring');
http.createServer(onRequest).listen(8082);

function onRequest (client_req, client_res) {

    if (client_req.method == 'POST') {
        var body = '';
        client_req.on('data', function (data) {
            body += data;

            console.log("getting body");

            // Too much POST data, kill the connection!
            if (body.length > 1e6)
                req.connection.destroy();
        });
        client_req.on('end', function () {
            var post = qs.parse(body);
            console.log("got body");
            console.log(body);



            var options = {
                host: 'localhost',
                port: 80,
                path: "/box/",
                method: 'POST',
                headers: {"Authorization":"Basic YWRtaW46I0NBUk9NQTEw"}

            };
            var req=http.request(options, function(res) {
                var body = "";
                res.on('data', function (chunk) {
                    body += chunk;
                });
                res.on('end', function () {




                    res.headers["Access-Control-Allow-Origin"] = "*";
                    res.headers["Access-Control-Allow-Methods"] = "POST, GET, PUT, DELETE, OPTIONS";
                    res.headers["Access-Control-Allow-Credentials"] = true;
                    res.headers["Access-Control-Max-Age"] = '86400'; // 24 hours
                    res.headers["Access-Control-Allow-Headers"] = "X-Requested-With, Access-Control-Allow-Origin, X-HTTP-Method-Override, Content-Type, Authorization, Accept";

                    client_res.writeHead(res.statusCode, res.headers);

                    console.log(res.headers);

                    client_res.end(body);
                });
            });
            req.write(body);
            req.end();








        });
    }






    client_req.addListener("end", function() {








    });
}