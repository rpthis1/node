/**
 * Created by me on 8/22/2014.
 */



var parse = function (obj) {
    var params = "<parameters>";
    for (var i in obj )
    {
        params += "<parameter id='"+i+"' value='" +obj[i]+"'/>"
    }
    params += "</parameters>";

    return params;
}

module.exports.parse = parse;