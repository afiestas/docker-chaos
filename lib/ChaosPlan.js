var fs = require('fs');
var yaml = require('js-yaml');

function ChaosPlan () {
}

ChaosPlan.prototype.getPlan = function(file, callback) {
    fs.readFile(file, function (err, data) {
        if (err) {
            callback(err);
            return;
        }

        var planData = null;
        try {
            planData = yaml.safeLoad(data);
        } catch (err) {
            console.log("Error parsing yml", err);
            callback(err);
            return;
        }

        callback(null, planData);
    });
};


module.exports = ChaosPlan;



