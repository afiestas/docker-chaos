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
