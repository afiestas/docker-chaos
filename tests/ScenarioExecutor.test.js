var sinon = require('sinon');
var assert = require('chai').assert;

var Scenario = require('../lib/Scenario');
var Docker = require('../lib/Docker');
var ScenarioExecutor = require('../lib/ScenarioExecutor');

suite('ScenarioExecutor', function(){
    var suts, chaosPlan, scenario, containers, file, docker;

    setup(function(){
        file = '/some/file.yaml';

        containers = [{'authentication': 0}];
        scenario = new Scenario();
        scenario.setName('Test Scenario');
        scenario.setContainers(containers);

        docker = sinon.stub(new Docker());

        sut = new ScenarioExecutor(docker);
    });

    suite('#exec', function(){
        test('Should call this.docker.modify with all containers in scenario', function(){
            sut.exec(file, scenario);
            sinon.assert.calledWith(docker.modify, file, containers, sinon.match.func);
        });
    });
});







