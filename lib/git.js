var exec = require('child_process').exec;
var spawn = require('child_process').spawn;
var path = require('path');

exports.commit = function (cb) {
    exec('git log | head -n1', function (err, stdout, stderr) {
        if (err) cb(err)
        else if (stderr) cb(new Error(stderr))
        else cb(null, stdout.trim().split(/\s+/)[1]);
    });
};

exports.push = function push (remote, branch, cb) {
    if (typeof branch === 'function') {
        cb = branch;
        branch = undefined;
    }
    
    if (!branch) return exports.branchName(function (err, b) {
        if (err) cb(err)
        else push(remote, b, cb)
    });
    
    var ps = spawn('git', [ 'push', remote, branch ]);

    ps.stdout.on('data', function (data) {
      console.log(String(data));
    });

    ps.stderr.on('data', function (data) {
      console.error(String(data));
    });

    ps.on('exit', function (code, sig) {
        if (code !== 0) cb(new Error('caught signal ' + sig + ', code ' + code))
        else cb(null)
    });
};

exports.repoName = function () {
    var dir = exports.dir()
    return dir.split('/').slice(-1)[0];
};

exports.dir = function (cwd) {
    var ps = (cwd || process.cwd()).split('/');
    for (var i = ps.length; i > 0; i--) {
        var dir = ps.slice(0, i).join('/');
        if (fs.existsSync(dir + '/.git')) {
            return dir;
        }
    }
};

exports.branchName = function (cb) {
    exec('git branch', function (err, stdout, stderr) {
        if (err) cb(err)
        else if (stderr) cb(new Error(stderr))
        else {
            var branch = stdout.split('\n').filter(function (line) {
                return /^\*/.test(line)
            })[0].replace(/^\*\s*/, '');
            cb(null, branch);
        }
    });
};
