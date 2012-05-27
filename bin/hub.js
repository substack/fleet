#!/usr/bin/env node
var propagit = require('propagit');
var argv = require('optimist').argv;
argv._.splice(0, 1);

var cport = argv.cport || argv.port || argv._[0];
var gport = argv.gport || cport + 1;
var prop = propagit(argv).listen(cport, gport);

var subs = {};
prop.use(function (service, conn) {
    service.emit = function () {
        var args = [].slice.call(arguments);
        Object.keys(subs).forEach(function (key) {
            subs[key].apply(null, args);
        });
    };
    
    service.subscribe = function (emit) {
        if (typeof emit === 'function') {
            conn.once('end', function () {
                delete subs[conn.id];
            });
            subs[conn.id] = emit;
            emit('ready');
        }
    };
});
