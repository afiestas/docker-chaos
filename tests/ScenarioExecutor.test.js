var sinon = require('sinon');
var assert = require('chai').assert;

var Scenario = require('../lib/Scenario');
var Docker = require('../lib/Docker');
var ScenarioExecutor = require('../lib/ScenarioExecutor');

suite('ScenarioExecutor', function(){
    var suts, chaosPlan, scenario, containers, file, docker, callback, clock;
    var timeout;

    setup(function(){
        clock = sinon.useFakeTimers();

        file = '/some/file.yaml';
        callback = sinon.spy();
        timeout = sinon.stub();

        containers = [{'authentication': 0}];
        scenario = new Scenario();
        scenario.setName('Test Scenario');
        scenario.setContainers(containers);

        docker = sinon.stub(new Docker());

        sut = new ScenarioExecutor(0, docker, timeout);
    });

    teardown(function() {
        clock.restore();
    });

    suite('#exec', function(){
        test('Should call this.docker.modify with all containers in scenario', function(){
            sut.exec(file, scenario);
            sinon.assert.calledWith(docker.modify, file, containers, sinon.match.func);
        });
        test('When modification fails, exception should be forwarded to callback', function(){
            var error = new Error('Some error');
            docker.modify.yields(error);
            sut.exec(file, scenario, callback);
            sinon.assert.calledWith(callback, error);
        });
        test('Should call docker.restore after scalation has succeed', function(){
            docker.modify.yields(null);
            timeout.yields();
            sut.exec(file, scenario);
            sinon.assert.calledWith(docker.restore, file, containers, sinon.match.func);
        });
    });
});







