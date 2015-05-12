var sinon = require('sinon');
var assert = require('chai').assert;
var ChaosPlan = require('../lib/ChaosPlan');

suite('ChaosPlan', function(){
    var sut, file, callback;

    setup(function(){
        file = __dirname + '/data/chaos-plan.yml';
        sut = new ChaosPlan();
    });

    suite('#getPlan', function(){
        test('Should return an array of POJOS describing the test plan', function(done){
            sut.getPlan(file, function(err, planData){
                var expectedPlan = {plans: [
                    {simpleFuck: [{authentication: 2}]
                    }
                ]};
                assert.deepEqual(planData, expectedPlan);
                done();
            });
        });
    });
});





