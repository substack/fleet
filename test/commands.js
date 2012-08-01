var test = require('tap').test;
var mkdirp = require('mkdirp');
var seq = require('seq');
var fs = require('fs');
var spawn = require('child_process').spawn;
var basedir = '/tmp/fleet-' +Math.floor(Math.random() * (1<<24));
var dir = {
    hub : basedir +'/hub',
    drone : [ 0, 1, 2 ].map(function (x) {
        return basedir +'/' +x;
    }),
    gitRepo: basedir +'/gitRepo',
};
var procs = { hub : null, drone : [] };
var port = Math.floor(Math.random() * 5e4 - 1e4) + 1e4;

dir.drone.concat(dir.hub).forEach(function (x) { 
    mkdirp.sync(x);
});

fs.mkdirSync(dir.gitRepo, 0700);

test('fleet hub', function (t) {
    var args = [ '--secret=abc', '--port=' +port ];
    procs.hub = fleet('hub.js', args, { cwd: dir.hub } );
    t.ok(procs.hub.pid, 'hub should have a pid');
    t.end();
});

test('fleet drone', function (t) {
    t.plan(3);
    dir.drone.forEach(function (cwd) {
        var args = [ '--secret=abc', '--hub=localhost:' +port ];
        procs.drone.push(fleet('drone.js', args, { cwd: cwd }))
        procs.drone[procs.drone.length-1]
            .stdout.on('data', function (data) {
                t.ok(String(data).match(/hub/), 'drone should output connection information');
            })
        ;
    });
});

test('git init, git add, git commit, fleet remote add, fleet deploy, fleet spawn', function (t) {
    t.plan(4);

    process.chdir(dir.gitRepo);

    seq()
        .seq(function () {
            var ps = spawn('git', [ 'init' ]);
            ps.stderr.pipe(process.stderr, { end : false });
            ps.on('exit', this.ok);
        })
        .seq(function () {
            fs.writeFile(dir.gitRepo + '/server.js', 'console.log("Hello World!")', this);
        })
        .seq(function () {
            spawn('git', [ 'add', 'server.js' ]).on('exit', this.ok);
        })
        .seq(function () {
            spawn('git', [ 'commit', '-am', '"Hello World!!"' ]).on('exit', this.ok);
        })
        .seq_(function (next) {
            var args = [ 'add', 'default', '--hub=localhost:' +port, '--secret=abc' ];
            fleet('remote.js', args, { cwd: dir.gitRepo } )
                .on('exit', function (code, signal) {
                    t.ok(true, 'fleet remote add default');
                    next();
                })
            ;
        })
        .seq_(function (next) {
            var ps = fleet('deploy.js', [], { cwd: dir.gitRepo } );
            ps.stderr.pipe(process.stderr, { end : false });
            ps.on('exit', function (code, signal) {
                t.ok(true, 'fleet deploy');
                next();
            });
        })
        .seq_(function (next) {
            var args = [ 'node', 'server.js' ];
            var ps = fleet('spawn.js', args, { cwd: dir.gitRepo } );
            ps.stderr.pipe(process.stderr, { end : false });
            ps.stdout.on('data', function (data) {
                t.ok(String(data).match(/spawned/), 'spawned should be matched in spawn');
            });
            ps.on('exit', function (code, signal) {
                t.ok(true, 'fleet spawn node server.js');
                next();
            });
        })
        .catch(t.fail)
    ;
});

test('fleet ps', function (t) {
    t.plan(4);
    var ps = fleet('ps.js', [], { cwd: dir.gitRepo } );
    ps.stderr.pipe(process.stderr, { end : false });
    ps.stdout.on('data', function (data) {
        t.ok(String(data).match(/drone/), 'drone should be matched in ps');
    });
    ps.on('exit', function (code, signal) {
        t.ok(true, 'fleet ps');
    });
})

test('fleet drone stop', function (t) {
    procs.drone.forEach(function (drone) {
        t.ok(drone.pid, 'the drone should have a pid')
        t.test('should each stop', function (t) {
            drone
                .on('exit', function (code, signal) {
                    t.ok(drone.killed, 'drone should stop');
                    t.end();
                })
            ;
            drone.kill('SIGHUP');
        });
    });
});

test('fleet hub stop', function (t) {
    procs.hub
        .on('exit', function (code, signal) {
            t.ok(procs.hub.killed, 'hub should stop');
            t.end();
        })
    ;
    procs.hub.kill('SIGHUP');
});

function fleet (cmd, args, opts) {
    return spawn(__dirname +'/../bin/' +cmd, args, opts);
}
