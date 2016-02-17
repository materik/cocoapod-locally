
var utils = require('./utils');

module.exports = extract = {
   
    argument: function(flag, required) {
        var val;
        var args = process.argv;
        var i = args.indexOf(flag);
        if (i >= 0 && i + 1 < args.length) {
            val = args[i + 1];
        } else if (required) {
            throw ('Need to set ' + flag);
        }
        return val;
    },

    newLocalizedStrings: function(lsInProject, lsInStringsFile) {
        var newLs = utils.diff(lsInProject, lsInStringsFile);
        var newLsCount = newLs.length;
        if (newLsCount > 0) {
            console.log('Found ' + newLsCount + ' new string(s):');
            console.log(newLs);
        }
        return newLs;
    },

    unusedLocalizedStrings: function(lsInProject, lsInStringsFile) {
        var unusedLs = utils.diff(lsInStringsFile, lsInProject);
        var unusedLsCount = unusedLs.length;
        if (unusedLsCount > 0) {
            console.log('Found ' + unusedLsCount + ' unused string(s):');
            console.log(unusedLs);
        }
        return unusedLs;
    },

};

