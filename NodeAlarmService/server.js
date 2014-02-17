var sql = require('mssql');

var config = {
    user: 'mp',
    password: '101010',
    server: 'localhost',
    database: 'IBIS'
}

var connection = new sql.Connection(config, function(err) {
    // ... error checks

    // Query

    var request = new sql.Request(connection); // or: var request = connection.request();
    request.query('SELECT * FROM ActiveAlarms', function(err, recordset) {
        // ... error checks

        console.dir(recordset);
    });



});