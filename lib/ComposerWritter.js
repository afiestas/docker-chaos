
function ComposerWritter(splitter) {
    this.splitter = splitter;
}

ComposerWritter.prototype.write = function(line) {
    this.splitter.split(line);
};

module.exports = ComposerWritter;

