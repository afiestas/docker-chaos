var sinon = require('sinon');
var assert = require('chai').assert;
var ChaosPlan = require('../lib/ChaosPlan');
var ScenarioExecutor = require('../lib/ScenarioExecutor');
var ChaosPlanExecutor = require('../lib/ChaosPlanExecutor');

suite('ChaosPlanExecutor', function() {
    var sut, callback, scenarioExecutor, scenarios, file, chaosPlan;

    setup(function() {

        file = '/some/file.yaml';
        scenarios = ['scenario 1', 'scenario 2'];
        chaosPlan = sinon.stub(new ChaosPlan());
        chaosPlan.getScenarios.returns(scenarios);

        var limit = 3;
        scenarioExecutor = {
            exec: sinon.spy(function(file, scenario, callback) {
                limit--;
                if (limit > 0) {
                    callback();
                }
            }),
            on: sinon.stub()
        };
        sut = new ChaosPlanExecutor(scenarioExecutor);
    });

    suite('#exec', function() {
        test('Should call scenarioExecutor.exec passing a scenario', function(){
            sut.exec(file, chaosPlan);
            sinon.assert.calledWith(scenarioExecutor.exec, file, scenarios[0]);
        });
        test('Should call scenarioExecutor.exec one per each scenario', function(){
            sut.exec(file, chaosPlan);
            sinon.assert.calledThrice(scenarioExecutor.exec);
        });
        test('Should call scenarioExecutor.exec with the correct scenario', function(){
            sut.exec(file, chaosPlan);
            sinon.assert.calledWith(scenarioExecutor.exec, file, scenarios[1]);
        });
        test('Should call scenarioExecutor.exec first scenario while looping', function(){
            sut.exec(file, chaosPlan);
            sinon.assert.calledWith(scenarioExecutor.exec.lastCall, file, scenarios[0]);
        });
    });
});
