
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
                var lsNotInStringsFile =
                extract.newLocalizedStrings(lsInProject, lsInStringsFileKeys, lsIgnoredInProject);
                var lsNotInProject = extract.unusedLocalizedStrings(lsInProject, lsInStringsFileKeys, lsIgnoredInStringsFileKeys);
                
                build.log(lsInProject, lsInStringsFileKeys, lsNotInStringsFile, lsNotInProject, lsIgnoredInProject, lsIgnoredInStringsFileKeys);

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
                console.log();
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

    log: function(localizedStringsInProject, localizedStringsInStringsFile,
                  newLocalizedStrings, unusedLocalizedStrings,
                  ignoredLocalizedStringsInProject, ignoredLocalizedStringsInStringsFile) {
        var localizedStringsInProjectCount = localizedStringsInProject.length;
        var localizedStringsInStringsFileCount = localizedStringsInStringsFile.length;
        var newLocalizedStringsCount = newLocalizedStrings.length;
        var unusedLocalizedStringsCount = unusedLocalizedStrings.length;
        var ignoredLocalizedStringsInProjectCount = ignoredLocalizedStringsInProject.length;
        var ignoredLocalizedStringsInStringsFileCount = ignoredLocalizedStringsInStringsFile.length;
        if (localizedStringsInProjectCount > 0) {
            console.log('Found ' + localizedStringsInProjectCount + ' string(s) in the project');
        }
        if (localizedStringsInStringsFileCount > 0) {
            console.log('Found ' + localizedStringsInStringsFileCount + ' string(s) in the Localizable file');
        }
        if (newLocalizedStringsCount > 0) {
            console.log('Found ' + newLocalizedStringsCount + ' new string(s) in the project');
        }
        if (unusedLocalizedStringsCount > 0) {
            console.log('Found ' + unusedLocalizedStringsCount + ' unused string(s) in the Localizable file');
        }
        if (ignoredLocalizedStringsInProjectCount > 0) {
            console.log('Found ' + ignoredLocalizedStringsInProjectCount+ ' ignored string(s) in the project');
        }
        if (ignoredLocalizedStringsInStringsFileCount> 0) {
            console.log('Found ' + ignoredLocalizedStringsInStringsFileCount + ' ignored string(s) in the Localizable file');
        }
    },

};

