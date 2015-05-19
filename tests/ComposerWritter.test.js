var sinon = require('sinon');
var assert = require('chai').assert;
var ComposerSplitter = require('../lib/ComposerSplitter');
var ComposerWritter = require('../lib/ComposerWritter');

suite('ComposerWritter', function(){
    var sut, splitter;

    var line = 'some debug line';

    setup(function(){
        splitter = sinon.stub(new ComposerSplitter());
        sut = new ComposerWritter(splitter);
    });

    suite('#write', function(){
        test('Should call this.splitter.split forwarding the line', function(){
            sut.write(line);
            sinon.assert.calledWith(splitter.split, line);
        });
    });
});




