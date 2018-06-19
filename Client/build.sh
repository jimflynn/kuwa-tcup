#!/bin/bash

echo Welcome!

rm -rf cordovaClient/www
rm -rf apk

npm run build

cd cordovaClient
cordova build
cd ..

mkdir apk
cp cordovaClient/platforms/android/app/build/outputs/apk/debug/app-debug.apk apk/
mv apk/app-debug.apk apk/client.apk