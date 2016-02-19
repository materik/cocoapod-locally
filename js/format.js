
module.exports = format = {

    newLocalizedStrings: function(lsInProject, lsInStringsFile, lsNotInStringsFile) {
        var localizedStrings = []
        if (lsNotInStringsFile.length > 0) { 
            localizedStrings.push('');
            localizedStrings.push('/* New strings */');
            for (var i in lsNotInStringsFile) {
                var key = lsNotInStringsFile[i];
                localizedStrings.push(format.localizableString(key, lsInStringsFile));
            }
        }
        return localizedStrings;
    },

    inUseLocalizedStrings: function(lsInProject, lsInStringsFile) {
        var localizedStrings = []
        var lsInStringsFileKeys = Object.keys(lsInStringsFile);
        var lsInUse = utils.intersect(lsInStringsFileKeys, lsInProject);
        if (lsInUse.length > 0) { 
            localizedStrings.push('');
            localizedStrings.push('/* Used strings */');
            for (var i in lsInUse) {
                var key = lsInUse[i];
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
            for (var i in lsNotInUse) {
                var key = lsNotInUse[i];
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

