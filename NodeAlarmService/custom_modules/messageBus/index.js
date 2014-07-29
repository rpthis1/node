var Emitter = require("events").EventEmitter;
var     messageBus = new Emitter();


function send(message, objParam) {
    messageBus.emit(message, objParam);
}

function receive(message, func) {

    messageBus.on(message, func);
}


module.exports.send = send;
module.exports.receive= receive;
