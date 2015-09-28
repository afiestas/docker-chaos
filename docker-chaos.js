#!/usr/bin/env node

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

var fs = require('fs');
var nopt = require("nopt");
var ChaosPlanFactory = require('./lib/ChaosPlanFactory');
var ChaosPlanExecutor = require('./lib/ChaosPlanExecutor');
var DockerLogger = require('./lib/DockerLogger');
var Executor = require('./lib/Executor');
var clc = require('cli-color');
var Spinner = require('cli-spinner').Spinner;

var knownOpts = {
    "composeFile" : [String],
    "plan": [String],
    "logPath": [String],
    "duration": [Number]
};
var shortHands = {};

var options = nopt(knownOpts, shortHands, process.argv);

var dockerComposeFile, planFile, command, duration;

if (!options.duration) {
    options.duration =  30000;
}

duration = options.duration;
if (!options.composeFile) {
    options.composeFile = process.cwd() + '/docker-compose.yml';
}
try {
    dockerComposeFile = fs.realpathSync(options.composeFile);
} catch (err) {
    console.log("A docker-compose.yml file could not be found");
    process.exit(1);
}

if (!options.plan) {
    console.log("A plan file is needed so we know where to create chaos");
    process.exit(1);
}

planFile = fs.realpathSync(options.plan);

//
// Command
//
var command = options.argv.remain[0];
if (!command) {
    console.log("you need to pass the command to be executed");
    process.exit(1);
}

command = command.split(' ');
var prog = fs.realpathSync(command.shift());
command = command.length === 1 ? prog : prog + ' ' + command.join(' ');

//
// Log Path
//
var logPath = '/tmp/logs-' + (new Date().toISOString());
if (options.logPath) {
    logPath = options.logPath;
    if (fs.existsSync(logPath)){
        console.log("Log path " + logPath + " already exists. Aborting");
        process.exit(1);
    }
}
fs.mkdirSync(logPath);

console.log(clc.whiteBright('Test:'), clc.white(command));
console.log(clc.whiteBright('Chaos Plan:'), clc.white(planFile));
console.log(clc.whiteBright('Docker-compose:'), clc.white(dockerComposeFile));
console.log(clc.whiteBright('Logs:'), clc.white(logPath));
console.log();

var planData = fs.readFileSync(planFile);

var chaosPlanFactory = new ChaosPlanFactory();
var chaosPlan = chaosPlanFactory.getChaosPlan(planData);

var exitCode = 0;
var executor = new Executor();

var spinner = new Spinner('Running ... ');

executor.on('start', function() {
    spinner.start();
});
executor.on('pass', function() {
    console.log(clc.green("Passed"));
    spinner.stop();
});
executor.on('fail', function(stdout, stderr) {
    exitCode = 1;
    console.log(clc.red("Failed"));
    if (stdout.length) {
        console.log(stdout);
    }
    if (stderr.length) {
        console.log(stderr);
    }
    spinner.stop();
});
executor.exec(command);

process.on('beforeExit', function() {
    process.exit(exitCode);
});

var dockerLogger = new DockerLogger(logPath);
dockerLogger.start(function() {});

var chaosPlanExecutor = new ChaosPlanExecutor();
chaosPlanExecutor.exec(dockerComposeFile, chaosPlan);
chaosPlanExecutor.on('dockerContainersChanged', function() {
    dockerLogger.update(function() {});
});
chaosPlanExecutor.on('error', function(err) {
    console.log(err);
    process.exit(1);
});

setTimeout(function() {
    console.log("Stopping execution");
    executor.stop();
    chaosPlanExecutor.stop();
    dockerLogger.stop();
    process.exit(exitCode);
}, duration);
