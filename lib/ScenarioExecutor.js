var Scaler = require('./Scaler');

var min = 1
var max = 5;

function ScenarioExecutor (restoreTime, scaler, timeout) {
    this.scaler = scaler || new Scaler();
    this.restoreTime = restoreTime;
    this.timeout = timeout || setTimeout;

    if (typeof this.restoreTime !== 'number') {
        this.restoreTime = Math.floor(Math.random() * (max - min + 1)) + min;
    }
}

ScenarioExecutor.prototype.exec = function(composeFile, scenario, callback) {
    var containers = scenario.getContainers();

    var self = this;
    this.scaler.scale(composeFile, containers, function (err){
        if (err) {
            callback(err);
            return;
        }

        self.timeout(function() {
            self.scaler.restore(composeFile, containers, function() {
                callback();
            });
        }, self.restoreTime);
    });
};


module.exports = ScenarioExecutor;




