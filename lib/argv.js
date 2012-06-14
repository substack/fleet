var remote = require('./remote');
var argv = module.exports = require('optimist').argv;

// bare args with a leading + are remotes
var args = argv._.reduce(function (acc, arg) {
    if (/^\+/.test(arg)) acc.remote = arg
    else acc._.push(arg)
    return acc;
}, { _ : [] });
argv.remote = argv.remote || args.remote;
argv._ = args._;

if (typeof argv.drone === 'string' && argv.drone.match(/^\/.*\/\w*$/)) {
    var m = argv.drone.match(/^\/(.*)\/(\w*$)/);
    argv.drone = new RegExp(m[1], m[2]);
}

var target = remote.get(argv.remote || 'default');
if (target && !argv.hub) argv.hub = target.hub;
if (target && !argv.secret) argv.secret = target.secret;

if (target && !argv.env) {
    argv.env = argv.env || {};
    for(var key in target.env) {
        if (!argv.env[key]) {
            argv.env[key] = target.env[key];
        }
    }
}
