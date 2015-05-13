var Docker = require('./Docker');

function Scaler (implementation) {
    this.implementation = implementation || new Docker();
}

Scaler.prototype.scale = function(file, containers, callback) {
    this.implementation.modify(file, containers, callback);
};


module.exports = Scaler;




