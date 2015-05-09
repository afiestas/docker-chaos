var sinon = require('sinon');
var assert = require('chai').assert;
var Compose = require('../lib/Compose.js');
var Executor = require('../lib/Executor.js');
var events = require('events');
var eventEmitter = new events.EventEmitter();

suite('Executor', function(){
    var sut, callback, spawn;

    setup(function(){
        spawn = sinon.stub();
        spawn.returns(eventEmitter);
        sut = new Executor(spawn);
    });

    suite('#exec', function(){
        test('Should execute the script in first arg as many times as second arg', function(){
            sut.exec("/tmp/notExistingFile", 10);
            for(var x=0; x < 10; x++) {
                eventEmitter.emit("close");
            }
            sinon.assert.callCount(spawn, 10);
        });
    });
});


