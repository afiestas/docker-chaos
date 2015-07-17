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

Docker.prototype.listContainers = function(composeFile, callback) {
    var command = "sh -c docker-compose --file " + composeFile + " ps | tail -n +3 | awk '{ print $1 }'";
    this.exec(command, function(code, stdout, stderr) {
        if (code != null) {
            callback(code, stdout, stderr);
            return;
        }

        var containers = stdout.toString().split('\n');
        callback(null, containers);
    });
};

Docker.prototype.saveLog = function(containerName, filePath, callback) {
    var command = "docker logs " + containerName;
    this.exec(command, function(code, stdout, stderr) {
        if (code != null) {
            callback(code, stdout, stderr);
            return;
        }

        fs.open(filePath, 'w', function(err, fd) {
            if (err != nill) {
                callback(err);
                return;
            }

            fs.write(fd, stdout, function(){
                fs.close(fd, function() {
                    callback();
                });
            });
        });
    });
};


module.exports = Docker;
