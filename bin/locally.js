#!/usr/bin/env node

var extract = require('../js/extract');
var build = require('../js/build');

var FLAG_INPUT = '-i';
var FLAG_OUTPUT = '-o';
var FLAG_PATTERN = '-p';
var DEFAULT_PATTERN = 'NSLocalizedString\(@\\\\?(), .*\)'
var WORD_REGEX = '\\"\\([^\\"]*\\)\\"';

var inputPath = extract.argument(FLAG_INPUT, true);
var outputFile = extract.argument(FLAG_OUTPUT, true);
var patterns = extract.arguments(FLAG_PATTERN, false);
patterns.push(DEFAULT_PATTERN)
patterns = patterns.map(function(pattern) {
    return pattern.replace('()', WORD_REGEX);
});

build.exec(inputPath, patterns, outputFile);

