
var _ = require('underscore');
var child_process = require('child_process');
var diff = require('file-compare').compare;
var expect = require('chai').expect;
var fs = require('fs');
var ncp = require('ncp').ncp;

var reset = function(step, callback) {
    resetLang('en', step, function() {
        resetLang('sv', step, function() {
            resetImplementationFile(step, callback);
        });
    });
}

var resetLang = function(lang, step, callback) {
    var localizableFile = lang + '.lproj/Localizable.strings';
    var testFile = './test/' + step + '/Before/' + localizableFile;
    var demoFile = './demo/Demo/' + localizableFile;
    child_process.exec('cp ' + testFile + ' ' + demoFile, function(err) {
        expect(err).to.be.null;
        callback();
    });
}

var resetImplementationFile = function(step, callback) {
    var file = 'ViewController.m';
    var testFile = './test/' + step + '/' + file;
    var demoFile = './demo/Demo/' + file;
    child_process.exec('cp ' + testFile + ' ' + demoFile, function(err) {
        expect(err).to.be.null;
        callback();
    });
}

var compare = function(step, callback) {
    compareLang('en', step, function() {
        compareLang('sv', step, callback);
    });
}

var compareLang = function(lang, step, callback) {
    var localizableFile = lang + '.lproj/Localizable.strings';
    var testFile = './test/' + step + '/After/' + localizableFile;
    var demoFile = './demo/Demo/' + localizableFile;
    diff(testFile, demoFile, function(result) {
        if (!result) {
            console.log(testFile + ' != ' + demoFile);
            console.log('==============');
            console.log(fs.readFileSync(demoFile, 'utf8'));
            console.log('==============');
            console.log();
        }

        expect(result).to.be.true;
        callback();
    });
}

var run = function(callback) {
    child_process.exec('npm run demo', function(err, stdout) {
        expect(err).to.be.null;
        callback();
    });
}

describe('compare', function() {

    after(function(callback) { reset('1', callback); });

    it('run once', function(callback) {
        reset('1', function() {
            run(function() {
                compare('1', callback);
            });
        });
    });

    it('run twice', function(callback) {
        reset('2', function() {
            run(function() {
                run(function() {
                    compare('2', callback);
                });
            });
        });
    });

    it('run while missing ignored strings', function(callback) {
        reset('3', function() {
            run(function() {
                compare('3', callback);
            });
        });
    });

    it('run with empty strings in the Localizable file', function(callback) {
        reset('4', function() {
            run(function() {
                compare('4', callback);
            });
        });
    });

    it('run with sorted result', function(callback) {
        reset('5', function() {
            run(function() {
                compare('5', callback);
            });
        });
    });

});

