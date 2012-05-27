#!/usr/bin/env node
var argv = require('optimist').argv;
argv._.splice(0, 1);
var fs = require('fs');
var path = require('path');

var git = require('../lib/git');
var remote = require('../lib/remote');

var cmd = argv._[0];

if (cmd === 'add') {
    var name = argv._[1] || 'default';
    remote.add(name, { hub : argv.hub, secret : argv.secret, env: argv.env });
}
else if (cmd === 'rm' || cmd === 'remove') {
    var name = argv._[1] || 'default';
    remote.remove(name);
}
else if (cmd === 'ls' || cmd === 'list') {
    console.log(JSON.stringify(remote.list(), undefined, 2));
}
else {
    console.error('Usage: fleet remote (add|rm|ls)');
}
