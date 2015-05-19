var util = require('util');
var eventEmitter = require('events').EventEmitter;

function ComposerProcess (childProc, byline) {
    this.chiildProcess = childProc || require('child_process');
    this.byline = byline || require('byline');
    this.stream = null;
    this.proc = null;
}

util.inherits(ComposerProcess, eventEmitter);

ComposerProcess.prototype.start = function() {
    this.proc = this.chiildProcess.spawn('docker-compose', ['logs']);
    this.stream = this.byline(this.proc.stdout);

    var self = this;
    this.stream.on('data', function(line) {
        self.emit('line', line);
    });
};

ComposerProcess.prototype.stop = function() {
    this.proc.kill();
}

module.exports = ComposerProcess;
