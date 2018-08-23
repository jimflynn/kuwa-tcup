cd ./faceRecognition
# npm install
forever start watcher_faceRecognition.js
cd ..

cd backend
# npm install
forever start server.js
cd ..

cd frontend
forever start -c "npm start" ./
cd ..