var Docker = require('./Docker');

var min = 1;
var max = 5;

function Scaler (implementation, random) {
    this.implementation = implementation || new Docker();
    this.random = random || function(){return Math.floor(Math.random() * (max - min + 1)) + min}
}

Scaler.prototype.restore = function(file, containers, callback) {
    var name;
    containers.forEach(function (value) {
        name = Object.keys(value)[0];
        value[name] = 1;
    });

    this.implementation.modify(file, containers, callback);
}

Scaler.prototype.scale = function(file, containers, callback) {
    var self = this;
    containers.forEach(function (value) {
        name = Object.keys(value)[0];
        if (value[name] === '?') {
            value[name] = self.random();
        }
    });

    this.implementation.modify(file, containers, callback);
};


module.exports = Scaler;




