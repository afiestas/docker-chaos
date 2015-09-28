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

var Docker = require('dockerode');
var fs = require('fs');

function DockerLogger (logPath, dockerInjected, fsInjected) {
    this.docker = dockerInjected || new Docker();
    this.fs = fsInjected || fs;
    // FIXME: Make sure logPath exists!
    // How to make sure logPath is specified?
    this.logPath = logPath;
    this.containers = [];
}

DockerLogger.prototype.start = function(callback) {
    this.update(callback);
};

DockerLogger.prototype.__startLoggingContainer = function(containerInfo, callback) {
    var name = containerInfo.Names[0];
    if (name[0] === '/') {
        name = name.substr(1);
    }

    var self = this;
    var container = this.docker.getContainer(containerInfo.Id);
    container.logs({stream: true, stdout: true, stderr: true}, function(err, stream) {
        if (err) {
            console.log("Docker Attach Error: " + err);
            return;
        }

        var path = self.logPath + '/' + name;
        var fsStream = self.fs.createWriteStream(path, {flags: 'a'});
        stream.pipe(fsStream);

        callback();
    });
};

DockerLogger.prototype.stop = function() {
    this.docker = null;
};

DockerLogger.prototype.update = function(callback) {
    var self = this;
    this.docker.listContainers(function(err, containers) {
        if (err) {
            callback(err);
            return;
        }

        containers.forEach(function(containerInfo) {
            // if already exists!
            var index = self.containers.map(function(e) { return e.Id; }).indexOf(containerInfo.Id);

            if (index === -1) {
                self.__startLoggingContainer(containerInfo, function() {});
            }
        });
        self.containers = containers;

        callback();
    });
};

module.exports = DockerLogger;
