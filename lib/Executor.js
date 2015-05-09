function Executor (spawn) {
    this.spawn = spawn || require('child_process').spawn;
}

Executor.prototype.exec = function(script, times) {
    if (!times) {
        return;
    }

    var self = this;
    var proc = this.spawn(script);
    proc.once('close', function() {
        times--;
        self.exec(script, times);
    });
};


module.exports = Executor;


