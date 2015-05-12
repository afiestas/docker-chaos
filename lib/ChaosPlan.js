var fs = require('fs');

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
             planData = JSON.parse(data);
        } catch (err) {
            console.log(err);
            callback(err);
            return;
        }

        callback(null, planData);
    });
};


module.exports = ChaosPlan;



