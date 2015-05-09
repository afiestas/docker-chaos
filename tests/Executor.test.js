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
        test('If no limit is passed, execution should happen until stop is called', function(){
            sut.exec("/tmp/notExistingFile");
            for(var x=0; x < 15; x++) {
                if (x == 9) {
                    sut.stop();
                }
                eventEmitter.emit("close");
            }
            sinon.assert.callCount(spawn, 10);
        });
    });
});


