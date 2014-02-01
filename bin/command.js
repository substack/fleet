#!/usr/bin/env node
var spawn = require('child_process').spawn,
	join = require('path').join;

function fleet (node, cmd, args, opts) {
	var command = join(__dirname, cmd + ".js");
	args[0] = command;
    return spawn(node, args);
}
//console.log(process.argv)
//console.log(process.argv.splice(2))
var cmd = process.argv[2]
var args = process.argv.splice(2)
var node = process.argv[0]
var proc = fleet(node, cmd, args)

proc.stdout.pipe(process.stdout)
proc.stderr.pipe(process.stderr)
