
function ChaosPlan () {
    this.name = "Unnamed";
}

ChaosPlan.prototype.setName = function(name) {
    this.name = name;
};

ChaosPlan.prototype.getName = function() {
    return this.name;
};

ChaosPlan.prototype.setScenarios = function(scenarios) {
    this.scenarios = scenarios;
};

ChaosPlan.prototype.getScenarios = function() {
    return this.scenarios;
};

module.exports = ChaosPlan;




