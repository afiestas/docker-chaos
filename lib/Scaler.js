var Docker = require('./Docker');

function Scaler (implementation) {
    this.implementation = implementation || new Docker();
}

Scaler.prototype.restore = function(file, containers, callback) {
    var name;
    var fwdContainers = [];
    containers.forEach(function (value) {
        name = Object.keys(value)[0];
        value[name] = 1;
    });

    this.implementation.modify(file, containers, callback);
}

Scaler.prototype.scale = function(file, containers, callback) {
    this.implementation.modify(file, containers, callback);
};


module.exports = Scaler;




