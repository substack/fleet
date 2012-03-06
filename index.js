var argv = require('./lib/argv');
var propagit = require('propagit');
var EventEmitter = require('events').EventEmitter;

function Commands (opts) {
    this.opts = opts
}
Commands.prototype.ps = function (cb) {
    var p = propagit(this.opts);
    p.on('error', function (err) {
        cb(err);
    });
    p.hub.on('up', function (hub) {
        var em = new EventEmitter;
        var obj = {};

        em.on('data', function (key, procs) {
            obj[key] = procs
        });

        em.on('end', function () {
            cb(null, obj)
        });

        hub.ps(em.emit.bind(em));
    });
}
Commands.prototype.stop = function (pid, cb) {
    var self = this;
    var p = propagit(self.opts);
    var called = false;
    p.on('error', function (err) {
        if (!called) cb(err);
        called = true;
    });

    p.hub(function (hub) {
        var opts = {
            drone : self.opts.drone,
            drones : self.opts.drones,
            pid : pid
        };
        hub.stop(opts, function (drone) {
            p.hub.close();
            if (!called) cb(null, drone);
            called = true;
        });
    });
}

module.exports = function (opts) {
    return new Commands(opts)
}


