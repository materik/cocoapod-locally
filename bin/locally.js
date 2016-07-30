#!/usr/bin/env node

var _ = require('underscore');
var extract = require('../js/extract');
var build = require('../js/build');

var FLAG_INPUT = '-i';
var FLAG_OUTPUT = '-o';
var FLAG_PATTERN = '-p';
var DEFAULT_PATTERN = 'NSLocalizedString\(@\\\\?(), .*\)'
var WORD_REGEX = '\\"\\([^\\"]*\\)\\"';

// - FLAGS

// Input: -i
var inputPaths = extract.arguments(FLAG_INPUT, true);
_.each(inputPaths, function(inputPath) {
    console.log('Extracting Localization data from \'' + inputPath + '\'...');
});
var inputPath = inputPaths.join('|');

// Output: -o
var outputFiles = extract.arguments(FLAG_OUTPUT, true);

// Pattern: -p
var patterns = extract.arguments(FLAG_PATTERN, false);
patterns.push(DEFAULT_PATTERN)
patterns = patterns.map(function(pattern) {
    return pattern.replace('()', WORD_REGEX);
});

// - BUILD

_.each(outputFiles, function(outputFile) {
    build.exec(inputPath, patterns, outputFile);
});

