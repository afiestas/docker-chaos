var Docker = require('dockerode');
var fs = require('fs');

function DockerLogger (logPath, dockerInjected, fsInjected) {
    this.docker = dockerInjected || new Docker();
    this.fs = fsInjected || fs;
    // FIXME: Make sure logPath exists!
    // How to make sure logPath is specified?
    this.logPath = logPath;
    this.containers = [];
}

DockerLogger.prototype.start = function(callback) {
    this.update(callback);
};

DockerLogger.prototype.__startLoggingContainer = function(containerInfo, callback) {
    var name = containerInfo.Names[0];
    if (name[0] === '/') {
        name = name.substr(1);
    }

    var self = this;
    var container = this.docker.getContainer(containerInfo.Id);
    container.logs({stream: true, stdout: true, stderr: true}, function(err, stream) {
        if (err) {
            console.log("Docker Attach Error: " + err);
            return;
        }

        var path = self.logPath + '/' + name;
        var fsStream = self.fs.createWriteStream(path, {flags: 'a'});
        stream.pipe(fsStream);

        callback();
    });
};

DockerLogger.prototype.stop = function() {
    this.docker = null;
};

DockerLogger.prototype.update = function(callback) {
    var self = this;
    this.docker.listContainers(function(err, containers) {
        if (err) {
            callback(err);
            return;
        }

        containers.forEach(function(containerInfo) {
            // if already exists!
            var index = self.containers.map(function(e) { return e.Id; }).indexOf(containerInfo.Id);

            if (index === -1) {
                self.__startLoggingContainer(containerInfo, function() {});
            }
        });
        self.containers = containers;

        callback();
    });
};

module.exports = DockerLogger;
