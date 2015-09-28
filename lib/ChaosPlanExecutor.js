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

var util = require('util');
var EventEmitter = require('events').EventEmitter;
var ScenarioExecuter = require('./ScenarioExecutor');

function ChaosPlanExecutors (scenarioExecuter) {
    this.scenarioExecuter = scenarioExecuter || new ScenarioExecuter();
    this.stopped = false;
}

util.inherits(ChaosPlanExecutors, EventEmitter);

ChaosPlanExecutors.prototype.exec = function(composeFile, chaosPlan) {
    var scenarios = chaosPlan.getScenarios();

    var self = this;
    var scenario = 0;
    function executeScenario(scenario) {
        if (scenarios.length === scenario) {
            scenario = 0;
        }
        self.scenarioExecuter.exec(composeFile, scenarios[scenario], function(err) {
            if (err) {
                self.emit('error', new Error("Failed to execute Scenario: " + err));
                return;
            }
            if (!self.stopped) {
                scenario++;
                executeScenario(scenario);
            }
        });
        self.scenarioExecuter.on('scaled', function() {
            self.emit('dockerContainersChanged');
        });
    }

    executeScenario(scenario);
};

ChaosPlanExecutors.prototype.stop = function() {
    this.stopped = true;
};

module.exports = ChaosPlanExecutors;
