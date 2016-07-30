
var extract = require('./extract');
var find = require('./find');
var format = require('./format');
var fs = require('fs');

module.exports = build = {

    exec: function(inputPath, pattern, outputFile, callback) {
        find.all(inputPath, outputFile, pattern,
                function(lsInProject, lsInStringsFile,
                    lsIgnoredInProject, lsIgnoredInStringsFile) {
                var lsInStringsFileKeys = Object.keys(lsInStringsFile);
                var lsIgnoredInStringsFileKeys = Object.keys(lsIgnoredInStringsFile);

                build.logIgnoredLocalizedStrings(lsIgnoredInProject, lsIgnoredInStringsFileKeys);

                var lsNotInStringsFile =
                extract.newLocalizedStrings(lsInProject, lsInStringsFileKeys, lsIgnoredInProject);
                var lsNotInProject = extract.unusedLocalizedStrings(lsInProject, lsInStringsFileKeys, lsIgnoredInStringsFileKeys);

                var localizedStrings = [];
                localizedStrings = localizedStrings.concat(
                    format.newLocalizedStrings(lsInProject, lsInStringsFile,
                        lsNotInStringsFile)
                );
                localizedStrings = localizedStrings.concat(
                    format.inUseLocalizedStrings(lsInProject, lsInStringsFile)
                );
                localizedStrings = localizedStrings.concat(
                    format.notInUseLocalizedStrings(lsInProject, lsInStringsFile,
                        lsNotInProject)
                );
                localizedStrings = localizedStrings.concat(
                    format.ignoredLocalizedStrings(lsIgnoredInStringsFile)
                );
                localizedStrings.push('');
                localizedStrings = localizedStrings.join('\n');

                console.log('Writing to ' + outputFile);
                fs.writeFile(outputFile, localizedStrings, function(err) {
                    if (err) {
                        return console.log(err);
                    }
                    if (callback) {
                        callback();
                    }
                });
            }
        );
    },

    logIgnoredLocalizedStrings: function(ignoredLocalizedStringsInProject,
                                         ignoredLocalizedStringsInStringsFile) {
        var inProjectCount = ignoredLocalizedStringsInProject.length;
        var inStringsFileCount = ignoredLocalizedStringsInStringsFile.length;
        if (inProjectCount > 0) {
            console.log('Found ' + inProjectCount + ' ignored string(s) in the project:');
        }
        if (inStringsFileCount > 0) {
            console.log('Found ' + inStringsFileCount + ' ignored string(s) in the Localizable file:');
        }
    },

};

