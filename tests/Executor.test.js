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
                callback();
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


