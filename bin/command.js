#!/usr/bin/env node
var spawn = require('child_process').spawn,
	join = require('path').join,
	fs = require('fs');

function fleet (node, cmd, args, opts) {
	var command = join(__dirname, cmd + ".js");
	args[0] = command;
    return spawn(node, args);
}

if (process.argv.length < 3) {
	require('./help.js');
} else if (process.argv.indexOf('-v') !== -1 ||
	process.argv.indexOf('--version') !== -1) {
	console.log(require('../package.json').version);
} else {
	var cmd = process.argv[2]
	var args = process.argv.splice(2)
	var node = process.argv[0]
	var fname = join(__dirname, cmd + ".js");
	if (!fs.existsSync(fname)) {
		console.log('Fleet command ' + cmd + ' not recongized.')
		console.log('Type `fleet help` to see a list of all commands')
	} else {
		var proc = fleet(node, cmd, args)
		proc.stdout.pipe(process.stdout)
		proc.stderr.pipe(process.stderr)
	}

}
