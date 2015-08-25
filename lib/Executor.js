var util = require("util");
var events = require("events");

function Executor (exec) {
    this.execImpl = exec || require('child_process').exec;
    this.stopped = false;
}

util.inherits(Executor, events.EventEmitter);

Executor.prototype.exec = function(script) {
    if (this.stopped) {
        return;
    }

    this.stopped = false;

    var self = this;
    self.emit('start');
    this.execImpl(script, function(error, stdout, stderr) {
        if (error !== null) {
            self.emit('fail', stdout, stderr);
        } else {
            self.emit('pass');
        }
        self.exec(script);
    });
};

Executor.prototype.stop = function() {
    this.stopped = true;
};

module.exports = Executor;
