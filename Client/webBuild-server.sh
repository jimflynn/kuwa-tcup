#!/bin/bash
rm -rf cordovaClient/www
npm run build

rm -rf webBuild
mkdir webBuild

cp -r cordovaClient/www/* webBuild/
