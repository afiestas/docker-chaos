var sinon = require('sinon');
var assert = require('chai').assert;
var child_process = require('child_process');
var fs = require('fs');

suite('Test', function() {
    var sut, callback, exec, callCounter;

    suiteSetup(function(done) {
        var file = __dirname + '/docker-compose.yml';
        child_process.exec('docker-compose -f ' + file + ' build', function(err) {
            done(err);
        });
    });

    setup(function (done) {
        var file = __dirname + '/docker-compose.yml';
        child_process.exec('docker-compose -f ' + file + ' up -d', function(err) {
            done(err);
        });
    });

    function fileContains(file, word) {
        var con = fs.readFileSync(file);
        return con.toString().indexOf(word) !== -1;
    }

    function countOccurances(file, word) {
        var str = fs.readFileSync(file).toString();
        var regExp = new RegExp(word, "g");
        return (str.match(regExp) || []).length;
    }

    suite('#exec', function() {
		test('NormalPlan should have run all containers', function(done) {
            var plan = __dirname + '/data/NormalPlan.yml';
            var testExec = __dirname + '/sleep.sh';
            var logPath = '/tmp/test-chaos-' + (new Date().toISOString()) + '/';
            var command = '../docker-chaos.js --plan ' + plan + ' --logPath ' + logPath + ' --during 10000 ' + testExec;

            var process = child_process.exec(command, function(err, stdout, stderr) {
                if (err) {
                    done(err);
                }

                // Check if all 3 logs exist and they contain A, B and C
                assert.isTrue(fs.statSync(logPath + 'componenttest_imga_1').isFile());
                assert.isTrue(fs.statSync(logPath + 'componenttest_imgb_1').isFile());
                assert.isTrue(fs.statSync(logPath + 'componenttest_imgc_1').isFile());

                assert.isTrue(fileContains(logPath + 'componenttest_imga_1', 'A'));
                assert.isTrue(fileContains(logPath + 'componenttest_imgb_1', 'B'));
                assert.isTrue(fileContains(logPath + 'componenttest_imgc_1', 'C'));
                done();
            });
		});

		test.only('PlanAOnly should have only run A', function(done) {
            var plan = __dirname + '/data/PlanAOnly.yml';
            var testExec = __dirname + '/sleep.sh';
            var logPath = '/tmp/test-chaos-' + (new Date().toISOString()) + '/';
            var command = '../docker-chaos.js --plan ' + plan + ' --logPath ' + logPath + ' --during 20000 ' + testExec;

            console.log(command);
            var process = child_process.exec(command, function(err, stdout, stderr) {
                if (err) {
                    done(err);
                }

                assert.isTrue(fileContains(logPath + 'componenttest_imga_1', 'A'));
                assert.isFalse(fileContains(logPath + 'componenttest_imgb_1', 'START'));
                assert.isFalse(fileContains(logPath + 'componenttest_imgc_1', 'START'));

                done();
            });
		});

		test('PlanAScale should have run A twice', function(done) {
            var plan = __dirname + '/data/PlanAScale.yml';
            var testExec = __dirname + '/sleep.sh';
            var logPath = '/tmp/test-chaos-' + (new Date().toISOString()) + '/';
            var command = '../docker-chaos.js --plan ' + plan + ' --logPath ' + logPath + ' --during 10000 ' + testExec;

            var process = child_process.exec(command, function(err, stdout, stderr) {
                if (err) {
                    done(err);
                }

                assert.isTrue(fs.statSync(logPath + 'componenttest_imga_1').isFile());
                assert.isTrue(fs.statSync(logPath + 'componenttest_imgb_1').isFile());
                assert.isTrue(fs.statSync(logPath + 'componenttest_imgc_1').isFile());

                assert.isTrue(fs.statSync(logPath + 'componenttest_imga_2').isFile());
                assert.isFalse(fs.statSync(logPath + 'componenttest_imgb_2').isFile());
                assert.isFalse(fs.statSync(logPath + 'componenttest_imgc_2').isFile());

                assert.isTrue(fileContains(logPath + 'componenttest_imga_2', 'A'));
                done();
            });
		});
    });
});
