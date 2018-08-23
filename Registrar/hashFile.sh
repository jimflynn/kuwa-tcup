cd ./fileHash
# npm install
forever start watcher_fileHash.js
cd ..

cd backend
# npm install
forever start server.js
cd ..

cd frontend
forever start -c "npm start" ./
cd ..