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
var Executor = require('../lib/Executor.js');

suite('Executor', function(){
    var sut, callback, exec, callCounter;

    setup(function(){
        callCounter = 0;
        exec = function(file, callback) {
            callCounter ++
            if (callCounter < 10) {
                callback(null);
            }
        };
        sut = new Executor(exec);
    });

    suite('#exec', function(){
        test('Script should be executed endlessly', function(){
            sut.exec("/tmp/notExistingFile");
            assert.equal(callCounter, 10, "Should execute recursively 10 times");
        });
        test('If this.stopped is true, nothing should happen', function(){
            sut.stop();
            sut.exec("/tmp/notExistingFile");
            assert.equal(callCounter, 0, "Exec should not be executed if stopped is equals true");
        });
    });
});
