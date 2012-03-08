#!/usr/bin/env node
var argv = require('../lib/argv');
var propagit = require('propagit');
var EventEmitter = require('events').EventEmitter;

var p = propagit(argv);
p.on('error', function (err) {
    console.dir(err);
});

p.hub.on('up', function (hub) {
    var em = new EventEmitter;
    
    em.on('deploy', function (deploy) {
        console.log(
            '(deployed '
            + deploy.drone + '#' + deploy.repo + '/' + deploy.commit
            + ')'
        );
    });
    
    em.on('spawn', function (proc) {
        console.log(
            '(spawned '
            + proc.drone + '#' + proc.id
            + ' : ' + proc.command.join(' ')
            + ')'
        );
    });
    
    em.on('stdout', function (buf, proc) {
        console.log(
            '[' + proc.drone + '#' + proc.id + '] '
            + buf.replace(/\n$/, '')
        );
    });
    
    em.on('stderr', function (buf, proc) {
        console.log(
            '[' + proc.drone + '#' + proc.id + '] '
            + buf.replace(/\n$/, '')
        );
    });
    
    em.on('exit', function (code, sig, proc) {
        console.log(
            '(exited '
            + proc.drone + '#' + proc.id
            + ' : ' + proc.command.join(' ')
            + ')'
        );
    });
    
    hub.subscribe(em.emit.bind(em));
});
