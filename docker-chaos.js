#!/usr/bin/env node

var fs = require('fs');
var nopt = require("nopt");
var ChaosPlanFactory = require('./lib/ChaosPlanFactory');
var ChaosPlanExecutor = require('./lib/ChaosPlanExecutor');
var DockerLogger = require('./lib/DockerLogger');
var Executor = require('./lib/Executor');

var knownOpts = {
    "file" : [String],
    "plan": [String],
    "logPath": [String],
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

var logPath = '/tmp/logs-' + (new Date().toISOString());
if (options.logPath) {
    logPath = options.logPath;
    if (fs.existsSync(logPath)){
        console.log("Log path " + logPath + " already exists. Aborting");
        process.exit(1);
    }
}
fs.mkdirSync(logPath);

console.log("Going to execute:\n    ", command);
console.log("While creating chaos with:\n    ", planFile);
console.log("In docker-compose:\n    ", dockerComposeFile);
console.log("Logs:\n    ", logPath);

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

var dockerLogger = new DockerLogger(logPath);
dockerLogger.start(function() {});

var chaosPlanExecutor = new ChaosPlanExecutor();
chaosPlanExecutor.exec(dockerComposeFile, chaosPlan);
chaosPlanExecutor.on('dockerContainersChanged', function() {
    dockerLogger.update(function() {});
});

setTimeout(function() {
    console.log("Stopping execution");
    executor.stop();
    chaosPlanExecutor.stop();
    dockerLogger.stop();
    process.exit(0);
}, during);
