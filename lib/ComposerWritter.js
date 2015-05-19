var fs = require('fs');

function ComposerWritter(splitter, fsInj) {
    this.splitter = splitter;
    this.fs = fsInj || fs;
    this.fd = {};
}

ComposerWritter.prototype.write = function(line) {
    var lineInfo = this.splitter.split(line);
    var component = lineInfo.component;
    line = lineInfo.line;


    if (this.fd[component]) {
        this.fs.write(this.fd[component], line);
        return;
    }

    var self = this;
    var path = '/tmp/' + component;
    this.fs.open(path, 'a', function(err, fd){
        if (err) {
            console.log('Could not open log file', path, err);
            return;
        }

        self.fs.write(fd, line);
        self.fd[component] = fd;
    });
};

ComposerWritter.prototype.close = function() {
    for (var key in this.fd) {
        this.fs.close(this.fd[key]);
    }
};

module.exports = ComposerWritter;

