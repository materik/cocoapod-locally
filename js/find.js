
var child_process = require('child_process');

var KEY_IN_STRINGS_FILE_PATTERN = '\"([^\"]*)\" = \"[^\"].*\";';
var VAL_IN_STRINGS_FILE_PATTERN = '\"[^\"]*\" = \"([^\"].*)\";';

module.exports = find = {

    _localizedStringsInProject: function(filepath, regex, callback) {
        var cmd = 'grep -oh "' + regex + '" -r ' + filepath;
        regex = regex.replace(/\(/g, '\\(')
        regex = regex.replace(/\)/g, '\\)')
        regex = regex.replace(/\\\\\(/, '(');
        regex = regex.replace(/\\\\\)/, ')');
        find.localizedStrings(cmd, regex, null, callback);
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
        child_process.exec(cmd, function(err, stdout, stderr) {
            if (err) {
                console.log('> ' + cmd);
                return console.log(err);
            }

            var localizedStringsArr = []
            var localizedStringsDict = {};
            var strings = stdout.split('\n');

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

