
var _ = require('underscore');

module.exports = extract = {

    _argument: function(i) {
        var args = process.argv;
        if (i > 0 && i < args.length) {
            return args[i];
        }
    },

    _indexOfArgument: function(flag, i) {
        return process.argv.indexOf(flag, i) + 1;
    },

    argument: function(flag, required) {
        var i = extract._indexOfArgument(flag);
        var arg = extract._argument(i);
        if (arg) {
            return arg;
        } else if (required) {
            throw ('Need to set ' + flag);
        }
    },

    arguments: function(flag, required) {
        var i = 0;
        var args = [];
        while (true) {
            i = extract._indexOfArgument(flag, i);
            var arg = extract._argument(i);
            if (arg) {
                args.push(arg)
            } else {
                break
            }
        }
        return args;
    },

    newLocalizedStrings: function(lsInProject, lsInStringsFile) {
        var newLs = _.uniq(_.difference(lsInProject, lsInStringsFile));
        var newLsCount = newLs.length;
        if (newLsCount > 0) {
            console.log('Found ' + newLsCount + ' new string(s):');
            console.log(newLs);
        }
        return newLs;
    },

    unusedLocalizedStrings: function(lsInProject, lsInStringsFile) {
        var unusedLs = _.difference(lsInStringsFile, lsInProject);
        var unusedLsCount = unusedLs.length;
        if (unusedLsCount > 0) {
            console.log('Found ' + unusedLsCount + ' unused string(s):');
            console.log(unusedLs);
        }
        return unusedLs;
    },

};

