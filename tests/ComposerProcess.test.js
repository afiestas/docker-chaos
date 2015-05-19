var sinon = require('sinon');
var assert = require('chai').assert;
var EventEmitter = require('events').EventEmitter;
var ComposerProcess = require('../lib/ComposerProcess.js');

suite('ComposerProcess', function(){
    var sut, childProcess, dockerComposeProc, byline, stream, buffer;

    setup(function(){
        stream = new EventEmitter();
        byline = sinon.stub();
        byline.returns(stream);
        dockerComposeProc = {stdout: 'setdout', kill: sinon.stub()};
        buffer = new Buffer(dockerComposeProc.stdout);
        childProcess = {
            spawn: sinon.stub()
        };
        childProcess.spawn.returns(dockerComposeProc);
        sut = new ComposerProcess(childProcess, byline);
    });

    suite('#start', function(){
        test('Should call this.spawn with correct command', function(){
            sut.start();
            sinon.assert.calledWithExactly(childProcess.spawn, 'docker-compose', ['logs']);
        });
        test('Should connect stdout from spawn to byline', function(){
            sut.start();
            sinon.assert.calledWithExactly(byline, dockerComposeProc.stdout);
        });
        test('Should emit line whenever returned stream data event is emitted', function(done){
            sut.on('line', function(){done()});
            sut.start();
            stream.emit('data', buffer);
        });
        test('Should ', function(){
            var spy = sinon.spy();
            sut.on('line', spy);
            sut.start();
            stream.emit('data', buffer);

            sinon.assert.calledWith(spy, dockerComposeProc.stdout);
        });
    });
    suite('#stop', function(){
        setup(function() {
            sut.proc = dockerComposeProc;
        });
        test('Should call this.proc.kill', function(){
            sut.stop();
            sinon.assert.calledWithExactly(dockerComposeProc.kill);
        });
    });
});



