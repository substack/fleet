#!/usr/bin/env node
var path = require('path'), fs = require('fs'), argv = require('optimist').argv;
var page = !argv._[1] || argv._[1] == 'commands' ? 'commands' : argv._[1];
var fn = path.join(__dirname, '../doc', page) + (page == 'commands' ? '' : '.markdown');

if (!path.existsSync(fn)) fn = path.join(__dirname, '../doc/commands');

console.error(fs.readFileSync(fn, 'utf8'));