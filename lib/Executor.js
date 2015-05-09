function Executor (spawn) {
    this.spawn = spawn || require('child_process').spawn;
    this.stopped = false;
}

Executor.prototype.exec = function(script) {
    if (this.stopped) {
        return;
    }

    this.stopped = false;
    var self = this;
    var proc = this.spawn(script);
    proc.once('close', function() {
        self.exec(script);
    });
};

Executor.prototype.stop = function() {
    this.stopped = true;
}

module.exports = Executor;


