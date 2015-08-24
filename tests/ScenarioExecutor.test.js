var sinon = require('sinon');
var assert = require('chai').assert;

var Scenario = require('../lib/Scenario');
var Scaler = require('../lib/Scaler');
var ScenarioExecutor = require('../lib/ScenarioExecutor');

suite('ScenarioExecutor', function(){
    var suts, chaosPlan, scenario, containers, file, scaler, callback;
    var timeout;

    setup(function(){
        file = '/some/file.yaml';
        callback = sinon.spy();
        timeout = sinon.stub();

        containers = [{'authentication': 0}];
        scenario = new Scenario();
        scenario.setName('Test Scenario');
        scenario.setContainers(containers);

        scaler = sinon.stub(new Scaler());

        sut = new ScenarioExecutor(0, scaler, timeout);
    });

    suite('#exec', function(){
        test('Should call this.scaler.scale with all containers in scenario', function(){
            sut.exec(file, scenario);
            sinon.assert.calledWith(scaler.scale, file, containers, sinon.match.func);
        });
        test('When modification fails, exception should be forwarded to callback', function(){
            var error = new Error('Some error');
            scaler.scale.yields(error);
            sut.exec(file, scenario, callback);
            sinon.assert.calledWith(callback, error);
        });
        test('Should call scaler.restore after scalation has succeed', function(){
            scaler.scale.yields(null);
            timeout.yields();
            sut.exec(file, scenario);
            sinon.assert.calledWith(scaler.restore, file, containers, sinon.match.func);
        });
        test('Should emit beforeRestore with the scenario', function(){
            scaler.scale.yields(null);
            timeout.yields();
            sut.on('beforeRestore', callback);
            sut.exec(file, scenario);
            sinon.assert.calledWith(callback, scenario);
        });
    });
});







