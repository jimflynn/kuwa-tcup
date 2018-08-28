#!/bin/bash
echo =================================================================
echo Let\'s create some awesome documentation using documentation.js
echo =================================================================
echo 
echo =================================================================
echo Removing previous documentation
rm -rf Documentation
mkdir Documentation

echo =================================================================
echo Creating package.json
npm init -y
echo =================================================================
echo Installing documentation\.js
npm i --save-dev documentation

echo =================================================================
echo Creating documentation.html
cd Documentation
cat << _EOF_ > documentation.html
<!DOCTYPE html>
<html>
<head>
    <title>Kuwa-TCUP Project Documentation</title>
</head>

<body>
    <center><h1>Documentation</h1></center>
    <ul>
        <li><a href="Client/index.html">Client</a></li>
        <li><a href="Directory/index.html">Directory</a></li>
        <li><a href="Faucet/index.html">Faucet</a></li>
        <li><a href="Registrar/index.html">Registrar</a></li>
        <li><a href="RequestPasscode/index.html">Request Passcode</a></li>
        <li><a href="Sponsor/index.html">Sponsor</a></li>
        <li><a href="SmartContracts/index.html">Smart Contracts</a></li>
        <li><a href="StorageManager/index.html">Storage Manager</a></li>
    </ul>
</body>
</html>
_EOF_
cd ..

components='Client Directory Faucet Registrar RequestPasscode SmartContracts Sponsor StorageManager'
for component in $components
do
    echo =================================================================
    echo Creating Documentation for $component
    # rm -rf $component/docs
    cd $component
    mkdir tempDocuments
    find -name "*.js" -not -path "*/node_modules/*" -not -path "*/cordovaClient/*" -not -path "*/tempDocuments/*" -exec cp {} ./tempDocuments \;
    # find -name "*.sol" -not -path "*/node_modules/*" -not -path "*/cordovaClient/*" -not -path "*/tempDocuments/*" -exec cp {} ./tempDocuments \;
    ../node_modules/documentation/bin/documentation.js build tempDocuments/** -f html -o ../Documentation/$component --shallow
    rm -rf tempDocuments
    cd ..
done

echo =================================================================
echo Cleaning up!

npm uninstall documentation
rm -rf node_modules
rm -f package.json
rm -f package-lock.json
echo =================================================================
echo Done!
echo =================================================================
