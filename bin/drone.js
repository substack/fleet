#!/usr/bin/env node
var argv = require('optimist').argv;
argv._.splice(0, 1);
var propagit = require('propagit');
var drone = propagit(argv).drone();

var emit = function () {
    var args = [].slice.call(arguments);
    drone.hub(function (hub) {
        hub.emit.apply(null, args);
    })
};

drone.on('error', function (err) {
    emit('error', err);
    console.error(err && err.stack || err);
});

drone.on('deploy', function (deploy) {
    emit('deploy', deploy);
    console.log(
        '(deployed '
        + deploy.repo + '/' + deploy.commit.slice(8)
        + ')'
    );
});

drone.on('spawn', function (proc) {
    emit('spawn', proc);
    console.log(
        '(spawned ' + proc.id + '#' + proc.repo + '.' + proc.commit.slice(8)
        + ' : ' + proc.command.join(' ') + ')'
    );
});

drone.on('exit', function (code, sig, opts) {
    emit('exit', code, sig, opts);
    console.error(
        '(exited '
        + opts.id + '#' + opts.repo + '.' + opts.commit.slice(8)
        + ' with code ' + code
        + ' from signal ' + sig
        + ': ' + opts.command.join(' ')
        + ')'
    );
});

drone.on('stdout', function (buf, opts) {
    emit('stdout', buf.toString(), opts);
    console.log(
        '[' + opts.id + '#' + opts.repo + '.' + opts.commit.slice(8)
        + '] ' + buf.toString().replace(/\n$/, '')
    );
});

drone.on('stderr', function (buf, opts) {
    emit('stderr', buf.toString(), opts);
    console.log(
        '[' + opts.id + '#' + opts.repo + '.' + opts.commit.slice(8)
        + '] ' + buf.toString().replace(/\n$/, '')
    );
});

drone.on('up', function () {
    console.log('connected to the hub');
});

drone.on('reconnect', function () {
    console.log('reconnecting to the hub');
});

drone.on('down', function () {
    console.log('disconnected from the hub');
});
