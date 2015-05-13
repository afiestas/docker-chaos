var Scenario = require('./Scenario');

function ScenariosFactory () {
}

ScenariosFactory.prototype.getScenarios = function(scenariosData) {
    var scenarios = [];
    var scenario, name;
    scenariosData.forEach(function (value) {
        name = Object.keys(value)[0];
        scenario = new Scenario();
        scenario.setName(name);

        var scena = value[name];
        scenario.setContainers(scena.containers);

        scenarios.push(scenario);
    });

    return scenarios;
};

module.exports = ScenariosFactory;



