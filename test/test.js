
var _ = require('underscore');
var child_process = require('child_process');
var diff = require('file-compare').compare;
var expect = require('chai').expect;
var fs = require('fs');

var setupTest = function(test, callback, langs) {
    langs = _.clone(langs) || ['en'];
    var lang = langs.pop();
    if (lang) {
        setupLang(lang, test, function() {
            setupTest(test, callback, langs);
        });
    } else {
        setupImplementationFile(test, callback);
    }
}

var setupLang = function(lang, test, callback) {
    var localizableFile = lang + '.lproj';
    var expectedFile = './test/' + test + '/Before/' + localizableFile;
    var actualFile = './test/Test/';
    child_process.exec('cp -r ' + expectedFile + ' ' + actualFile, function(err) {
        expect(err).to.be.null;
        callback();
    });
}

var setupImplementationFile = function(test, callback) {
    var file = 'ViewController.m';
    var expectedFile = './test/' + test + '/' + file;
    var actualFile = './test/Test/' + file;
    child_process.exec('cp -r ' + expectedFile + ' ' + actualFile, function(err) {
        expect(err).to.be.null;
        callback();
    });
}

var compare = function(test, callback, langs) {
    langs = _.clone(langs) || ['en'];
    var lang = langs.pop();
    if (lang) {
        compareLang(lang, test, function() {
            compare(test, callback, langs);
        });
    } else {
        callback();
    }
}

var compareLang = function(lang, test, callback) {
    var localizableFile = lang + '.lproj/Localizable.strings';
    var expectedFile = './test/' + test + '/After/' + localizableFile;
    var actualFile = './test/Test/' + localizableFile;
    diff(expectedFile, actualFile, function(result) {
        if (!result) {
            var expectedFileContent = fs.readFileSync(expectedFile, 'utf8');
            var actualFileContent = fs.readFileSync(actualFile, 'utf8');
            expect(actualFileContent).to.be.eql(expectedFileContent);
        }
        callback();
    });
}

var run = function(callback, langs) {
    langs = _.clone(langs) || ['en'];
    var bin = './bin/locally.js';
    var input = 'test/Test';
    var outputs = langs.map(function(lang) {
        return 'test/Test/' + lang + '.lproj/Localizable.strings';
    });
    var output = outputs.join(' -o ');
    var cmd = bin + ' -i ' + input + ' -o ' + output;
    child_process.exec(cmd, function(err, stdout) {
        expect(err).to.be.null;
        callback();
    });
}

var runSimpleTest = function(test, callback, langs) {
    langs = _.clone(langs) || ['en'];
    setupTest(test, function() {
        run(function() {
            compare(test, callback);
        }, langs);
    }, langs);
}

describe('compare', function() {

    before(function(callback) { child_process.exec('mkdir test/Test', callback); });
    after(function(callback) { child_process.exec('rm -r test/Test', callback); });

    it('once', function(callback) {
        runSimpleTest('1', callback);
    });

    it('twice', function(callback) {
        setupTest('2', function() {
            run(function() {
                run(function() {
                    compare('2', callback);
                });
            });
        });
    });

    it('while missing ignored strings', function(callback) {
        runSimpleTest('3', callback);
    });

    it('with empty strings in the Localizable file', function(callback) {
        runSimpleTest('4', callback);
    });

    it('with sorted result', function(callback) {
        runSimpleTest('5', callback);
    });

    it('with quotes in the localized value', function(callback) {
        runSimpleTest('6', callback);
    });

    it('with to localization expressions on the same line', function(callback) {
        runSimpleTest('7', callback);
    });

    it('multiple languages', function(callback) {
        runSimpleTest('8', callback, ['en', 'sv', 'es']);
    });

    it('multiple input', function(callback) {
        setupTest('9', function() {
            var cmd = './bin/locally.js ' +
                      '-i test/Test ' +
                      '-i test/9 ' +
                      '-o test/Test/en.lproj/Localizable.strings';
            child_process.exec(cmd, function(err, stdout) {
                expect(err).to.be.null;
                compare('9', callback);
            });
        });
    });

    it('multiple patterns', function(callback) {
        setupTest('10', function() {
            var cmd = './bin/locally.js ' +
                      '-i test/Test ' +
                      '-o test/Test/en.lproj/Localizable.strings ' +
                      '-p "().localize"';
            child_process.exec(cmd, function(err, stdout) {
                expect(err).to.be.null;
                compare('10', callback);
            });
        });
    });

});

