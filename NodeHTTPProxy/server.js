var http = require('http');
var sys  = require('sys');
http.createServer(onRequest).listen(8082);

function onRequest (client_req, client_res) {
    client_req.addListener("end", function() {
        var options = {
            host: 'localhost',
            port: 80,
            path: "/ibis?0=swid=/Logic/NumericWritable,property=out",
            method: 'GET',
            headers: {"Authorization":"Basic YWRtaW46I0NBUk9NQTEw"}

        };
        var req=http.request(options, function(res) {
            var body;
            res.on('data', function (chunk) {
                body += chunk;
            });
            res.on('end', function () {
              client_res.writeHead(res.statusCode, res.headers);
                client_res.end(body);
            });
        });
        req.end();
    });
}