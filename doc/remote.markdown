fleet-remote(1) -- manage the set of remote fleet hubs
======================================================

## SYNOPSIS

    fleet remote add <name> [<options>]
    fleet remote rm <name>
    fleet remote ls

## DESCRIPTION

This command will create and update a file called `fleet.json` in your git
project root so that you don't need to type `--hub` and `--secret` all the time.

## COMMANDS

### fleet remote add `<name>` [`<options>`]

Add a remote named `<name>` to store the parameters from `<options>`.

`<options>` can include:

* hub - where the fleet hub is running as a "host:port" string
* secret - the plaintext password to use for authentication
* env.`<name>` - Set environment variables to use with spawn and exec


Example usage:

    fleet remote add default --hub=10.0.5.2:6002 --secret=rawr

Add remote with environment variables:

    fleet remote add default --hub=10.0.5.2:6002 --secret=rawr --env.FOO=3 --env.BAR=kapow


### fleet remote rm `<name>`

Delete a remote named `<name>`.

### fleet remote ls

List all the remotes from the `fleet.json`.
