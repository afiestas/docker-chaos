
function ComposerSplitter() {
    this.regexp = /(\w+)\s+\|\s+/g;
}

ComposerSplitter.prototype.split = function(line) {
    var componentLog = this.regexp.exec(line);
    if (!componentLog) {
        return;
    }
    var splitLine = line.replace(componentLog[0], '');

    return {component: componentLog[1], line: splitLine};
};

module.exports = ComposerSplitter;

