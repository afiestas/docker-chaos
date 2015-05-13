var fs = require('fs');
var sinon = require('sinon');
var assert = require('chai').assert;
var yaml = require('js-yaml');
var ScenariosFactory = require('../lib/ScenariosFactory');
var ChaosPlanFactory = require('../lib/ChaosPlanFactory');

suite('ChaosPlanFactory', function(){
    var sut, callback, chaosPlanData, scenarios, scenariosFactory;

    setup(function(){
        scenarios = ['some-scenario'];
        scenariosFactory = sinon.stub(new ScenariosFactory());

        chaosPlanData = fs.readFileSync(__dirname + '/data/chaos-plan.yml', {encoding: 'utf-8'});
        fakeFs = {readFile: sinon.stub()};
        callback = sinon.spy();
        file = 'some-file';

        sut = new ChaosPlanFactory(yaml, scenariosFactory);
    });

    suite('#getChaosPlan', function(){
        test('Returned chaosPlan should have name initialized', function(){
            var chaosPlan = sut.getChaosPlan(chaosPlanData);
            assert.equal(chaosPlan.getName(), 'Example plan');
        });
        test('Returned chaosPlan should have scenarios initialized', function(){
            scenariosFactory.getScenarios.returns(scenarios);
            var chaosPlan = sut.getChaosPlan(chaosPlanData);
            assert.equal(chaosPlan.getScenarios(), scenarios);
        });
    });
});





