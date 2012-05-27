#!/usr/bin/env bash
mkdir -p man1

for file in doc/*.markdown; do
    ./node_modules/.bin/ronn --roff "$file" \
        > man1/$(echo "$file" | sed -e 's/\.markdown$/.1/; s/^doc\///')
done
