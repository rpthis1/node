var Emitter = require("events").EventEmitter;
var messageBus;

function send(message, objParam) {
    messageBus.emit(message, objParam);
}

function receive(message, func) {

    messageBus.on(message, func);
}

function init() {

    console.log("initialized MessageBus");
    messageBus = new Emitter();
}

module.exports.send = send;
module.exports.recive = receive;
module.exports.init = init;