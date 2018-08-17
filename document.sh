#!/bin/bash
echo =================================================================
echo Let\'s create some awesome documentation using documentation.js
echo =================================================================
echo 
echo =================================================================
echo Removing previous documentation

rm -f index.html
rm -rf Client/docs
rm -rf Directory/docs
rm -rf Faucet/docs
rm -rf Registrar/docs
rm -rf RequestPasscode/request_passcode/docs
rm -rf SmartContracts/docs
rm -rf Sponsor/docs
rm -rf StorageManager/docs

echo =================================================================
echo Creatig package.json
npm init -y
echo =================================================================
echo Installing documentation\.js
npm i --save-dev documentation

echo =================================================================
echo Creating index.html
cat << _EOF_ > index.html
<!DOCTYPE html>
<html>
<head>
    <title>Universal Basic Income Documentation</title>
</head>

<body>
    <center><h1>Documentation</h1></center>
    <ul>
        <li><a href="Client/docs/index.html">Client</a></li>
        <li><a href="Directory/docs/index.html">Directory</a></li>
        <li><a href="Faucet/docs/index.html">Faucet</a></li>
        <li><a href="Registrar/docs/index.html">Registrar</a></li>
        <li><a href="RequestPasscode/request_passcode/docs/index.html">Request Passcode</a></li>
        <li><a href="SmartContracts/docs/index.html">Smart Contracts</a></li>
        <li><a href="StorageManager/docs/index.html">Storage Manager</a></li>
    </ul>
</body>
</html>
_EOF_

echo =================================================================
echo Creating Documentation!
node_modules/documentation/bin/documentation.js build Client/src/js/** -f html -o Client/docs --shallow
node_modules/documentation/bin/documentation.js build Directory/** -f html -o Directory/docs --shallow
node_modules/documentation/bin/documentation.js build Faucet/** -f html -o Faucet/docs --shallow
node_modules/documentation/bin/documentation.js build Registrar/** -f html -o Registrar/docs --shallow
node_modules/documentation/bin/documentation.js build RequestPasscode/request_passcode/src/** -f html -o RequestPasscode/request_passcode/docs --shallow
node_modules/documentation/bin/documentation.js build SmartContracts/** -f html -o SmartContracts/docs --shallow
node_modules/documentation/bin/documentation.js build Sponsor/** -f html -o Sponsor/docs --shallow
node_modules/documentation/bin/documentation.js build StorageManager/** -f html -o StorageManager/docs --shallow

echo =================================================================
echo Cleaning up!

npm uninstall documentation
rm -rf node_modules
rm -f package.json
rm -f package-lock.json
echo =================================================================
echo Done!
echo =================================================================