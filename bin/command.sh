#!/usr/bin/env bash
if test -z "$*"; then
  fleet-help
else
  fleet-$*
fi
