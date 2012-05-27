#!/usr/bin/env node
var argv = require('../lib/argv');
if (!argv.hub) return console.error('Specify a --hub or set a remote.');

var propagit = require('propagit');
var git = require('../lib/git');

var EventEmitter = require('events').EventEmitter;

var p = propagit(argv);
p.on('error', function (err) {
    console.dir(err);
});

p.hub(function (hub) {
    // translate *--escaped into --escaped
    argv._ = argv._.map(function(x) { return x.replace(/^\*--/, '--'); });

    var opts = {
        drone : argv.drone,
        drones : argv.drones,
        repo : argv.repo || git.repoName(),
        commit : argv.commit,
        command : argv._,
        env : argv.env || {},
        cwd : argv.cwd,
        once : true
    };
    if (!opts.repo) {
        console.error('specify --repo or navigate to a git repo');
        return;
    }
    if (!opts.commit) git.commit(function (err, commit) {
        if (err) {
            console.error(err);
            p.hub.close();
        }
        else {
            opts.commit = commit;
            spawn(hub, opts);
        }
    })
    else spawn(hub, opts);
});

function spawn (hub, opts) {
    var em = new EventEmitter;
    hub.subscribe(em.emit.bind(em));
    em.on('ready', function () {
        hub.spawn(opts, function (err, procs) {
            if (err) {
                console.error(err)
                p.hub.close();
            }
            else {
                em.on('stdout', function (buf, proc) {
                    if (procs[proc.drone] !== proc.id) return;
                    console.log(
                        '[' + proc.drone + '#' + proc.id + '] '
                        + buf.replace(/\n$/, '')
                    );
                });
                em.on('stderr', function (buf, proc) {
                    if (procs[proc.drone] !== proc.id) return;
                    console.log(
                        '[' + proc.drone + '#' + proc.id + '] '
                        + buf.replace(/\n$/, '')
                    );
                });
                em.on('exit', function (code, sig, proc) {
                    if (procs[proc.drone] !== proc.id) return;
                    console.log('(' + proc.drone + '#' + proc.id + ' exited)');
                    p.hub.close();
                });
            }
        });
    });
}
