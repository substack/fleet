var fs = require('fs');
var path = require('path');
var extend = require('extend');
var existsSync = fs.existsSync || path.existsSync;

var git = require('./git');
var gitDir = git.dir();
var fleetFile = gitDir + '/fleet.json';
var homeFleetFile = path.join(process.env.HOME || '/root', 'fleet.json');

var remote = {};
if (existsSync(homeFleetFile)) {
    var obj = JSON.parse(fs.readFileSync(homeFleetFile));
    remote = obj.remote || {};
}

if (existsSync(fleetFile)) {
    var obj = JSON.parse(fs.readFileSync(fleetFile));
    extend(remote, obj.remote || {})
}

function save () {
    var obj = { remote : remote };
    fs.writeFileSync(fleetFile, JSON.stringify(obj, undefined, 2) + '\n');
}

exports.add = function (name, opts) {
    remote[name] = opts;
    save();
};

exports.remove = function (name) {
    delete remote[name];
    save();
};

exports.list = function () {
    return remote;
};

exports.get = function (name) {
    return remote[name];
};
