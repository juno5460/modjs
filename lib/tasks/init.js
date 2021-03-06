var utils = require('../utils');
var file = require('../utils/file');
var format = require('../utils/format');
var _ = require('underscore');
var fs = require('fs');
var path = require('path');

exports.summary = 'Generate project skeleton from templates';

exports.usage = '[project] [options]';

exports.options = {
    "project" : {
        alias : 'p'
        ,describe: 'project name'
    },
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
    var project = options.project || options._[1] || '';
    var dest = options.dest;
    var template = options.template;

    var templateData = {
        'project' : project,
        'Project' :  format.ucfirst(project),
        // FIXME: set name as project name
        'name' : project
    };

    // TODO prompt template data

    var generators = [];
    var baseGenerators = ['json', 'mocha', 'git', 'mod', 'readme'];
    var isCustomBaseGenerators = false;
    baseGenerators.forEach(function(val){
        if(options[val]){
            generators.push(val);
            isCustomBaseGenerators = true;
        }

    });

    if(!isCustomBaseGenerators) {
        generators = baseGenerators;
    }

    if(template){
        // check template existed
        var templateDir =  path.resolve(__dirname, '../generators/' + template);
        if( file.exists(templateDir) ) {
            generators.push( template );
        }else{
            return callback(template + ' is not existed');
        }
    }

    var tempDest = file.mkdirTemp();
    generators.forEach(function(val){
        var dir = path.resolve(__dirname, '../generators/'+ val);
        file.copy(dir, tempDest);
    });

    var tempDestPattern = path.join(tempDest, "**/*");
    file.glob(tempDestPattern).forEach(function(inputFile){

        if(file.isFile(inputFile) && file.isPlaintextFile(inputFile)){
            var contents = file.read(inputFile);
            var result = format.template(contents ,templateData);
            // filename or directory also could be naming as template format
            var outputFile = format.template(inputFile, templateData);

            if(inputFile !== outputFile){
                file.delete(inputFile);
            }
            file.write(outputFile, result);
            exports.log(path.relative(tempDest, outputFile));

        }else{
            exports.log(path.relative(tempDest, inputFile));
        }

    });

    // copy temp dir files to project dir
    file.copy(tempDest, dest);
    file.delete(tempDest);
    callback();


};
