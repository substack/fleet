#!/usr/bin/env node
var argv = require('../lib/argv');
if (!argv.hub) return console.error('Specify a --hub or set a remote.');

var propagit = require('propagit');
var git = require('../lib/git');

var p = propagit(argv);
p.on('error', function (err) {
    console.dir(err);
});

if (argv._.length === 0) {
    console.error('Usage: fleet stop PID');
    process.exit();
}

p.hub(function (hub) {
    var opts = {
        drone : argv.drone,
        drones : argv.drones,
        pid : argv._.map(function (x) { return x.toString().replace(/^pid#/, '') }),
    };
    hub.stop(opts, function (err, drones) {
        Object.keys(drones).forEach(function (id) {
            console.log('[' + id + '] stopped ' + drones[id].join(' '));
        });
        p.hub.close();
    });
});
