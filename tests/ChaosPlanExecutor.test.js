/**
 * The MIT License (MIT)
 *
 * Copyright (c) <2015> <Àlex Fiestas afiestas@kde.org>
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 **/

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
