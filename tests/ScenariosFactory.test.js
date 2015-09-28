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






