
var _ = require('underscore');
var child_process = require('child_process');

var KEY_IN_STRINGS_FILE_PATTERN = '\"([^\"]*)\" = \"[^\"].*\";';
var VAL_IN_STRINGS_FILE_PATTERN = '\"[^\"]*\" = \"([^\"].*)\";';

module.exports = find = {

    _exec: function(cmd, callback) {
        child_process.exec(cmd, function(err, stdout, stderr) {
            if (err) {
                console.log('> ' + cmd);
                return console.log(err);
            }

            var strings = stdout.split('\n');
            strings.pop();

            callback(strings);
        });
    },

    _localizedStringsInProject: function(filepath, regex, callback) {
        var cmd = 'grep -oh "' + regex + '" -r ' + filepath;
        regex = regex.replace(/\(/g, '\\(')
        regex = regex.replace(/\)/g, '\\)')
        regex = regex.replace(/\\\\\(/, '(');
        regex = regex.replace(/\\\\\)/, ')');
        find.localizedStrings(cmd, regex, null, callback);
    },

    all: function(inputPath, outputFile, pattern, callback) {
        find.localizedStringsInProject(inputPath, _.clone(pattern), function(lsInProject) {
            find.localizedStringsInStringsFile(outputFile, function(lsInStringsFile) {
                find.ignoredLocalizedStringsInProject(inputPath, _.clone(pattern), function(lsIgnoredInProject) {
                    find.ignoredLocalizedStringsInStringsFile(outputFile, function(lsIgnoredInStringsFile) {
                        callback(lsInProject, lsInStringsFile, lsIgnoredInProject, lsIgnoredInStringsFile);
                    });
                });
            });
        });
    },

    ignoredLocalizedStringsInProject: function(filepath, regex, callback) {
        regex = regex.map(function(regex) {
            return regex + '.*// locally ignore:line.*$'
        });
        find.localizedStringsInProject(filepath, regex, callback);
    },

    ignoredLocalizedStringsInStringsFile: function(filepath, callback) {
        var cmd1 = 'cat ' + filepath + ' | grep -ne "\\/\\* Ignored strings \\*\\/" | cut -f 1 -d :';
        var cmd2 = 'cat ' + filepath + ' | grep -ne "\\/\\*.*\\*\\/" | cut -f 1 -d :';
        find._exec(cmd1, function(strings) {
            var startLineNumber = strings.pop();
            if (!startLineNumber) {
                return callback({});
            }
            find._exec(cmd2, function(strings) {
                var endLineNumber;
                while (headerLineNumber = strings.shift()) {
                    if (headerLineNumber == startLineNumber) {
                        endLineNumber = strings.shift();
                        break;
                    }
                }
                if (!endLineNumber) {
                    endLineNumber = '$';
                }
                var cmd = 'sed -n \'' + startLineNumber +
                          ',' + endLineNumber + 'p\' ' + filepath + ' ' +
                          '| grep "\\"[^\\"]*\\""';
                find.localizedStrings(cmd, KEY_IN_STRINGS_FILE_PATTERN,
                                           VAL_IN_STRINGS_FILE_PATTERN, callback);
            });
        });
    },

    localizedStringsInProject: function(filepath, regex, callback, lsInProject) {
        lsInProject = lsInProject || [];
        if (regex.length) {
            if (regex.push) {
                var r = regex.pop();
                find._localizedStringsInProject(filepath, r, function(_lsInProject) {
                    lsInProject = lsInProject.concat(_lsInProject);
                    find.localizedStringsInProject(filepath, regex, callback, lsInProject);
                });
            } else {
                find._localizedStringsInProject(filepath, regex, callback, lsInProject);
            }
        } else {
            callback(lsInProject);
        }
    },

    localizedStringsInStringsFile: function(filepath, callback) {
        var cmd = 'cat ' + filepath + ' | grep "\\"[^\\"]*\\""';
        find.localizedStrings(cmd, KEY_IN_STRINGS_FILE_PATTERN,
                                   VAL_IN_STRINGS_FILE_PATTERN, callback);
    },

    localizedStrings: function(cmd, keyRegex, valRegex, callback) {
        find._exec(cmd, function(strings) {
            var localizedStringsArr = []
            var localizedStringsDict = {};

            for (var i in strings) {
                var string = strings[i];
                if (string) {
                    var key = string.match(keyRegex);
                    if (key) {
                        key = key[1];
                        var val = string.match(valRegex);
                        if (val) {
                            localizedStringsDict[key] = val[1];
                        } else { 
                            localizedStringsArr.push(key);
                        }
                    }
                }
            }

            if (valRegex) {
                callback(localizedStringsDict);
            } else {
                callback(localizedStringsArr);
            }
        });
    },

};

