var sinon = require('sinon');
var assert = require('chai').assert;
var Compose = require('../lib/Compose.js');
var ComposeFileParser = require('../lib/ComposeFileParser.js');

suite('ComposeFileParser', function(){
    var sut, callback, containers;

    setup(function(){
        containers = ["authentication", "proxy", "mongodb", "rabbitmq", "ldap"];
        callback = sinon.stub();
        compose = sinon.stub();
        sut = new ComposeFileParser(compose);
    });

    suite('#parse', function(){
        test('On error, callback should we call with it', function(){
            sut.parse("/tmp/notExistingFile", callback);
            sinon.assert.called(callback);
        });
        test('On success a Compose object should be passed initialized', function(){
            sut.parse(__dirname + '/data/docker-compose.yml', callback);
            assert.deepEqual(callback.args[0][1].getContainers(), containers);
        });
    });
});

