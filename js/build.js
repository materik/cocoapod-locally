
var extract = require('./extract');
var find = require('./find');
var format = require('./format');
var fs = require('fs');

module.exports = build = {

    exec: function(inputPath, pattern, outputFile, callback) {
        console.log('Extracting Localization data from \'' + inputPath + '\'...');

        find.localizedStringsInProject(inputPath, pattern, function(lsInProject) {
            find.localizedStringsInStringsFile(outputFile, function(lsInStringsFile) {
                var lsInStringsFileKeys = Object.keys(lsInStringsFile);
                var lsNotInStringsFile = extract.newLocalizedStrings(lsInProject, lsInStringsFileKeys);
                var lsNotInProject = extract.unusedLocalizedStrings(lsInProject, lsInStringsFileKeys);

                console.log('Setting up new localized strings...');

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
                localizedStrings.push('');
                localizedStrings.push('');
                localizedStrings = localizedStrings.join('\n');

                console.log('Writing to ' + outputFile);
                fs.writeFile(outputFile, localizedStrings, function(err) {
                    if (err) {
                        return console.log(err);
                    }

                    console.log('Done');
                    console.log('');

                    if (callback) {
                        callback();
                    }
                });
            });
        });
    },

};

