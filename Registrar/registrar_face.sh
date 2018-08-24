#!/bin/bash

# Check if node modules for utility files present
if [ -d "node_modules" ]; then
	echo "=============================="
	echo "node_modules exists for utility files. Skipping installation of packages."
	echo "=============================="
else
	echo "=============================="
	echo "node_modules not found for utility files. Installing necessary packages from package.json..."
	echo "=============================="
	npm install
fi

# Start the watcher
cd ./faceRecognition
if [ -d "node_modules" ]; then
	echo "=============================="
	echo "node_modules exists for Watcher. Skipping installation of packages."
	echo "=============================="
else
	echo "=============================="
	echo "node_modules not found for Watcher. Installing necessary packages from package.json..."
	echo "=============================="
	npm install
fi
forever start watcher_faceRecognition.js
cd ..

# Start the UI backend
cd backend
if [ -d "node_modules" ]; then
	echo "=============================="
	echo "node_modules exists for Backend. Skipping installation of packages."
	echo "=============================="
else
	echo "=============================="
	echo "node_modules not found for Backend. Installing necessary packages from package.json..."
	echo "=============================="
	npm install
fi
forever start server.js
cd ..

# Start the UI frontend
cd frontend
if [ -d "node_modules" ]; then
	echo "=============================="
	echo "node_modules exists for Frontend. Skipping installation of packages."
	echo "=============================="
else
	echo "=============================="
	echo "node_modules not found for Frontend. Installing necessary packages from package.json..."
	echo "=============================="
	npm install
fi
forever start -c "npm start" ./
cd ..