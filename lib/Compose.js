function Compose () {
    this.containers = [];
}

Compose.prototype.setContainers = function(containers) {
    this.containers = containers;
};

Compose.prototype.getContainers = function() {
    return this.containers;
};

module.exports = Compose;


