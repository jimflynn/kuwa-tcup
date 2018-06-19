#!/bin/bash

echo Welcome!

if [ ! -d cordovaClient ]; then
    cordova create cordovaClient org.kuwa.client KuwaClient
    wait
    cd cordovaClient
    cordova platform add android
    wait
    cd ..
fi

wait
rm -rf cordovaClient/www
rm -rf apk

npm run build

cd cordovaClient
cordova build
cd ..

mkdir apk
cp cordovaClient/platforms/android/app/build/outputs/apk/debug/app-debug.apk apk/
mv apk/app-debug.apk apk/client.apk