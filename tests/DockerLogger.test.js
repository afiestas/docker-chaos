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
var DockerLogger = require('../lib/DockerLogger');

suite('DockerLogger', function() {
    var sut, logPath, containers, conInfo, con, stream, fsStream;
    var docker, fs;

    setup(function() {
        conInfo = {
            Names: ['name'],
            Id: 'id'
        };
        containers = [conInfo];

        docker = {
            listContainers: sinon.stub(),
            getContainer: sinon.stub()
        };
        docker.listContainers.callsArgWith(0, null, containers);

        con = {
            logs: sinon.stub()
        };
        stream = {
            pipe: sinon.stub()
        };
        con.logs.callsArgWith(1, null, stream);

        docker.getContainer.returns(con);

        fs = {
            createWriteStream: sinon.stub()
        };
        fsStream = sinon.stub();
        fs.createWriteStream.returns(fsStream);

        logPath = '/some/path';
        sut = new DockerLogger(logPath, docker, fs);
    });

    suite('#start', function() {
        test('Should get a list of containers', function(done) {
            sut.start(function() {
                sinon.assert.calledOnce(docker.listContainers);
                done();
            });
        });

        test('Should get a container for each containerInfo', function(done) {
            sut.start(function() {
                sinon.assert.calledWithExactly(docker.getContainer, conInfo.Id);
                done();
            });
        });

        test('Should pipe container logs to a file', function(done) {
            sut.start(function() {
                sinon.assert.calledWithExactly(stream.pipe, fsStream);
                done();
            });
        });

        test('Should create a file for each container', function(done) {
            sut.start(function() {
                sinon.assert.calledWith(fs.createWriteStream, logPath + '/name');
                done();
            });
        });
    });
});
