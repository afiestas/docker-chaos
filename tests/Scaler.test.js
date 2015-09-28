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
var Scaler = require('../lib/Scaler');

suite('Scaler', function(){
    var sut, file, containers, callback;
    var implementation, random;

    setup(function(){
        random = function(){return 9;};

        implementation = {modify: sinon.spy()};
        containers = [{auth: 1}, {mongodb: 2}];
        file = 'some-file';

        callback = function(){};
        sut = new Scaler(implementation, random);
    });

    suite('#scale', function(){
        test('Should forward call to implementation', function(){
            sut.scale(file, containers, callback);
            sinon.assert.calledWithExactly(implementation.modify, file, containers, callback);
        });
        test('Should generate a random scale unmber if ? is found', function(){
            var containers = [{mongodb: '?'}];
            sut.scale(file, containers, callback);
            sinon.assert.calledWithExactly(implementation.modify, file, [{mongodb: 9}], callback);
        });
    });
    suite('#restore', function(){
        test('Should forward call to implementation setting all containers to 1', function(){
            sut.restore(file, containers, callback);
            var expContainers = [{auth: 1}, {mongodb: 1}];
            sinon.assert.calledWithExactly(implementation.modify, file, expContainers, callback);
        });
    });
});







