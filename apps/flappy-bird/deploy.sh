#!/usr/bin/env bash

npm run gh-pages -- --dist dist/apps/flappy-bird --before-add $(pwd)/$(dirname $0)/cleanup.js
