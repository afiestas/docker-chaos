var Docker = require('dockerode');
var fs = require('fs');

function DockerLogger (logPath, dockerInjected, fsInjected) {
    this.docker = dockerInjected || new Docker();
    this.fs = fsInjected || fs;
    // FIXME: Make sure logPath exists!
    // How to make sure logPath is specified?
    this.logPath = logPath;
}

DockerLogger.prototype.start = function(callback) {
    var self = this;
    this.docker.listContainers(function(err, containers) {
        if (err) {
            callback(err);
            return;
        }

        containers.forEach(function(containerInfo) {
            var name = containerInfo.Names[0];
            if (name[0] === '/') {
                name = name.substr(1);
            }

            var container = self.docker.getContainer(containerInfo.Id);
            container.logs({stream: true, stdout: true, stderr: true}, function(err, stream) {
                if (err) {
                    console.log("Docker Attach Error: " + err);
                    return;
                }

                var path = self.logPath + '/' + name;
                var fsStream = self.fs.createWriteStream(path, {flags: 'a'});
                stream.pipe(fsStream);
            });
        });

        callback();
    });
};

DockerLogger.prototype.stop = function() {
    this.docker = null;
};

module.exports = DockerLogger;
