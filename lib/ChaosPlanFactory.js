var fs = require('fs');
var yaml = require('js-yaml');
var ChaosPlan = require('./ChaosPlan');
var ScenariosFactory = require('./ScenariosFactory');

function ChaosPlanFactory (yamlInj, scenariosFactory) {
    this.yaml = yamlInj || require('js-yaml');
    this.scenarios = scenariosFactory || new ScenariosFactory();
}

ChaosPlanFactory.prototype.getChaosPlan = function(chaosPlanData) {
    var yaml = this.yaml.safeLoad(chaosPlanData);

    var chaosPlan = new ChaosPlan();
    chaosPlan.setName(yaml.name);

    var scenarios = this.scenarios.getScenarios(yaml.scenarios);
    chaosPlan.setScenarios(scenarios);

    return chaosPlan;
};

module.exports = ChaosPlanFactory;



