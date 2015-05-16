
var ScenarioExecuter = require('./ScenarioExecutor');
function ChaosPlanExecutors (scenarioExecuter) {
    this.scenarioExecuter = scenarioExecuter || new ScenarioExecuter();
    this.stopped = false;
}

ChaosPlanExecutors.prototype.exec = function(file, chaosPlan) {
    var scenarios = chaosPlan.getScenarios();

    var self = this;
    var scenario = 0;
    function executeScenario(scenario) {
        if (scenarios.length == scenario) {
            scenario = 0;
        }
        self.scenarioExecuter.exec(file, scenarios[scenario], function() {
            if (!self.stopped) {
                scenario++;
                executeScenario(scenario);
            }
        });
    }

    executeScenario(scenario);
};

ChaosPlanExecutors.prototype.stop = function() {
    this.stopped = true;
}

module.exports = ChaosPlanExecutors;
