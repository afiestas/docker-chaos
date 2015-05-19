var sinon = require('sinon');
var assert = require('chai').assert;
var ComposerLogger = require('../lib/ComposerLogger');
var ComposerWritter = require('../lib/ComposerWritter');
var ComposerProcess = require('../lib/ComposerProcess');

suite('ComposerLogger', function(){
    var sut, process, writter, line;

    setup(function(){
        line = 'some line';
        process = new ComposerProcess();
        process.start = sinon.stub();

        writter = sinon.stub(new ComposerWritter());

        sut = new ComposerLogger(process, writter);
    });

    suite('#start', function(){
        test('Should call this.composerprocess.start', function(){
            sut.start();
            sinon.assert.calledOnce(process.start);
        });
        test('Should call this.writter.write on each line event by process', function(){
            sut.start();
            process.emit('line', line);
            sinon.assert.calledWith(writter.write, line);
        });
    });
});





