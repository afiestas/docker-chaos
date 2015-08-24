#!/usr/bin/env node

var fs = require('fs');
var nopt = require("nopt");
var ComposerLogger = require('./lib/ComposerLogger');
var ChaosPlanFactory = require('./lib/ChaosPlanFactory');
var ChaosPlanExecutor = require('./lib/ChaosPlanExecutor');
var Executor = require('./lib/Executor');

var knownOpts = {
    "file" : [String],
    "plan": [String],
    "during": [Number]
};
var shortHands = {};

var options = nopt(knownOpts, shortHands, process.argv);

var dockerComposeFile, planFile, command, during;

if (!options.during) {
    options.during =  30000;
}

during = options.during;
if (!options.file) {
    options.file = process.cwd() + '/docker-compose.yml';
}
dockerComposeFile = fs.realpathSync(options.file);

if (!options.plan) {
    console.log("A plan file is needed so we know where to create chaos");
    process.exit(1);
}

planFile = fs.realpathSync(options.plan);

var command = fs.realpathSync(options.argv.remain[0]);

if (!command) {
    console.log("you need to pass the command to be executed");
    process.exit(1);
}

console.log("Going to execute:\n    ", command);
console.log("While creating chaos with:\n    ", planFile);
console.log("In docker-compose:\n    ", dockerComposeFile);

var planData = fs.readFileSync(planFile);

var chaosPlanFactory = new ChaosPlanFactory();
var chaosPlan = chaosPlanFactory.getChaosPlan(planData);

var executor = new Executor();
executor.exec(command);

var exitCode = 0;
process.on('beforeExit', function() {
    process.exit(exitCode);
});

executor.on('error', function(stderr, stdout) {
    exitCode = 1;
    console.log(stderr, stdout);
});

var composerLogger = new ComposerLogger();
composerLogger.start();

var chaosPlanExecutor = new ChaosPlanExecutor();
chaosPlanExecutor.exec(dockerComposeFile, chaosPlan);

setTimeout(function() {
    console.log("Stopping execution");
    executor.stop();
    chaosPlanExecutor.stop();
    composerLogger.stop();
}, during);