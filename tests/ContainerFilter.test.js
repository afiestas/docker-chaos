var sinon = require('sinon');
var assert = require('chai').assert;
var ContainerFilter = require('../lib/ContainerFilter');

suite('ContainerFilter', function(){
    var sut, containers, blacklist;

    setup(function(){
        blacklist = ['mongo', 'proxy'];
        containers = ['authentication', 'mongo', 'proxy'];
        sut = new ContainerFilter();
    });

    suite('#filter', function(){
        test('Should return a list of containers that are not in blacklist', function(){
            var r = sut.filter(containers, blacklist);
            assert.deepEqual(r, ['authentication']);
        });
    });
});




