
var child_process = require('child_process');

var KEY_IN_STRINGS_FILE_PATTERN = '\"([^\"]*)\" = \"[^\"].*\";';
var VAL_IN_STRINGS_FILE_PATTERN = '\"[^\"]*\" = \"([^\"].*)\";';

module.exports = find = {

    localizedStringsInProject: function(filepath, regex, callback) {
        var cmd = 'grep -oh "' + regex + '" -r ' + filepath;
        regex = regex.replace(/\(/g, '\\(')
        regex = regex.replace(/\)/g, '\\)')
        regex = regex.replace(/\\\\\(/, '(');
        regex = regex.replace(/\\\\\)/, ')');
        find.localizedStrings(cmd, regex, null, callback);
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

