/**
 * The MIT License (MIT)
 *
 * Copyright (c) <2015> <Àlex Fiestas afiestas@kde.org>
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 **/

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

		test('PlanAOnly should have only run A', function(done) {
            var plan = __dirname + '/data/PlanAOnly.yml';
            var testExec = __dirname + '/sleep.sh';
            var logPath = '/tmp/test-chaos-' + (new Date().toISOString()) + '/';
            var command = '../docker-chaos.js --plan ' + plan + ' --logPath ' + logPath + ' --during 20000 ' + testExec;

            var process = child_process.exec(command, function(err, stdout, stderr) {
                if (err) {
                    done(err);
                }

                var a = countOccurances(logPath + 'componenttest_imga_1', 'A');
                var b = countOccurances(logPath + 'componenttest_imgb_1', 'B');
                var c = countOccurances(logPath + 'componenttest_imgc_1', 'C');

                assert.equal(a, 1);
                assert.isTrue(b > 1);
                assert.isTrue(c > 1);

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
                assert.isTrue(fileContains(logPath + 'componenttest_imga_2', 'A'));

                done();
            });
		});
    });
});
