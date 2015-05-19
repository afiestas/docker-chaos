var fs = require('fs');
var ComposerSplitter = require('./ComposerSplitter');

function ComposerWritter(splitter, fsInj) {
    this.splitter = splitter || new ComposerSplitter();
    this.fs = fsInj || fs;
    this.fd = {};
}

ComposerWritter.prototype.write = function(line) {
    var lineInfo = this.splitter.split(line);
    if (!lineInfo) {
        return;
    }

    var component = lineInfo.component;
    line = lineInfo.line;

    if (this.fd[component] && this.fd[component].fd > -1) {
        this.fs.write(this.fd[component].fd, line);
        return;
    }

    if (this.fd[component] && this.fd[component].fd === -1) {
        this.fd[component].buffer.push(line);
        return;
    }

    var self = this;
    var path = '/tmp/' + component + '.txt';
    this.fd[component] = {fd: -1, buffer: []};

    this.fd[component].buffer.push(line);
    this.fs.open(path, 'a', function(err, fd){
        if (err) {
            console.log('Could not open log file', path, err);
            return;
        }

        self.fd[component].fd = fd;
        self.fs.write(fd, self.fd[component].buffer.join('\n'));
    });
};

ComposerWritter.prototype.close = function() {
    for (var key in this.fd) {
        this.fs.close(this.fd[key]);
    }
};

module.exports = ComposerWritter;

