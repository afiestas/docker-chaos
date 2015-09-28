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
var Scaler = require('./Scaler');
var EventEmitter = require('events').EventEmitter;

var min = 1;
var max = 5;

function ScenarioExecutor (restoreTime, scaler, timeout) {
    this.scaler = scaler || new Scaler();
    this.restoreTime = restoreTime;
    this.timeout = timeout || setTimeout;

    if (typeof this.restoreTime !== 'number') {
        this.restoreTime = Math.floor(Math.random() * (max - min + 1)) + min;
    }
}

util.inherits(ScenarioExecutor, EventEmitter);

ScenarioExecutor.prototype.exec = function(composeFile, scenario, callback) {
    var containers = scenario.getContainers();

    var self = this;
    this.scaler.scale(composeFile, containers, function (err){
        if (err) {
            callback(err);
            return;
        }
        self.emit('scaled', scenario);

        self.timeout(function() {
            self.emit('beforeRestore', scenario);
            self.scaler.restore(composeFile, containers, function() {
                callback();
            });
        }, self.restoreTime);
    });
};


module.exports = ScenarioExecutor;
