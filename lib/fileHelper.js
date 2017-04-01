// extFile.js.
// Functions operator file
(function () {
    'use strict';

    var fs = require('fs');
    var fsE = require('fs-extra')
    var path = require('path');

    var isNullLineOrCommentLine = function (line) {
        if (!line || line == '') {
            return true;
        }

        return /^#.*/.test(line);
    };

    var createDictionaryIfNotExist = function (pathStr) {
        //fsE.mkdirs(pathStr);
        fsE.mkdirsSync(pathStr);
    };

    var readFileSync = function (filePath, encoding) {
        if (!encoding) {
            encoding = 'utf8';
        }
        return fs.readFileSync(filePath, encoding);
    };

    var readAllLinesSync = function (filePath) {
        var lines = [];
        var content = '';
        content = readFileSync(filePath, 'ASCII');

        lines = content.split('\r\n');
        return lines
    };

    var readAllLinesAsync = function (filePath, callback) {
        var container = [];
        var remaining = '';

        var input = fs.createReadStream(filePath);
        input.on('data', function (data) {
            remaining += data;
        });

        input.on('end', function () {
            if (remaining.length > 0) {
                container = remaining.split('\r\n');
                callback(container);
            }
        });
    };

    var writeFileSync = function (filePath, data) {
        var dir = path.dirname(filePath);
        createDictionaryIfNotExist(dir);

        fs.writeFileSync(filePath, data);
    };

    var appendFileSync = function (filePath, data) {
        var dir = path.dirname(filePath);
        createDictionaryIfNotExist(dir);
        //browser.sleep(1000*5);
        fs.appendFileSync(filePath, data);
    };

    var readDirFilesSync = function (path, filesList, isAll, processFun, isIgnoreFun) {
        var files = fs.readdirSync(path);
        files.forEach(walk);
        function walk(file) {
            var fullPath = path + '/' + file;

            // is need to ignore
            if (isIgnoreFun && isIgnoreFun(fullPath)) {
                return;
            }

            // do somthing
            if (processFun) {
                processFun(fullPath);
            }

            var states = fs.statSync(fullPath);
            if (states.isDirectory() && (isAll === true)) {
                readDirFilesSync(fullPath, filesList, isAll, processFun, isIgnoreFun);
            }
            else {
                var obj = new Object();
                obj.size = states.size;
                obj.name = file;
                obj.path = fullPath;
                filesList.push(obj);
            }
        }
    }

    var getAllFiles = function (path, processFun, isIgnoreFun) {
        var filesList = [];
        readDirFilesSync(path, filesList, true, processFun, isIgnoreFun);
        return filesList;
    };

    module.exports = {
        // read content from file
        readFileSync: readFileSync,
        readAllLinesSync: readAllLinesSync,
        readAllLinesAsync: readAllLinesAsync,
        // write content into file
        writeFileSync: writeFileSync,
        appendFileSync: appendFileSync,
        // get file under specified path
        readDirFilesSync: readDirFilesSync,
        getAllFiles: getAllFiles,
        // others
        createDictionaryIfNotExist: createDictionaryIfNotExist,
        isNullLineOrCommentLine: isNullLineOrCommentLine,
    };

})();