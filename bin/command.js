#!/usr/bin/env node
var path = require('path'), argv = require('optimist').argv;
var cmd = argv._.length ? argv._[0] : 'help';

if (!path.existsSync(path.join(__dirname, cmd) + '.js')) cmd = 'help';

require(path.join(__dirname, cmd) + '.js');