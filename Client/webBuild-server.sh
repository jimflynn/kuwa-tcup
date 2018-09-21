#!/bin/bash

# This scrips rebuilds the Web client. It will store the new version in the "webBuild" directory.

rm -rf cordovaClient/www
npm run build

rm -rf webBuild
mkdir webBuild

cp -r cordovaClient/www/* webBuild/
