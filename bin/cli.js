#!/usr/bin/env node

var argv = require('optimist').argv;
var http = require('http');
var url = require('url');

var deploy = require('../lib/deploy')(argv._[0] || process.cwd());

var bouncy = require('bouncy');
bouncy(function (req, bounce) {
    bounce(deploy.routes[req.headers.host] || adminPort)
}).listen(argv.port || 80);

var adminPort = Math.floor(Math.random() * 5e4 + 1e4);
http.createServer(function (req, res) {
    var u = url.parse(req.url);
    
    var auth = (function () {
        var m = (req.headers.authorization || '').match(/^basic (\S+)/i);
        if (!m) return;
        var pair = Buffer(m[1], 'base64').toString().split(':');
        return { username : pair[0], password : pair[1] };
    })();
    
    if (!auth) {
        res.statusCode = 401;
        res.setHeader('www-authenticate', 'basic');
        res.end('authorization required');
    }
    else if (!authorized(auth.username, auth.password)) {
        res.statusCode = 403;
        res.setHeader('www-authenticate', 'basic');
        res.end('invalid password');
    }
    else if (req.method === 'GET' && u.pathname === '/') {
        res.setHeader('content-type', 'application/json');
        res.write(JSON.stringify(deploy.routes, undefined, 2));
        res.end('\r\n');
    }
    else deploy.handle(req, res)
}).listen(adminPort);

function authorized (user, pass) {
    if (user === 'beep' && pass === 'boop') {
        return true;
    }
    return false;
}
