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
var yaml = require('js-yaml');
var Compose = require('./Compose');

function ComposeFileParser () {

}

ComposeFileParser.prototype.parse = function(file, callback) {
    var composeFile;
    try {
        composeFile = yaml.safeLoad(fs.readFileSync(file, 'utf8'));
    } catch (e) {
        callback(e);
        return;
    }

    var containers = [];
    for (var key in composeFile) {
        if (!composeFile.hasOwnProperty(key)) {
            continue;
        }
        containers.push(key);
    }

    var compose = new Compose();
    compose.setContainers(containers);

    callback(false, compose);
};


module.exports = ComposeFileParser;

