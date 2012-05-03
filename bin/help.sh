#!/usr/bin/env bash
rootdir=$(fleet rootdir)

if test -z "$1" || test "$1" = "commands"; then
    cat "$rootdir/doc/commands"
elif test -e "$rootdir/man1/$1.1"; then
    man "$rootdir/man1/$1.1"
else 
    echo "No manual entry for fleet $1"
fi
