
var _ = require('underscore');

module.exports = format = {

    _caseInsensitiveSort: function(a, b) {
        return a.toLowerCase().localeCompare(b.toLowerCase());
    },

    newLocalizedStrings: function(lsInProject, lsInStringsFile, lsNotInStringsFile) {
        var localizedStrings = []
        if (lsNotInStringsFile.length > 0) { 
            localizedStrings.push('');
            localizedStrings.push('/* New strings */');
            var keys = lsNotInStringsFile.sort(format._caseInsensitiveSort)
            for (var i in keys) {
                var key = keys[i];
                localizedStrings.push(format.localizableString(key, lsInStringsFile));
            }
        }
        return localizedStrings;
    },

    ignoredLocalizedStrings: function(lsIgnored) {
        var localizedStrings = []
        var keys = Object.keys(lsIgnored).sort(format._caseInsensitiveSort)
        if (keys.length > 0) { 
            localizedStrings.push('');
            localizedStrings.push('/* Ignored strings */');
            for (var i in keys) {
                var key = keys[i];
                localizedStrings.push(format.localizableString(key, lsIgnored));
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
            var keys = lsInUse.sort(format._caseInsensitiveSort)
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
            var lsNotInUse = lsNotInProject.sort(format._caseInsensitiveSort);
            localizedStrings.push('');
            localizedStrings.push('/* Unused strings */');
            var keys = lsNotInUse.sort(format._caseInsensitiveSort)
            for (var i in keys) {
                var key = keys[i];
                localizedStrings.push(format.localizableString(key, lsInStringsFile));
            }
        }
        return localizedStrings;
    },

    localizableString: function(key, store) {
        var val = store[key]
        var val = val === undefined ? key : val;
        return '"' + key + '" = "' + val + '";';
    },

};

