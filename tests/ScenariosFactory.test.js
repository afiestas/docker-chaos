var fs = require('fs');
var sinon = require('sinon');
var assert = require('chai').assert;
var yaml = require('js-yaml');
var ScenariosFactory = require('../lib/ScenariosFactory');

suite('ScenariosFactory', function(){
    var sut, callback, scenariosData, scenarios, scenariosFactory;

    setup(function(){
        var fileContent = fs.readFileSync(__dirname + '/data/chaos-plan.yml', {encoding: 'utf-8'});
        scenariosData = yaml.safeLoad(fileContent).scenarios;

        sut = new ScenariosFactory();
    });

    suite('#getScenarios', function(){
        test('Returned scenarios should have name initialized', function(){
            var scenarios = sut.getScenarios(scenariosData);
            assert.equal(scenarios[0].getName(), 'simpleFuck');
        });
        test('Returned scenarios should have containers initialized', function(){
            var scenarios = sut.getScenarios(scenariosData);
            assert.deepEqual(scenarios[0].getContainers(), [{authentication: 0}]);
        });
    });
});






