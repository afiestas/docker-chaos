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







