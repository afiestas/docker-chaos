var sinon = require('sinon');
var assert = require('chai').assert;
var Docker = require('../lib/Docker');

suite('Docker', function(){
    var sut, composefile, modifications, exec;

    setup(function(){
        modifications = [{auth: 1}, {mongodb: 2}];
        composefile = __dirname + '/data/docker-compose.yml';

        exec = sinon.stub();
        sut = new Docker(exec);
    });

    suite('#modify', function(){
        test('Should execute docker-compose correctly', function(){
            sut.modify(composefile, modifications);
            sinon.assert.calledWithExactly(exec, "docker-compose --file " + composefile + " scale auth=1 mongodb=2 ");
        });
    });
});






