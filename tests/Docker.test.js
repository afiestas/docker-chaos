var sinon = require('sinon');
var assert = require('chai').assert;
var Docker = require('../lib/Docker');

suite('Docker', function(){
    var sut, composefile, modifications, exec, callback;

    setup(function(){
        modifications = [{auth: 1}, {mongodb: 2}];
        composefile = __dirname + '/data/docker-compose.yml';

        exec = sinon.stub();
        callback = sinon.spy();
        sut = new Docker(exec);
    });

    suite('#modify', function(){
        test('Should execute docker-compose correctly', function(){
            sut.modify(composefile, modifications);
            sinon.assert.calledWith(exec, "docker-compose --file " + composefile + " scale auth=1 mongodb=2 ");
        });
        test('Should execute callback forwarding any errors and output', function(){
            var code = 33, stdout = "some stdout", stderr = "some stderr";
            exec.yields(code, stdout, stderr);
            sut.modify(composefile, modifications, callback);

            sinon.assert.calledWithExactly(callback, code, stdout, stderr);
        });
        test('Should execute callback passing null if everything went ok', function(){
            exec.yields(null);
            sut.modify(composefile, modifications, callback);

            sinon.assert.calledWithExactly(callback, null);
        });
    });
});






