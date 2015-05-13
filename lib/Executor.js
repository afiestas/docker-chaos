function Executor (exec) {
    this.execImpl = exec || require('child_process').exec;
    this.stopped = false;
}

Executor.prototype.exec = function(script) {
    if (this.stopped) {
        return;
    }

    this.stopped = false;

    var self = this;
    this.execImpl(script, function(error, stdout, stderr) {
        self.exec(script);
    });
};

Executor.prototype.stop = function() {
    this.stopped = true;
}

module.exports = Executor;


