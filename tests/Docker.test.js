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
var Docker = require('../lib/Docker');

suite('Docker', function(){
    var sut, composefile, modifications, exec, callback;

    setup(function(){
        modifications = [{auth: 1}, {mongodb: 2}];
        composefile = __dirname + '/data/docker-compose.yml';

        exec = sinon.stub();
        callback = sinon.spy();
        sut = new Docker(exec);
    });

    suite('#modify', function(){
        test('Should execute docker-compose correctly', function(){
            sut.modify(composefile, modifications);
            sinon.assert.calledWith(exec, "docker-compose --file " + composefile + " scale auth=1 mongodb=2 ");
        });
        test('Should execute callback forwarding any errors and output', function(){
            var code = 33, stdout = "some stdout", stderr = "some stderr";
            exec.yields(code, stdout, stderr);
            sut.modify(composefile, modifications, callback);

            sinon.assert.calledWithExactly(callback, code, stdout, stderr);
        });
        test('Should execute callback passing null if everything went ok', function(){
            exec.yields(null);
            sut.modify(composefile, modifications, callback);

            sinon.assert.calledWithExactly(callback, null);
        });
    });
});
