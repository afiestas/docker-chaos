var sinon = require('sinon');
var assert = require('chai').assert;
var Scaler = require('../lib/Scaler');

suite('Scaler', function(){
    var sut, file, containers, callback;
    var implementation;

    setup(function(){
        implementation = {modify: sinon.spy()};
        containers = [{auth: 1}, {mongodb: 2}];
        file = 'some-file';

        callback = function(){};
        sut = new Scaler(implementation);
    });

    suite('#scale', function(){
        test('Should forward call to implementation', function(){
            sut.scale(file, containers, callback);
            sinon.assert.calledWithExactly(implementation.modify, file, containers, callback);
        });
    });
});







