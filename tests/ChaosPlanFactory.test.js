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





