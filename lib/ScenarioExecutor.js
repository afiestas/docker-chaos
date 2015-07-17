var util = require('util');
var Scaler = require('./Scaler');
var EventEmitter = require('events').EventEmitter;
var DockerLogger = require('./DockerLogger')

var min = 1
var max = 5;

function ScenarioExecutor (logPath, restoreTime, scaler, timeout, dockerLogger) {
    this.scaler = scaler || new Scaler();
    this.restoreTime = restoreTime;
    this.timeout = timeout || setTimeout;
    this.logPath = logPath || 'logs-' + (new Date().toISOString());
    this.dockerLogger = dockerLogger || new DockerLogger();

    if (typeof this.restoreTime !== 'number') {
        this.restoreTime = Math.floor(Math.random() * (max - min + 1)) + min;
    }
}

util.inherits(ScenarioExecutor, EventEmitter);

ScenarioExecutor.prototype.exec = function(composeFile, scenario, callback) {
    var containers = scenario.getContainers();

    var self = this;
    this.scaler.scale(composeFile, containers, function (err){
        if (err) {
            callback(err);
            return;
        }

        self.timeout(function() {
            self.emit('beforeRestore', scenario);
            self.dockerLogger.saveActiveContainersLog(self.logPath + '/' + scenario.getName(), function() {
                self.scaler.restore(composeFile, containers, function() {
                    callback();
                });
            });
        }, self.restoreTime);
    });
};


module.exports = ScenarioExecutor;




