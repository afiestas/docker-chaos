var util = require('util');
var EventEmitter = require('events').EventEmitter;
var ScenarioExecuter = require('./ScenarioExecutor');

function ChaosPlanExecutors (scenarioExecuter) {
    this.scenarioExecuter = scenarioExecuter || new ScenarioExecuter();
    this.stopped = false;
}

util.inherits(ChaosPlanExecutors, EventEmitter);

ChaosPlanExecutors.prototype.exec = function(composeFile, chaosPlan) {
    var scenarios = chaosPlan.getScenarios();

    var self = this;
    var scenario = 0;
    function executeScenario(scenario) {
        if (scenarios.length === scenario) {
            scenario = 0;
        }
        self.scenarioExecuter.exec(composeFile, scenarios[scenario], function(err) {
            if (err) {
                console.log("Failed to execute Scenario: " + err);
                return;
            }
            if (!self.stopped) {
                scenario++;
                executeScenario(scenario);
            }
        });
        self.scenarioExecuter.on('scaled', function() {
            self.emit('dockerContainersChanged');
        });
    }

    executeScenario(scenario);
};

ChaosPlanExecutors.prototype.stop = function() {
    this.stopped = true;
};

module.exports = ChaosPlanExecutors;
