
function Scenario () {
    this.name = "Unnamed";
}

Scenario.prototype.setName = function(name) {
    this.name = name;
};

Scenario.prototype.getName = function() {
    return this.name;
};

Scenario.prototype.setContainers = function(containers) {
    this.containers = containers;
};

Scenario.prototype.getContainers = function() {
    return this.containers;
};

module.exports = Scenario;





