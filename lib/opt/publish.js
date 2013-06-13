'use strict';

var node_path = require('path');
var fs = require('fs-sync');

exports.offset = 3;

exports.list = {
	cwd: {
		type: node_path,
		short: 'c',
		value: process.cwd(),
		info: 'Specify the current working directory.'
	},

	force: {
		type: Boolean,
		info: 'if `true`, cortex will force to publishing existing module.'
	},

	tar: {
		type: node_path,
		value: function(tar, parsed) {
		    if(!tar){
		    	if(parsed.remain.length){
		    		tar = parsed.remain[0];
		    	}
		    }

		    if(!tar){
		    	return null;
		    }

		    if(!fs.isPathAbsolute(tar)){
		    	tar = node_path.resolve(parsed.cwd, tar);
		    }

		    if(!fs.isFile(tar)){
		    	process.stdout.write('error `tar` parameter: `tar` does not exist or is not a file.\n');
		    	process.exit(1);
		    }

		    return tar;
		}
	}
};

exports.info = 'Publish a module to npm server';

exports.usage = [
	'ctx publish [options]',
	'ctx publish <tarfile> [options]'
];