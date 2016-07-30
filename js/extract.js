
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
        if (args) {
            return args;
        } else if (required) {
            throw ('Need to set ' + flag);
        }
    },

    newLocalizedStrings: function(lsInProject, lsInStringsFile, ignore) {
        return _.uniq(_.difference(_.difference(lsInProject, lsInStringsFile), ignore));
    },

    unusedLocalizedStrings: function(lsInProject, lsInStringsFile, ignore) {
        return _.difference(_.difference(lsInStringsFile, lsInProject), ignore);
    },

};

