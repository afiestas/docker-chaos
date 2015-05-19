var sinon = require('sinon');
var assert = require('chai').assert;
var ComposerSplitter = require('../lib/ComposerSplitter');

suite('ComposerSplitter', function(){
    var sut;

    var component = 'authentication_1';
    var line = '[2015-05-16 14:22:20.744] [DEBUG] MongoPersistence';
    var str = ' [32m' + component + ' | ' + line;
    setup(function(){
        sut = new ComposerSplitter();
    });

    suite('#split', function(){
        test('Should return an object with component and line', function(){
            var r = sut.split(str);
            assert.deepEqual(r, {component: component, line: line});
        });
    });
});





