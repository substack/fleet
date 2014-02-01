#!/usr/bin/env node
var fs = require('fs'),
	spawn = require('child_process').spawn

if (process.argv.length < 3) {
	var help = fs.readFileSync(__dirname + '/../doc/commands', 'utf8')
	console.log(help)
} else if (fs.existsSync(__dirname + '/../man/' + process.argv[2] + '.1')) {
	var man = spawn('man', [__dirname + '/../man/' + process.argv[2] + '.1'])
	man.stdout.pipe(process.stdout)
	man.stderr.pipe(process.stderr)
} else {
	console.log('No manual entry for fleet ' + process.argv[2])
}
