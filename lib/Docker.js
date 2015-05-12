var fs = require('fs');

function Docker (exec) {
    this.exec = exec || require("child_process").exec;
}

Docker.prototype.modify = function(composeFile, modifications) {
    var containers = "";
    var name, amount;
    modifications.forEach(function (value) {
        name = Object.keys(value)[0];
        amount = value[name];
        containers += name + "=" + amount + " ";
    });

    this.exec("docker-compose --file " + composeFile + " scale " + containers);
};


module.exports = Docker;



