#!/bin/bash

echo Welcome!

if [ ! -d cordovaClient ]; then
    cordova create cordovaClient org.kuwa.client KuwaClient
    wait
    cd cordovaClient
    cordova platform add android
    wait
    cordova plugin add cordova-plugin-media-capture
    wait
    cordova plugin add cordova-plugin-android-permissions
    wait
    cordova plugin add cordova-plugin-file-transfer
    wait
    cordova plugin add cordova-plugin-device
    wait
    cordova plugin add cordova-plugin-dialogs
    wait
    cordova plugin add cordova-plugin-file
    wait
    cordova plugin add cordova-plugin-camera
    wait
    cordova plugin add cordova-plugin-splashscreen
    wait
    cordova plugin add cordova-plugin-qrscanner
    wait
    cordova plugin add cordova-plugin-screen-orientation
    wait
    cordova plugin add cordova-plugin-email-composer
    wait
    cordova plugin add cordova-plugin-customurlscheme --variable URL_SCHEME=kuwaregistration
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