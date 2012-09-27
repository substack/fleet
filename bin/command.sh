#!/bin/bash
dirname="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

if test -z "$*"; then
  $dirname/fleet-help
elif test "$*" = '-v' || test "$*" = '--version'; then
  $dirname/fleet-version
elif test -f "$dirname/fleet-$1"; then
  $dirname/fleet-$*
else
  echo "Fleet command \"$1\" not recognized."
  echo 'Type `fleet help` to see a list of all commands.'
fi
