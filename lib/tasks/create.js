var utils = require('../utils');
var file = require('../utils/file');
var _ = require('underscore');
var fs = require('fs');
var mkdirp = require('mkdirp');

exports.summary = 'Generate project skeleton and create project directory';

exports.usage = '<project> [options]';

exports.options = {
    "template" : {
        alias : 't'
        ,describe: 'destination template'
    },
    "dest" : {
        alias : 'd'
        ,default: '.'
        ,describe: 'target project directory'
    },
    "mod" : {
        type: 'Boolean'
        ,describe: 'create a mod files in target directory'
    },
    "json" : {
        type: 'Boolean'
        ,describe: 'create a package.json file in target directory'
    },
    "git" : {
        type: 'Boolean'
        ,describe: 'create git files in target directory'
    },
    "readme" : {
        type: 'Boolean'
        ,describe: 'create a README.md file in target directory'
    },
    "mocha" : {
        type: 'Boolean'
        ,describe: 'create test files in target directory'
    }
};


exports.run = function (options, callback) {

    //console.log(args.argv);
    var project = options.project;
    options.dest = project;

    mkdirp.sync(project);
    exports.runTask('init', options, callback);

};
