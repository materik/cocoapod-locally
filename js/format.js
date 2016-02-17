
module.exports = format = {

    inUseLocalizedStrings: function(lsInProject, lsInStringsFile, lsNotInStringsFile) {
        var localizedStrings = []
        var lsInStringsFileKeys = Object.keys(lsInStringsFile);
        var lsStillInProject = utils.intersect(lsInStringsFileKeys, lsInProject);
        var lsInUse = lsStillInProject.concat(lsNotInStringsFile).sort();
        localizedStrings.push('');
        localizedStrings.push('/* Localized strings */');
        for (var i in lsInUse) {
            var key = lsInUse[i];
            localizedStrings.push(format.localizableString(key, lsInStringsFile));
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

