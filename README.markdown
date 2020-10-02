Fleet
=====

Command an armada of processes in a cluster.

This module integrates with git using
[propagit](https://github.com/substack/propagit),
to make rolling out new code to a bunch of worker drones super simple!

[![build status](https://secure.travis-ci.org/substack/fleet.png)](http://travis-ci.org/substack/fleet)

![fleet](http://substack.net/images/fleet.png)

Install
=======

With [npm](http://npmjs.org) do:

```
npm install -g fleet
```

Example
=======

In a fresh directory, start a fleet hub:

```
$ fleet hub --port=7000 --secret=beepboop
```

in another fresh directory start a drone:

```
$ fleet drone --hub=localhost:7000 --secret=beepboop
```

You can start as many drones as you want in fresh directories.

Now from a git repo, set a remote:

```
$ fleet remote add default --hub=localhost:7000 --secret=beepboop
```

Now deploy your code to all the drones:

```
$ fleet deploy
```

Deploying just checks out your commit to a fresh directory on every drone.

To run a process on the latest commit do:

```
$ fleet spawn -- node beep.js 8080
```

To see the process list across all your drones do:

```
$ fleet ps
```

Commands
========

```
Usage: fleet <command> [<args>]

The commands are:
  deploy   Push code to drones.
  drone    Connect to a hub as a worker.
  exec     Run commands on drones.
  hub      Create a hub for drones to connect.
  monitor  Show service events system-wide.
  ps       List the running processes on the drones.
  remote   Manage the set of remote hubs.
  spawn    Run services on drones.
  stop     Stop processes running on drones.
  version  Print fleet's version

For help about a command, try `fleet help <command>`.
```

Tips
====

* Fleet will acutally use two ports one for the control service and one for the git service. So if you start Fleet on port 7000 it will also use port 7001.

License
=======

MIT
