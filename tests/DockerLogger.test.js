var sinon = require('sinon');
var assert = require('chai').assert;
var DockerLogger = require('../lib/DockerLogger');

suite('DockerLogger', function(){
    var sut, logPath;
    var docker;

    setup(function(){
        docker = {
            listContainers: sinon.stub(),
            saveLog: sinon.stub()
        };
        docker.listContainers.callsArgWith(0, null, ['abc']);
        docker.saveLog.callsArg(2);
        logPath = '/log';

        sut = new DockerLogger(docker);
    });

    suite('#saveActiveContainersLog', function(){
        test('Should fetch list of containers', function(done){
            sut.saveActiveContainersLog(logPath, function() {
                sinon.assert.calledOnce(docker.listContainers);
                done();
            });
        });
        test('Should save the log file', function(done){
            sut.saveActiveContainersLog(logPath, function() {
                sinon.assert.calledWith(docker.saveLog, logPath + '/abc', 'abc');
                done();
            });
        });
    });
});
