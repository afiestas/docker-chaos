var fs = require('fs');

function Docker (exec) {
    this.exec = exec || require("child_process").exec;
}

Docker.prototype.modify = function(composeFile, modifications, callback) {
    var containers = "";
    var name, amount;
    modifications.forEach(function (value) {
        name = Object.keys(value)[0];
        amount = value[name];
        containers += name + "=" + amount + " ";
    });

    var command = "docker-compose --file " + composeFile + " scale " + containers;
    this.exec(command, function(code, stdout, stderr) {
        if (code !== null) {
            callback(code, stdout, stderr);
            return;
        }

        callback(null);
    });
};

module.exports = Docker;
