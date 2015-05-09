var fs = require('fs');
var yaml = require('js-yaml');
var Compose = require('./Compose');

function ComposeFileParser () {

}

ComposeFileParser.prototype.parse = function(file, callback) {
    var composeFile;
    try {
        composeFile = yaml.safeLoad(fs.readFileSync(file, 'utf8'));
    } catch (e) {
        callback(e);
        return;
    }

    var containers = [];
    for (var key in composeFile) {
        if (!composeFile.hasOwnProperty(key)) {
            continue;
        }
        containers.push(key);
    }

    var compose = new Compose();
    compose.setContainers(containers);

    callback(false, compose);
};


module.exports = ComposeFileParser;

