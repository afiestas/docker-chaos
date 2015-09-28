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
var Compose = require('../lib/Compose.js');
var ComposeFileParser = require('../lib/ComposeFileParser.js');

suite('ComposeFileParser', function(){
    var sut, callback, containers;

    setup(function(){
        containers = ["authentication", "proxy", "mongodb", "rabbitmq", "ldap"];
        callback = sinon.stub();
        compose = sinon.stub();
        sut = new ComposeFileParser(compose);
    });

    suite('#parse', function(){
        test('On error, callback should we call with it', function(){
            sut.parse("/tmp/notExistingFile", callback);
            sinon.assert.called(callback);
        });
        test('On success a Compose object should be passed initialized', function(){
            sut.parse(__dirname + '/data/docker-compose.yml', callback);
            assert.deepEqual(callback.args[0][1].getContainers(), containers);
        });
    });
});

