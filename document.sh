#!/bin/bash
echo =================================================================
echo Let\'s create some awesome documentation using documentation.js
echo =================================================================
echo 
echo =================================================================
echo Removing previous documentation

components='Client Directory Faucet Registrar RequestPasscode SmartContracts Sponsor StorageManager'
# components='SmartContracts Sponsor'

for component in $components
do
    echo $component
    rm -rf $component/docs
done

rm -f index.html

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
        <li><a href="RequestPasscode/docs/index.html">Request Passcode</a></li>
        <li><a href="Sponsor/docs/index.html">Sponsor</a></li>
        <li><a href="SmartContracts/docs/index.html">Smart Contracts</a></li>
        <li><a href="StorageManager/docs/index.html">Storage Manager</a></li>
    </ul>
</body>
</html>
_EOF_


for component in $components
do
    echo =================================================================
    echo Creating Documentation for $component
    rm -rf $component/docs
    cd $component
    mkdir tempDocuments
    find -name "*.js" -not -path "*/node_modules/*" -not -path "*/cordovaClient/*" -not -path "*/tempDocuments/*" -exec cp {} ./tempDocuments \;
    # find -name "*.sol" -not -path "*/node_modules/*" -not -path "*/cordovaClient/*" -not -path "*/tempDocuments/*" -exec cp {} ./tempDocuments \;
    ../node_modules/documentation/bin/documentation.js build tempDocuments/** -f html -o docs --shallow
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