#!/usr/bin/env bash

secret='beepboop'
tmpdir=/tmp/$(node -e '(Math.random()*Math.pow(2,32)).toString(16)')

echo $tmpdir
mkdir -p $tmpdir/hub
mkdir -p $tmpdir/drone0
mkdir -p $tmpdir/drone1

cd $tmpdir/hub
fleet hub --secret="$secret" --port=7000 >/dev/null &

echo hub listening on :7000

cd $tmpdir/drone0
fleet drone --secret="$secret" --hub=localhost:7000 >/dev/null &

cd $tmpdir/drone1
fleet drone --secret="$secret" --hub=localhost:7000 >/dev/null &

fleet monitor --secret="$secret" --hub=localhost:7000
