
var _ = require('underscore');

module.exports = format = {

    newLocalizedStrings: function(lsInProject, lsInStringsFile, lsNotInStringsFile) {
        var localizedStrings = []
        if (lsNotInStringsFile.length > 0) { 
            localizedStrings.push('');
            localizedStrings.push('/* New strings */');
            var keys = lsNotInStringsFile.sort()
            for (var i in keys) {
                var key = keys[i];
                localizedStrings.push(format.localizableString(key, lsInStringsFile));
            }
        }
        return localizedStrings;
    },

    inUseLocalizedStrings: function(lsInProject, lsInStringsFile) {
        var localizedStrings = []
        var lsInStringsFileKeys = Object.keys(lsInStringsFile);
        var lsInUse = _.intersection(lsInStringsFileKeys, lsInProject);
        if (lsInUse.length > 0) { 
            localizedStrings.push('');
            localizedStrings.push('/* Used strings */');
            var keys = lsInUse.sort()
            for (var i in keys) {
                var key = keys[i];
                localizedStrings.push(format.localizableString(key, lsInStringsFile));
            }
        }
        return localizedStrings;
    },

    notInUseLocalizedStrings: function(lsInProject, lsInStringsFile, lsNotInProject) {
        var localizedStrings = []
        if (lsNotInProject.length > 0) { 
            var lsNotInUse = lsNotInProject.sort();
            localizedStrings.push('');
            localizedStrings.push('/* Unused strings */');
            var keys = lsNotInUse.sort()
            for (var i in keys) {
                var key = keys[i];
                localizedStrings.push(format.localizableString(key, lsInStringsFile));
            }
        }
        return localizedStrings;
    },

    localizableString: function(key, store) {
        var val = store[key] || key;
        return '"' + key + '" = "' + val + '";';
    },

};

