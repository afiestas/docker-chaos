var ComposerProcess = require('./ComposerProcess');
var ComposerWritter = require('./ComposerWritter');

function ComposerLogger (process, writter) {
    this.process = process || new ComposerProcess();
    this.writter = writter || new ComposerWritter();
}

ComposerLogger.prototype.start = function() {
    var self = this;
    this.process.on('line', function(line) {
        self.writter.write(line);
    });

    this.process.start();
};

ComposerLogger.prototype.stop = function() {

}

module.exports = ComposerLogger;
