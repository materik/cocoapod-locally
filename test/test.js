
var _ = require('underscore');
var child_process = require('child_process');
var diff = require('file-compare').compare;
var expect = require('chai').expect;
var fs = require('fs');
var ncp = require('ncp').ncp;

var reset = function(callback) {
    resetLang('en', function() {
        resetLang('sv', function() {
            useImplementationFile(0, callback);
        });
    });
}

var resetLang = function(lang, callback) {
    var localizableFile = lang + '.lproj/Localizable.strings';
    var testFile = './test/0/' + localizableFile;
    var demoFile = './demo/Demo/' + localizableFile;
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
    var testFile = './test/' + step + '/' + localizableFile;
    var demoFile = './demo/Demo/' + localizableFile;
    diff(testFile, demoFile, function(result) {
        if (!result) {
            console.log(testFile + ' != ' + demoFile);
        }

        expect(result).to.be.true;
        callback();
    });
}

var useImplementationFile = function(step, callback) {
    var file = 'ViewController.m';
    var testFile = './test/' + step + '/' + file;
    var demoFile = './demo/Demo/' + file;
    child_process.exec('cp ' + testFile + ' ' + demoFile, function(err) {
        expect(err).to.be.null;
        callback();
    });
}

var run = function(callback) {
    child_process.exec('npm run demo', function(err) {
        expect(err).to.be.null;
        callback();
    });
}

describe('compare', function() {

    after(function(callback) { reset(callback); });
    beforeEach(function(callback) { reset(callback); });

    it('run locally once', function(callback) {
        useImplementationFile(1, function() {
            run(function() {
                compare('1', callback);
            });
        });
    });

    it('run locally twice', function(callback) {
        useImplementationFile(2, function() {
            run(function() {
                run(function() {
                    compare('2', callback);
                });
            });
        });
    });

    it('run locally while missing ignored strings', function(callback) {
        useImplementationFile(3, function() {
            run(function() {
                compare('3', callback);
            });
        });
    });

});

