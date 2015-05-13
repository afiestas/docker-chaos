var sinon = require('sinon');
var assert = require('chai').assert;
var Scaler = require('../lib/Scaler');

suite('Scaler', function(){
    var sut, file, containers, callback;
    var implementation, random;

    setup(function(){
        random = function(){return 9;};

        implementation = {modify: sinon.spy()};
        containers = [{auth: 1}, {mongodb: 2}];
        file = 'some-file';

        callback = function(){};
        sut = new Scaler(implementation, random);
    });

    suite('#scale', function(){
        test('Should forward call to implementation', function(){
            sut.scale(file, containers, callback);
            sinon.assert.calledWithExactly(implementation.modify, file, containers, callback);
        });
        test('Should generate a random scale unmber if ? is found', function(){
            var containers = [{mongodb: '?'}];
            sut.scale(file, containers, callback);
            sinon.assert.calledWithExactly(implementation.modify, file, [{mongodb: 9}], callback);
        });
    });
    suite('#restore', function(){
        test('Should forward call to implementation setting all containers to 1', function(){
            sut.restore(file, containers, callback);
            var expContainers = [{auth: 1}, {mongodb: 1}];
            sinon.assert.calledWithExactly(implementation.modify, file, expContainers, callback);
        });
    });
});







