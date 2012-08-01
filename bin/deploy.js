#!/usr/bin/env node
var propagit = require('propagit');

var git = require('../lib/git');
var argv = require('../lib/argv');
if (!argv.hub) return console.error('Specify a --hub or set a remote.');

var p = propagit(argv);
p.on('error', function (err) {
    console.log(err.stack || err.toString());
});

p.hub(function (hub) {
    var opts = {
        repo : argv.repo || git.repoName(),
        commit : argv.commit
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
            deploy(hub, opts);
        }
    })
    else deploy(hub, opts);
});

function deploy (hub, opts) {
    var ref = (function () {
        var auth = argv.secret
            ? 'git:' + encodeURIComponent(argv.secret) + '@'
            : ''
        ;
        var uri = argv.git;
        if (!uri) {
            var xs = argv.hub.split(':');
            var gitPort = argv.gitPort
                || argv.gitport
                || parseInt(xs[1], 10) + 1
            ;
            uri = xs[0] + ':' + gitPort;
        }
        var r = opts.repo.replace(/(\.git)?$/, '.git');
        return 'http://' + auth + uri + '/' + r;
    })();
    
    git.push(ref, function (err) {
        if (err) {
            console.error(err);
            p.hub.close();
        }
        else hub.deploy(opts, function (errors) {
            if (errors) {
                errors.forEach(function (err) {
                    console.error(
                        '[' + err.drone + '] '
                        + (err.code === 128 ? 'already at latest' : err)
                    );
                });
            }
            else {
                console.log('deployed ' + opts.repo + '/' + opts.commit);
            }
            p.hub.close();
        });
    });
}
