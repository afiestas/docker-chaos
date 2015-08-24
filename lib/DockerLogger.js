var Docker = require('./Docker');

function DockerLogger (docker) {
    this.docker = docker || new Docker();
}

DockerLogger.prototype.saveActiveContainersLog = function(logPath, callback) {
	var self = this;
	this.docker.listContainers(function(err, containers) {
		var index = 0;
		function loop() {
			if (index >= containers.length) {
				callback();
				return;
			}

			var con = containers[index];
			index += 1;
			self.docker.saveLog(logPath + '/' + con, con, loop);
		}

		loop();
	});
};

DockerLogger.prototype.start = function() {

};

module.exports = DockerLogger;
