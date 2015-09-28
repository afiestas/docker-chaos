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

var Docker = require('./Docker');

var min = 1;
var max = 5;

function Scaler (implementation, random) {
    this.implementation = implementation || new Docker();
    this.random = random || function(){return Math.floor(Math.random() * (max - min + 1)) + min}
}

Scaler.prototype.restore = function(file, containers, callback) {
    var name;
    containers.forEach(function (value) {
        name = Object.keys(value)[0];
        value[name] = 1;
    });

    this.implementation.modify(file, containers, callback);
}

Scaler.prototype.scale = function(file, containers, callback) {
    var self = this;
    containers.forEach(function (value) {
        name = Object.keys(value)[0];
        if (value[name] === '?') {
            value[name] = self.random();
        }
    });

    this.implementation.modify(file, containers, callback);
};


module.exports = Scaler;




