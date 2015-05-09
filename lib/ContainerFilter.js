function ContainerFilter () {
}

ContainerFilter.prototype.filter = function(containers, blacklist) {
    var filteredContainers = [];
    containers.forEach(function (value) {
        for (var key in blacklist) {
            if (blacklist[key] === value) {
                return;
            }
        }

        filteredContainers.push(value);
    });

    return filteredContainers;
};


module.exports = ContainerFilter;


